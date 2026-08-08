export type IconMode = "auto" | "nerd" | "unicode" | "emoji";
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

const cp = (n: number) => String.fromCodePoint(n);

const ICON_SETS: Record<ResolvedIconMode, FooterIcons> = {
	nerd: {
		model: "\ue22c", // nf-fae-pi
		dir: "\ue285", // nf-fae-bigger
		git: cp(0xf02a2), // nf-md-git
		ctx: "\uf49b", // nf-md-counter
		usage: cp(0xf0a9e), // nf-md-chart_bar
		cost: cp(0xf01c1), // nf-md-currency_usd
		duration: cp(0xf0109), // nf-md-camera_timer
	},
	unicode: {
		model: "π",
		dir: "⌂",
		git: "±",
		ctx: "◴",
		usage: "Σ",
		cost: "$",
		duration: "◷",
	},
	emoji: {
		model: "🤖",
		dir: "📁",
		git: "🌿",
		ctx: "⚡️",
		usage: "📊",
		cost: "💰",
		duration: "⏱️",
	},
};

export function resolveIconMode(
	mode: IconMode,
	env: Readonly<Record<string, string | undefined>> = process.env,
): ResolvedIconMode {
	if (mode !== "auto") return mode;

	// Apple Terminal defaults to Menlo, which has no Nerd Font private-use glyphs.
	return env.TERM_PROGRAM === "Apple_Terminal" ? "unicode" : "nerd";
}

export function getIcons(
	mode: IconMode,
	env: Readonly<Record<string, string | undefined>> = process.env,
): FooterIcons {
	return ICON_SETS[resolveIconMode(mode, env)];
}
