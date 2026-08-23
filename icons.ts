export type IconMode = "auto" | "ascii" | "nerd" | "unicode" | "emoji";
export type ResolvedIconMode = Exclude<IconMode, "auto">;

export interface FooterIcons {
	model: string;
	dir: string;
	git: string;
	ctx: string;
	usage: string;
	cost: string;
	duration: string;
}

export interface FooterSymbols {
	icons: FooterIcons;
	thinkingSeparator: string;
	activitySeparator: string;
	git: {
		clean: string;
		dirty: string;
		conflict: string;
		ahead: string;
		behind: string;
	};
	tokens: {
		input: string;
		output: string;
	};
}

const cp = (n: number) => String.fromCodePoint(n);

const SYMBOL_SETS: Record<ResolvedIconMode, FooterSymbols> = {
	// Printable ASCII is the only dependable choice across terminal fonts,
	// operating systems, SSH clients, containers, and non-UTF-8 locales.
	ascii: {
		icons: {
			model: "@",
			dir: ">",
			git: "#",
			ctx: "%",
			usage: "<>",
			cost: "$",
			duration: "~",
		},
		thinkingSeparator: " - ",
		activitySeparator: " / ",
		git: {
			clean: "+",
			dirty: "*",
			conflict: "!",
			ahead: "^",
			behind: "v",
		},
		tokens: {
			input: "^",
			output: "v",
		},
	},
	nerd: {
		icons: {
			model: "\ue22c", // nf-fae-pi
			dir: "\ue285", // nf-fae-bigger
			git: cp(0xf02a2), // nf-md-git
			ctx: "\uf49b", // nf-md-counter
			usage: cp(0xf0a9e), // nf-md-chart_bar
			cost: cp(0xf01c1), // nf-md-currency_usd
			duration: cp(0xf0109), // nf-md-camera_timer
		},
		thinkingSeparator: " • ",
		activitySeparator: " · ",
		git: {
			clean: "✓",
			dirty: "●",
			conflict: "⚠",
			ahead: "↑",
			behind: "↓",
		},
		tokens: {
			input: "↑",
			output: "↓",
		},
	},
	unicode: {
		icons: {
			model: "π",
			dir: "⌂",
			git: "±",
			ctx: "◴",
			usage: "Σ",
			cost: "$",
			duration: "◷",
		},
		thinkingSeparator: " • ",
		activitySeparator: " · ",
		git: {
			clean: "✓",
			dirty: "●",
			conflict: "⚠",
			ahead: "↑",
			behind: "↓",
		},
		tokens: {
			input: "↑",
			output: "↓",
		},
	},
	emoji: {
		icons: {
			model: "🤖",
			dir: "📁",
			git: "🌿",
			ctx: "⚡️",
			usage: "📊",
			cost: "💰",
			duration: "⏱️",
		},
		thinkingSeparator: " • ",
		activitySeparator: " · ",
		git: {
			clean: "✓",
			dirty: "●",
			conflict: "⚠",
			ahead: "↑",
			behind: "↓",
		},
		tokens: {
			input: "↑",
			output: "↓",
		},
	},
};

export function parseIconMode(value: string | undefined): IconMode {
	const normalized = value?.trim().toLowerCase();
	if (
		normalized === "auto" ||
		normalized === "ascii" ||
		normalized === "nerd" ||
		normalized === "unicode" ||
		normalized === "emoji"
	) {
		return normalized;
	}
	return "auto";
}

export function resolveIconMode(mode: IconMode): ResolvedIconMode {
	// There is no reliable terminal protocol for detecting whether the active
	// font contains a glyph. Keep auto conservative and let users explicitly
	// opt into richer modes.
	return mode === "auto" ? "ascii" : mode;
}

export function getFooterSymbols(mode: IconMode): FooterSymbols {
	return SYMBOL_SETS[resolveIconMode(mode)];
}

export function getIcons(mode: IconMode): FooterIcons {
	return getFooterSymbols(mode).icons;
}
