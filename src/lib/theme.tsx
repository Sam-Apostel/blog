import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

export const MODES = ['software', 'lifestyle', 'hardware'] as const;
export type Mode = (typeof MODES)[number];

export const MODE_LABELS: Record<Mode, string> = {
	software: 'Software',
	lifestyle: 'Lifestyle',
	hardware: 'Hardware',
};

export const DEFAULT_MODE: Mode = 'software';
const COOKIE = 'mode';

export function isMode(value: unknown): value is Mode {
	return typeof value === 'string' && (MODES as readonly string[]).includes(value);
}

/** Read the mode from a cookie string (used on the server during SSR). */
export function modeFromCookie(cookieHeader: string | null | undefined): Mode {
	if (!cookieHeader) return DEFAULT_MODE;
	const match = cookieHeader.match(/(?:^|;\s*)mode=([^;]+)/);
	const value = match?.[1];
	return isMode(value) ? value : DEFAULT_MODE;
}

type ThemeContextValue = {
	mode: Mode;
	setMode: (mode: Mode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ initialMode, children }: PropsWithChildren<{ initialMode: Mode }>) {
	const [mode, setModeState] = useState<Mode>(initialMode);

	const setMode = (next: Mode) => {
		setModeState(next);
		document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
		document.documentElement.dataset.mode = next;
	};

	// Keep the <html data-mode> attribute in sync if the mode is set elsewhere.
	useEffect(() => {
		document.documentElement.dataset.mode = mode;
	}, [mode]);

	return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
	return ctx;
}
