import { MODES, MODE_LABELS, useTheme } from '~/lib/theme';

/**
 * Lets a visitor switch the whole site between software / lifestyle / hardware.
 * The selection is persisted in a cookie so SSR renders the right theme.
 */
export function ModeSwitcher() {
	const { mode, setMode } = useTheme();
	return (
		<div
			role="radiogroup"
			aria-label="Site mode"
			className="inline-flex items-center gap-px rounded-[var(--radius)] border border-default p-px text-xs"
		>
			{MODES.map((m) => {
				const active = m === mode;
				return (
					<button
						key={m}
						role="radio"
						aria-checked={active}
						onClick={() => setMode(m)}
						className={
							'rounded-[var(--radius)] px-2.5 py-1 transition-colors ' +
							(active ? 'bg-accent' : 'text-muted hover:text-[var(--fg)]')
						}
					>
						{MODE_LABELS[m]}
					</button>
				);
			})}
		</div>
	);
}
