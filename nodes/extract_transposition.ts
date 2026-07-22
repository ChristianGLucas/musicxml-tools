import { MusicXmlPartQuery, ExtractTranspositionResult, TranspositionInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract a part's transposition info (written pitch vs. concert/sounding
 * pitch) from <attributes>/<transpose>: diatonic and chromatic interval,
 * octave-change, and whether <double/> is present (an additional octave
 * shift, e.g. guitar notated at pitch but sounding an octave down). A
 * non-transposing part (piano, violin, ...) simply has no rows — absence
 * of a row means "not transposed", not an error. Set part_id to one
 * part's id from ListParts, or leave it empty for every part.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTransposition(ax: AxiomContext, input: MusicXmlPartQuery): ExtractTranspositionResult {
  const out = new ExtractTranspositionResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: TranspositionInfo[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const ac of m.attributesChanges) {
          if (!ac.transpose) continue;
          const ti = new TranspositionInfo();
          ti.setPartId(part.id);
          ti.setMeasureIndex(m.index);
          ti.setMeasureNumber(m.number);
          ti.setDiatonic(ac.transpose.diatonic ?? 0);
          ti.setDiatonicSpecified(ac.transpose.diatonic !== null);
          ti.setChromatic(ac.transpose.chromatic);
          ti.setOctaveChange(ac.transpose.octaveChange ?? 0);
          ti.setOctaveChangeSpecified(ac.transpose.octaveChange !== null);
          ti.setDoubleTransposition(ac.transpose.double);
          rows.push(ti);
        }
      }
    }
    out.setTranspositionsList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting transposition'));
    return out;
  }
}
