import assert from "node:assert/strict";
import test from "node:test";
import { visibleWidth } from "@earendil-works/pi-tui";
import { layoutFooterSegments } from "./footer-layout.ts";

const RESET = "\x1b[0m";
const SEPARATOR = `\x1b[2m | ${RESET}`;
const red = (text: string) => `\x1b[31m${text}${RESET}`;

test("keeps all segments on one line when they fit", () => {
	const segments = [red("model"), red("~/project"), red("main ✓")];
	const joined = segments.join(SEPARATOR);

	assert.deepEqual(layoutFooterSegments(segments, visibleWidth(joined), SEPARATOR), [joined]);
});

test("wraps only between complete segments", () => {
	const segments = [red("model"), red("~/project"), red("main ✓")];
	const firstLine = segments.slice(0, 2).join(SEPARATOR);
	const lines = layoutFooterSegments(segments, visibleWidth(firstLine), SEPARATOR);

	assert.deepEqual(lines, [firstLine, segments[2]]);
	assert.equal(lines.some((line) => line.startsWith(SEPARATOR) || line.endsWith(SEPARATOR)), false);
});

test("measures ANSI-styled text by visible width", () => {
	const segments = [red("model"), red("tokens")];
	const exactWidth = visibleWidth(segments.join(SEPARATOR));

	assert.equal(layoutFooterSegments(segments, exactWidth, SEPARATOR).length, 1);
	assert.equal(layoutFooterSegments(segments, exactWidth - 1, SEPARATOR).length, 2);
});

test("truncates a segment wider than the terminal without overflowing", () => {
	const lines = layoutFooterSegments([red("~/a/very/long/project/path")], 12, SEPARATOR);

	assert.equal(lines.length, 1);
	assert.ok(visibleWidth(lines[0]) <= 12);
	assert.match(lines[0], /…/);
});

test("filters empty segments and handles unusable widths", () => {
	assert.deepEqual(layoutFooterSegments(["", red("model"), ""], 20, SEPARATOR), [red("model")]);
	assert.deepEqual(layoutFooterSegments([red("model")], 0, SEPARATOR), []);
	assert.deepEqual(layoutFooterSegments([red("model")], Number.NaN, SEPARATOR), []);
});

test("reflows automatically as the available width changes", () => {
	const segments = [red("model"), red("~/project"), red("main ✓"), red("42% 114k/272k")];
	const narrow = layoutFooterSegments(segments, 22, SEPARATOR);
	const wide = layoutFooterSegments(segments, visibleWidth(segments.join(SEPARATOR)), SEPARATOR);

	assert.ok(narrow.length > 1);
	assert.equal(wide.length, 1);
	for (const line of narrow) assert.ok(visibleWidth(line) <= 22);
});
