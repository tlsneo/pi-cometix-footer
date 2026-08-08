import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

/**
 * Lay out styled footer segments from left to right, wrapping only between
 * segments. A segment wider than the terminal is truncated on its own line.
 */
export function layoutFooterSegments(
	segments: readonly string[],
	width: number,
	separator: string,
): string[] {
	const availableWidth = Math.floor(width);
	if (!Number.isFinite(availableWidth) || availableWidth <= 0) return [];

	const lines: string[] = [];
	let currentLine = "";

	for (const rawSegment of segments) {
		if (visibleWidth(rawSegment) === 0) continue;

		const segment =
			visibleWidth(rawSegment) <= availableWidth
				? rawSegment
				: truncateToWidth(rawSegment, availableWidth, "…");

		if (currentLine === "") {
			currentLine = segment;
			continue;
		}

		const candidate = `${currentLine}${separator}${segment}`;
		if (visibleWidth(candidate) <= availableWidth) {
			currentLine = candidate;
		} else {
			lines.push(currentLine);
			currentLine = segment;
		}
	}

	if (currentLine !== "") lines.push(currentLine);
	return lines;
}
