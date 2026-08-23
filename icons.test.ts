import assert from "node:assert/strict";
import test from "node:test";
import { getFooterSymbols, getIcons, parseIconMode, resolveIconMode } from "./icons.ts";

const containsPrivateUseCodePoint = (value: string): boolean =>
	Array.from(value).some((character) => {
		const codePoint = character.codePointAt(0) ?? 0;
		return (
			(codePoint >= 0xe000 && codePoint <= 0xf8ff) ||
			(codePoint >= 0xf0000 && codePoint <= 0xffffd) ||
			(codePoint >= 0x100000 && codePoint <= 0x10fffd)
		);
	});

test("uses printable ASCII symbols in conservative auto mode", () => {
	assert.equal(resolveIconMode("auto"), "ascii");
	const symbols = getFooterSymbols("auto");
	const values = [
		...Object.values(symbols.icons),
		symbols.thinkingSeparator,
		symbols.activitySeparator,
		...Object.values(symbols.git),
		...Object.values(symbols.tokens),
	];

	for (const value of values) {
		assert.match(value, /^[\x20-\x7e]+$/);
	}
	assert.equal(values.some(containsPrivateUseCodePoint), false);
});

test("allows explicit richer icon modes", () => {
	assert.equal(resolveIconMode("ascii"), "ascii");
	assert.equal(resolveIconMode("nerd"), "nerd");
	assert.equal(resolveIconMode("unicode"), "unicode");
	assert.equal(resolveIconMode("emoji"), "emoji");
	assert.equal(Object.values(getIcons("nerd")).some(containsPrivateUseCodePoint), true);
	assert.equal(Object.values(getIcons("unicode")).some(containsPrivateUseCodePoint), false);
});

test("parses environment configuration and falls back safely", () => {
	assert.equal(parseIconMode(" ASCII "), "ascii");
	assert.equal(parseIconMode("nerd"), "nerd");
	assert.equal(parseIconMode("unicode"), "unicode");
	assert.equal(parseIconMode("emoji"), "emoji");
	assert.equal(parseIconMode(undefined), "auto");
	assert.equal(parseIconMode("unknown"), "auto");
});
