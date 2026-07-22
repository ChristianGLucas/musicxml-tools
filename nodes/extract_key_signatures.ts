import { MusicXmlPartQuery, ExtractKeySignaturesResult, KeySignatureChange } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, deriveKeyName, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract every key signature change in a part (from <attributes>/<key>:
 * fifths + mode), each tagged with the measure it starts at, plus a
 * derived key_name (e.g. fifths=2 -> "D major") via the standard circle-
 * of-fifths convention. key_name is empty when fifths falls outside the
 * standard -7..7 range or mode is a church mode other than major/minor.
 * Set part_id to one part's id from ListParts, or leave it empty for every
 * part.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractKeySignatures(ax: AxiomContext, input: MusicXmlPartQuery): ExtractKeySignaturesResult {
  const out = new ExtractKeySignaturesResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: KeySignatureChange[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const ac of m.attributesChanges) {
          if (!ac.key) continue;
          const k = new KeySignatureChange();
          k.setPartId(part.id);
          k.setMeasureIndex(m.index);
          k.setMeasureNumber(m.number);
          k.setFifths(ac.key.fifths);
          k.setMode(ac.key.mode);
          k.setKeyName(deriveKeyName(ac.key.fifths, ac.key.mode));
          rows.push(k);
        }
      }
    }
    out.setChangesList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting key signatures'));
    return out;
  }
}
