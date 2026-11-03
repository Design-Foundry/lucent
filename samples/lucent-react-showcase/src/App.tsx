import { LucentButton, type ButtonVariant, type ControlSize } from '@designfoundry/lucent-react';

const variants: ButtonVariant[] = ['primary', 'secondary', 'text'];
const sizes: ControlSize[] = ['xs', 'sm', 'md', 'lg'];
const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const;

export default function App() {
	return (
		<main style={{ display: 'grid', gap: 24, padding: 24 }}>
			<section>
				<h2>Button</h2>
				<div style={{ display: 'grid', gap: 12 }}>
					{variants.map((variant) => (
						<div key={variant} style={row}>
							<LucentButton variant={variant}>Save</LucentButton>
							<LucentButton variant={variant} tone='danger'>Delete</LucentButton>
							<LucentButton variant={variant} icon='add'>Add</LucentButton>
							<LucentButton variant={variant} trailing={<span className='lucent-icon lucent-icon--md'><span className='material-icons lucent-icon__glyph'>arrow_forward</span></span>}>Next</LucentButton>
							<LucentButton variant={variant} loading>Save</LucentButton>
							<LucentButton variant={variant} disabled>Save</LucentButton>
						</div>
					))}
					<div style={row}>
						{sizes.map((size) => (
							<LucentButton key={size} size={size} icon='add'>Add</LucentButton>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
