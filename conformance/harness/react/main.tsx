import '../../../styles/lucent.css';
import { useLayoutEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { LucentButton } from '@designfoundry/lucent-react';
import { fixture, type Scenario } from '../../scenarios';
import { boot } from '../common';

const { scenario, emit, onSet, rendered } = boot();

function Fixture({ value }: { value: string | undefined }): ReactNode {
	const f = fixture(value);
	if (!f) return null;
	if (f.kind === 'text') return f.text;
	return (
		<span className='lucent-icon lucent-icon--md' aria-hidden='true'>
			<span className='material-icons lucent-icon__glyph'>{f.name}</span>
		</span>
	);
}

function render(s: Scenario, props: Record<string, any>): ReactNode {
	const slots = s.slots ?? {};
	switch (s.component) {
		case 'button':
			return (
				<LucentButton
					{...props}
					leading={slots['leading'] ? <Fixture value={slots['leading']} /> : undefined}
					trailing={slots['trailing'] ? <Fixture value={slots['trailing']} /> : undefined}
					onClicked={() => emit('clicked')}
				>
					<Fixture value={slots['label']} />
				</LucentButton>
			);
		default:
			throw new Error(`No React binding for ${s.component}`);
	}
}

function Harness() {
	const [props, setProps] = useState<Record<string, unknown>>(scenario.props ?? {});
	useLayoutEffect(() => onSet((next) => setProps((prev) => ({ ...prev, ...next }))), []);
	useLayoutEffect(rendered, []);
	return render(scenario, props);
}

createRoot(document.getElementById('stage')!).render(<Harness />);
