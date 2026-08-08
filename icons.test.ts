import assert from "node:assert/strict";
import test from "node:test";
import { getIcons, resolveIconMode } from "./icons.ts";

const containsPrivateUseCodePoint = (value: string): boolean =>
	Array.from(value).some((character) => {
		const codePoint = character.codePointAt(0) ?? 0;
		return (
			(codePoint >= 0xe000 && codePoint <= 0xf8ff) ||
			(codePoint >= 0xf0000 && codePoint <= 0xffffd) ||
			(codePoint >= 0x100000 && codePoint <= 0x10fffd)
		);
	});

test("automatically avoids Nerd Font private-use glyphs in Apple Terminal", () => {
	const env = { TERM_PROGRAM: "Apple_Terminal" };

	assert.equal(resolveIconMode("auto", env), "unicode");
	assert.equal(Object.values(getIcons("auto", env)).some(containsPrivateUseCodePoint), false);
});

test("keeps Nerd Font icons elsewhere and allows explicit overrides", () => {
	assert.equal(resolveIconMode("auto", { TERM_PROGRAM: "iTerm.app" }), "nerd");
	assert.equal(resolveIconMode("nerd", { TERM_PROGRAM: "Apple_Terminal" }), "nerd");
	assert.equal(resolveIconMode("emoji", { TERM_PROGRAM: "Apple_Terminal" }), "emoji");
	assert.equal(resolveIconMode("unicode", { TERM_PROGRAM: "iTerm.app" }), "unicode");
});
