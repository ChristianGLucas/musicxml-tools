import { MusicXmlPartQuery, ExtractClefsResult, ClefChange } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract every clef change in a part (from <attributes>/<clef>: sign,
 * line, octave-change, and the staff number for multi-staff parts like a
 * piano grand staff), each tagged with the measure it starts at. Set
 * part_id to one part's id from ListParts, or leave it empty for every
 * part.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractClefs(ax: AxiomContext, input: MusicXmlPartQuery): ExtractClefsResult {
  const out = new ExtractClefsResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: ClefChange[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const ac of m.attributesChanges) {
          for (const c of ac.clefs) {
            const cc = new ClefChange();
            cc.setPartId(part.id);
            cc.setMeasureIndex(m.index);
            cc.setMeasureNumber(m.number);
            cc.setSign(c.sign);
            cc.setLine(c.line ?? 0);
            cc.setLineSpecified(c.line !== null);
            cc.setOctaveChange(c.octaveChange ?? 0);
            cc.setOctaveChangeSpecified(c.octaveChange !== null);
            cc.setStaffNumber(c.staffNumber);
            rows.push(cc);
          }
        }
      }
    }
    out.setClefsList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting clefs'));
    return out;
  }
}
