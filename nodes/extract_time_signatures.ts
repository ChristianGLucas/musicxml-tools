import { MusicXmlPartQuery, ExtractTimeSignaturesResult, TimeSignatureChange } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract every time signature change in a part (from <attributes>/<time>:
 * beats + beat-type, and any additive/complex-meter symbol), each tagged
 * with the measure it starts at. Set part_id to one part's id from
 * ListParts, or leave it empty for every part (each row is tagged with its
 * own part_id) — a score's time signature is normally declared identically
 * on every part, so scoping to one part is usually enough.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTimeSignatures(ax: AxiomContext, input: MusicXmlPartQuery): ExtractTimeSignaturesResult {
  const out = new ExtractTimeSignaturesResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: TimeSignatureChange[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const ac of m.attributesChanges) {
          if (!ac.time) continue;
          const t = new TimeSignatureChange();
          t.setPartId(part.id);
          t.setMeasureIndex(m.index);
          t.setMeasureNumber(m.number);
          t.setBeatsList(ac.time.beats);
          t.setBeatTypeList(ac.time.beatType);
          t.setSymbol(ac.time.symbol);
          rows.push(t);
        }
      }
    }
    out.setChangesList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting time signatures'));
    return out;
  }
}
