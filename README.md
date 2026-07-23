# musicxml-tools

Deterministic parsing and structural inspection of **MusicXML** — the
standard XML interchange format for Western sheet-music notation (used by
MuseScore, Finale, Sibelius, and most other notation software) — built for
the [Axiom](https://axiomide.com) marketplace, handle `christiangeorgelucas`.

This is deliberately distinct from generic XML parsing (see
[`xpath-tools`](https://github.com/ChristianGLucas/xpath-tools)/
[`dataformat-tools`](https://github.com/ChristianGLucas/dataformat-tools)) and
from **music theory** (see
[`music-theory-tools`](https://github.com/ChristianGLucas/music-theory-tools),
which covers scales/chords/intervals in the abstract). MusicXML is the
**notation file format** — an actual score with parts, measures, and notes —
and this package understands that structure: `work`/`identification`
metadata, `part-list`/`score-part`, `measure`, `note`/`pitch`,
`attributes` (`time`/`key`/`clef`/`transpose`/`divisions`), `direction`
(dynamics/tempo), and `notations` (articulations)/`lyric`.

Both root forms are supported: **score-partwise** (organized part then
measure — the common form) and **score-timewise** (organized measure then
part) are normalized to one common shape internally, so every node works
the same way regardless of which form a caller supplies. Only the
already-**uncompressed XML text** is accepted — this package never
decompresses a `.mxl` (zip) container; a caller must extract that first.

MusicXML is always supplied as text by the caller — there is no rendering,
no audio, no network call, no wall-clock, and no randomness. Every node is a
pure, deterministic function of its input, built on
[`fast-xml-parser`](https://github.com/NaturalIntelligence/fast-xml-parser)
(MIT) with external XML entities rejected (no XXE) — verified directly
against the parser's own behavior, not merely assumed.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/musicxml-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/musicxml-tools/DetectMusicXml --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/musicxml-tools/0.1.0/DetectMusicXml \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/musicxml-tools/DetectMusicXml`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Nodes

- **DetectMusicXml** — detect whether text is MusicXML and which root form
  (score-partwise vs. score-timewise) it uses.
- **ParseScore** — parse a score into a normalized overview: title,
  composer, and each part with its measure count.
- **ExtractMetadata** — work/movement titles, creators (composer, arranger,
  ...), rights, and encoding info from `work`/`identification`.
- **ListParts** — the parts declared in `part-list`: id, name,
  abbreviation, instrument count.
- **ExtractMeasures** — a part's measures: index, number, implicit/width,
  note/rest counts, and whether attributes change there.
- **ExtractNotes** — a part's notes as a structured array: pitch, duration,
  type, voice, rest/tie/dot/chord/grace flags.
- **ExtractTimeSignatures** / **ExtractKeySignatures** / **ExtractClefs** —
  every time/key/clef change in a part and the measure it starts at (key
  signatures include a derived key name, e.g. "D major").
- **ExtractTempo** — tempo markings from `sound`/`metronome`, including
  metric modulation.
- **ExtractLyrics** — lyric syllables aligned to their note position.
- **SummarizeParts** — per-part measure/note/rest counts in one call.
- **ExtractInstruments** — every declared `score-instrument`, plus total
  part/instrument counts.
- **ComputeDuration** — each part's total notated duration (divisions and,
  when reliable, quarter notes).
- **ExtractDynamicsArticulations** — dynamics markings and note
  articulation/technical markings.
- **ExtractTransposition** — written-vs-concert transposition info per
  part.
- **ValidateStructure** — basic structural correctness: a recognized root,
  and `part-list` matching the actual parts.

## License

MIT — see [LICENSE](./LICENSE).
