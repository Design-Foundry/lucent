export interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface NormalNode {
	tag: string;
	text?: string;
	classes: string[];
	attrs: Record<string, string>;
	children: NormalNode[];
	part?: string;
	box?: Box;
	styles?: Record<string, string>;
	inlineStyle?: string;
}

/** Runs in the page: no references outside its own body. */
export function snapshotStage(properties: string[]): NormalNode {
	const KEPT = /^(data-.*|role|aria-.*|type|disabled|readonly|tabindex)$/;
	const stage = document.getElementById('stage')!;
	const origin = stage.getBoundingClientRect();

	function partOf(classes: string[]): string | undefined {
		const lucent = classes.filter((c) => c.startsWith('lucent-') && !c.includes('--'));
		return lucent.find((c) => c.includes('__')) ?? lucent[0];
	}

	function visit(el: Element): NormalNode {
		const classes = [...el.classList].filter((c) => c.startsWith('lucent-') || c.startsWith('is-')).sort();
		const attrs: Record<string, string> = {};
		for (const a of [...el.attributes].sort((x, y) => x.name.localeCompare(y.name))) {
			if (KEPT.test(a.name)) attrs[a.name] = a.value;
		}
		const children: NormalNode[] = [];
		for (const child of el.childNodes) {
			if (child.nodeType === Node.ELEMENT_NODE) children.push(visit(child as Element));
			else if (child.nodeType === Node.TEXT_NODE) {
				const text = child.textContent!.trim();
				if (text) children.push({ tag: '#text', text, classes: [], attrs: {}, children: [] });
			}
		}
		const node: NormalNode = { tag: el.tagName.toLowerCase(), classes, attrs, children };
		const inline = el.getAttribute('style');
		if (inline) node.inlineStyle = inline;
		const part = partOf(classes);
		if (part) {
			const r = el.getBoundingClientRect();
			const cs = getComputedStyle(el);
			node.part = part;
			node.box = { x: r.x - origin.x, y: r.y - origin.y, width: r.width, height: r.height };
			node.styles = Object.fromEntries(properties.map((p) => [p, cs.getPropertyValue(p)]));
		}
		return node;
	}

	return { tag: 'stage', classes: [], attrs: {}, children: visit(stage).children };
}

function label(node: NormalNode): string {
	return node.part ?? node.tag;
}

function tagsMatch(reference: string, kit: string): boolean {
	return reference === kit || kit.includes('-');
}

export function domDiff(reference: NormalNode, kit: NormalNode, path = 'stage'): string[] {
	const out: string[] = [];
	if (!tagsMatch(reference.tag, kit.tag)) out.push(`${path}: tag ${reference.tag} in reference, ${kit.tag} in kit`);
	if (reference.text !== kit.text) out.push(`${path}: text "${reference.text ?? ''}" in reference, "${kit.text ?? ''}" in kit`);

	const missing = reference.classes.filter((c) => !kit.classes.includes(c));
	const extra = kit.classes.filter((c) => !reference.classes.includes(c));
	if (missing.length) out.push(`${path}: missing classes ${missing.join(' ')}`);
	if (extra.length) out.push(`${path}: extra classes ${extra.join(' ')}`);

	for (const name of new Set([...Object.keys(reference.attrs), ...Object.keys(kit.attrs)])) {
		const r = reference.attrs[name];
		const k = kit.attrs[name];
		if (r !== k) out.push(`${path}: attribute ${name} is ${show(r)} in reference, ${show(k)} in kit`);
	}

	if (reference.children.length !== kit.children.length) {
		out.push(
			`${path}: children [${reference.children.map(label).join(', ')}] in reference, [${kit.children.map(label).join(', ')}] in kit`,
		);
	}
	const n = Math.min(reference.children.length, kit.children.length);
	for (let i = 0; i < n; i++) {
		out.push(...domDiff(reference.children[i], kit.children[i], `${path} > ${label(reference.children[i])}`));
	}
	return out;
}

export function styleDiff(reference: NormalNode, kit: NormalNode, path = 'stage'): string[] {
	const out: string[] = [];
	if (reference.box && kit.box) {
		for (const key of ['x', 'y', 'width', 'height'] as const) {
			if (Math.abs(reference.box[key] - kit.box[key]) > 0.5) {
				out.push(`${path}: box ${key} ${round(reference.box[key])} in reference, ${round(kit.box[key])} in kit`);
			}
		}
	}
	if (reference.styles && kit.styles) {
		for (const [prop, value] of Object.entries(reference.styles)) {
			if (kit.styles[prop] !== value) out.push(`${path}: ${prop} ${value} in reference, ${kit.styles[prop]} in kit`);
		}
	}
	const n = Math.min(reference.children.length, kit.children.length);
	for (let i = 0; i < n; i++) {
		out.push(...styleDiff(reference.children[i], kit.children[i], `${path} > ${label(reference.children[i])}`));
	}
	return out;
}

export function inlineStyles(node: NormalNode, path = 'stage'): string[] {
	const own = node.inlineStyle ? [`${path}: style="${node.inlineStyle}"`] : [];
	return [...own, ...node.children.flatMap((c) => inlineStyles(c, `${path} > ${label(c)}`))];
}

function show(value: string | undefined): string {
	return value === undefined ? 'absent' : `"${value}"`;
}

function round(n: number): number {
	return Math.round(n * 100) / 100;
}
