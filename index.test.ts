import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { stripVTControlCharacters } from "node:util";
import { visibleWidth } from "@earendil-works/pi-tui";
import cometixFooter from "./index.ts";

function createFooter(t: TestContext) {
	const handlers = new Map<string, (event: any, ctx?: any) => void>();
	const statuses = new Map<string, string>();
	const requestRender = t.mock.fn();
	const unsubscribe = t.mock.fn();
	let thinkingLevel = "high";
	let footer!: { render(width: number): string[]; dispose(): void };
	const ctx = {
		mode: "tui",
		cwd: "/project",
		model: { id: "test-model", name: "Test model", reasoning: true },
		sessionManager: { getCwd: () => "/project", getEntries: () => [] },
		getContextUsage: () => undefined,
		ui: {
			setFooter(factory: any) {
				footer = factory(
					{ requestRender },
					{ fg: (_token: string, text: string) => `\x1b[35m${text}\x1b[0m` },
					{
						getGitBranch: () => null,
						getExtensionStatuses: () => statuses,
						onBranchChange: () => unsubscribe,
					},
				);
			},
		},
	};
	cometixFooter({
		on: (name: string, handler: (event: any, ctx?: any) => void) => handlers.set(name, handler),
		registerCommand() {},
		getThinkingLevel: () => thinkingLevel,
	} as unknown as Parameters<typeof cometixFooter>[0]);
	handlers.get("session_start")!({}, ctx);
	t.after(() => footer.dispose());
	return {
		footer, statuses, ctx, handlers, requestRender, unsubscribe,
		setThinkingLevel: (level: string) => { thinkingLevel = level; },
		render: (width = 1000) => footer.render(width).map(stripVTControlCharacters).join("\n"),
	};
}

test("renders Fast and Ultrafast once next to thinking, in yellow", (t) => {
	const { footer, statuses, render } = createFooter(t);
	for (const speed of ["⚡ Fast", "⚡⚡ Ultrafast"]) {
		statuses.set("ai-gateway-speed", speed);
		const text = render();
		assert.equal(text.split(" | ")[0], `π  Test model • high • ${speed}`);
		assert.equal(text.split(speed).length - 1, 1);
		assert.ok(footer.render(1000)[0].includes(`\x1b[1;93m${speed}\x1b[0m`));
	}
});

test("reflects changes, off/removal and model switches without stale speed", (t) => {
	const { statuses, ctx, render } = createFooter(t);
	const baseline = render();
	statuses.set("ai-gateway-speed", "⚡ Fast");
	assert.ok(render().includes("high • ⚡ Fast"));
	statuses.set("ai-gateway-speed", "⚡⚡ Ultrafast");
	assert.ok(render().includes("high • ⚡⚡ Ultrafast"));
	assert.ok(!render().includes("⚡ Fast"));
	statuses.delete("ai-gateway-speed");
	assert.equal(render(), baseline);

	statuses.set("ai-gateway-speed", "⚡ Fast");
	assert.ok(render().includes("⚡ Fast"));
	ctx.model = { id: "other-model", name: "Other model", reasoning: true };
	statuses.delete("ai-gateway-speed"); // gateway clears the status when switching models
	assert.equal(render().split(" | ")[0], "π  Other model • high");
	statuses.set("ai-gateway-speed", "⚡⚡ Ultrafast");
	assert.equal(render().split(" | ")[0], "π  Other model • high • ⚡⚡ Ultrafast");
	for (const empty of ["", " \r\n\t "]) {
		statuses.set("ai-gateway-speed", empty);
		assert.equal(render().split(" | ")[0], "π  Other model • high");
	}
});

test("shows speed without thinking and leaves no separator when speed is absent", (t) => {
	const { statuses, ctx, setThinkingLevel, render } = createFooter(t);
	for (const [reasoning, level] of [[false, "high"], [true, "off"], [true, ""]] as const) {
		ctx.model.reasoning = reasoning;
		setThinkingLevel(level);
		statuses.set("ai-gateway-speed", "⚡ Fast");
		assert.equal(render().split(" | ")[0], "π  Test model • ⚡ Fast");
		statuses.delete("ai-gateway-speed");
		assert.equal(render().split(" | ")[0], "π  Test model");
	}
});

test("preserves other statuses, their ANSI styling, sorting and whitespace cleanup", (t) => {
	const { footer, statuses, render } = createFooter(t);
	const baseline = render();
	statuses.set("z-last", " \tZeta\n  status\r ");
	statuses.set("a-first", "\x1b[32mAlpha\tstatus\x1b[0m");
	statuses.set("zz-empty", " \r\n\t ");
	statuses.set("ai-gateway-speed-extra", "Unrelated status");
	const expectedTail = " | Alpha status | Unrelated status | Zeta status";
	assert.equal(render(), baseline + expectedTail);
	assert.ok(footer.render(1000)[0].includes("\x1b[32mAlpha status\x1b[0m"));
	statuses.set("ai-gateway-speed", " \t⚡  Fast\r\n ");
	assert.equal(render().split(" | ")[0], "π  Test model • high • ⚡ Fast");
	assert.ok(render().endsWith(expectedTail));
	statuses.delete("ai-gateway-speed");
	assert.equal(render(), baseline + expectedTail);
});

test("keeps narrow renders within width and reflows the combined model segment", (t) => {
	const { footer, statuses, render } = createFooter(t);
	statuses.set("other", "Another long extension status");
	for (const speed of ["⚡ Fast", "⚡⚡ Ultrafast"]) {
		statuses.set("ai-gateway-speed", speed);
		const model = `π  Test model • high • ${speed}`;
		const lines = render(visibleWidth(model)).split("\n");
		assert.equal(lines[0], model);
		assert.ok(lines.length > 1);
		assert.equal(lines.join("\n").split(speed).length - 1, 1);
		for (let width = 1; width <= 80; width++) {
			for (const line of footer.render(width)) assert.ok(visibleWidth(line) <= width);
		}
		assert.equal(render().split(" | ")[0], model);
	}
	for (const width of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
		assert.deepEqual(footer.render(width), []);
	}
});

test("dispose clears both refresh timers and the branch subscription", async (t) => {
	t.mock.timers.enable({ apis: ["setInterval"] });
	const { footer, handlers, ctx, requestRender, unsubscribe } = createFooter(t);
	handlers.get("message_start")!({ message: { role: "user", timestamp: Date.now() } }, ctx);
	t.mock.timers.tick(3000);
	await Promise.resolve();
	assert.ok(requestRender.mock.callCount() > 1);
	footer.dispose();
	assert.equal(unsubscribe.mock.callCount(), 1);
	const renders = requestRender.mock.callCount();
	t.mock.timers.tick(6000);
	await Promise.resolve();
	assert.equal(requestRender.mock.callCount(), renders);
});
