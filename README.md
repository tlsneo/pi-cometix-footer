# pi-cometix-footer

[![npm](https://img.shields.io/npm/v/pi-cometix-footer?style=flat-square)](https://www.npmjs.com/package/pi-cometix-footer)
[![license](https://img.shields.io/npm/l/pi-cometix-footer?style=flat-square)](./LICENSE)
[![pi package](https://img.shields.io/badge/pi-package-8b5cf6?style=flat-square)](https://pi.dev)

Single-line **cometix-style** footer for [pi](https://pi.dev) — model, path, git, context window, session tokens, latest-response throughput, cost, and task time at a glance.

Look inspired by [CCometixLine](https://github.com/Haleclipse/CCometixLine) (MIT). Independent pi extension; own codebase.

---

## Preview

![cometix footer demo](assets/demo.png)

```text
π  GPT-5.6 Sol • max  |  > ~/agent/pi-cometix-footer  |  main ✓  |  2% 6.4k/372k  |  ↑13k ↓61 CH88.2%  |  󰄉 1m 23s · 42.3 tok/s  |  󰇁 0.284  |  MCP: 0/5 servers
```

| Segment | What it shows | Color |
| --- | --- | --- |
| **Model** | Model name + thinking level (`• high`) | cyan · level uses pi palette |
| **Directory** | CWD, `~`-relative | yellow icon / green path |
| **Git** | Branch · clean `✓` / dirty `●` / conflict `⚠` · ahead `↑n` / behind `↓n` | blue |
| **Context** | Window fill `pct tokens/window` | magenta → yellow (>70%) → red (>90%) |
| **Tokens** | Session `↑in ↓out` + latest cache hit `CH%` | cyan |
| **Cost** | Session cumulative USD cost reported by Pi (`󰇁 0.000`); omitted when zero/unavailable | yellow |
| **Activity** | Live task time (updated every second) + optional latest-response TPS; final values remain after the agent settles | magenta |
| **Statuses** | Extension / MCP status lines (if any) | theme default |

Segments are bold, separated by dim ` | `. Icon mode defaults to `"auto"`: Apple Terminal uses single-cell Unicode symbols compatible with its default Menlo font, while other terminals keep Nerd Font icons. Unicode, Nerd Font, and emoji modes can also be selected explicitly.

---

## Install

```bash
pi install npm:pi-cometix-footer
```

Or from git:

```bash
pi install git:github.com/Xichun123/pi-cometix-footer
```

Then in pi:

```text
/reload
```

Footer and TPS are **on by default**. Toggle the footer or TPS independently:

```text
/cometix-footer
/cometix-footer tps
/cometix-footer tps on
/cometix-footer tps off
```

TPS uses the final output-token count divided by the elapsed time from the first streamed output delta to response completion, so time to first token is excluded. It is omitted when a provider does not stream output deltas or report valid output-token usage.

> **Migrating from a loose file?**  
> If you previously copied `cometix-footer.ts` into `~/.pi/agent/extensions/`, remove that file first to avoid loading the footer twice.

---

## Customize

Edit the installed package (or a local clone), then `/reload`.

| Knob | Where | Purpose |
| --- | --- | --- |
| `ICON_MODE` | top of `index.ts` | `"auto"` (default), `"nerd"`, `"unicode"`, or `"emoji"` |
| `DEFAULT_SHOW_TPS` | top of `index.ts` | show latest-response TPS by default (`true`) |
| `ICON_SETS.nerd.*` | `icons.ts` | per-segment Nerd Font codepoints |
| `C.*` | color map | 16-color SGR codes per segment |
| `GIT_TTL` | near git cache | git status refresh interval (ms, default `3000`) |

Nerd Font cheatsheet: <https://www.nerdfonts.com/cheat-sheet>

Local install for hacking:

```bash
git clone https://github.com/Xichun123/pi-cometix-footer.git
pi install ./pi-cometix-footer
```

---

## Requirements

- [pi](https://pi.dev) (peer: `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`)
- A Nerd Font is optional. In `"auto"` mode, Apple Terminal falls back to Menlo-compatible Unicode symbols. Use `"nerd"` for patched fonts, `"unicode"` for a font-safe single-cell fallback, or `"emoji"` for colorful icons.

---

## Credits

- Visual language borrowed from [CCometixLine](https://github.com/Haleclipse/CCometixLine) by Haleclipse (MIT)
- Built as a [pi](https://pi.dev) extension package

## License

[MIT](./LICENSE) © Xichun123
