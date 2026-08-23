# pi-cometix-footer

[![license](https://img.shields.io/npm/l/pi-cometix-footer?style=flat-square)](./LICENSE)
[![pi package](https://img.shields.io/badge/pi-package-8b5cf6?style=flat-square)](https://pi.dev)

Responsive **cometix-style** footer for [pi](https://pi.dev) — model, path, git, context window, session tokens, latest-response throughput, cost, and task time at a glance.

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
| **Cost** | Session cumulative USD cost reported by Pi; omitted when zero/unavailable | yellow |
| **Activity** | Live task time (updated every second) + optional latest-response TPS; final values remain after the agent settles | magenta |
| **Statuses** | Extension / MCP status lines (if any) | theme default |

Segments are bold, separated by dim ` | `. The footer stays on one line when everything fits; on narrower terminals it greedily wraps between complete segments, preserving values such as cost and activity instead of clipping the right side. A single segment wider than the terminal is safely truncated. Resizing the terminal automatically reflows the layout.

Icon mode defaults to `"auto"`: Linux uses the portable ASCII fallback, Apple Terminal uses Menlo-compatible Unicode symbols, and other environments preserve the original Nerd Font appearance. Every mode can also be selected explicitly.

---

## Install

```bash
pi install git:github.com/tlsneo/pi-cometix-footer
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
| `PI_COMETIX_ICON_MODE` | environment | `auto` (platform-aware default), `ascii`, `nerd`, `unicode`, or `emoji` |
| `layoutFooterSegments` | `footer-layout.ts` | responsive, ANSI-safe segment wrapping and oversized-segment truncation |
| `DEFAULT_SHOW_TPS` | top of `index.ts` | show latest-response TPS by default (`true`) |
| `SYMBOL_SETS` | `icons.ts` | customize ASCII, Unicode, Nerd Font, or emoji symbols |
| `C.*` | color map | 16-color SGR codes per segment |
| `GIT_TTL` | near git cache | git status refresh interval (ms, default `3000`) |

To opt into richer symbols, start pi with one of:

```bash
PI_COMETIX_ICON_MODE=nerd pi
PI_COMETIX_ICON_MODE=unicode pi
PI_COMETIX_ICON_MODE=emoji pi
```

Nerd Font mode requires a compatible terminal font. Nerd Font cheatsheet: <https://www.nerdfonts.com/cheat-sheet>

Local install for hacking:

```bash
git clone https://github.com/tlsneo/pi-cometix-footer.git
pi install ./pi-cometix-footer
```

---

## Requirements

- [pi](https://pi.dev) (peer: `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`)
- Linux needs no special font in default `"auto"` mode because it uses ASCII symbols
- Apple Terminal automatically uses a Menlo-compatible Unicode fallback
- Other environments retain the original Nerd Font appearance; use `PI_COMETIX_ICON_MODE=ascii` when a patched font is unavailable

---

## Credits

- Visual language borrowed from [CCometixLine](https://github.com/Haleclipse/CCometixLine) by Haleclipse (MIT)
- Built as a [pi](https://pi.dev) extension package

## License

[MIT](./LICENSE) © Xichun123
