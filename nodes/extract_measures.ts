import { MusicXmlPartQuery, ExtractMeasuresResult, MeasureInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError, MAX_MEASURES_OUTPUT } from './lib';

/**
 * Extract a part's measures: 0-based index, the raw measure "number" text
 * (not guaranteed to be sequential integers — pickup measures are often
 * "0"), implicit/width, note and rest counts, and whether an <attributes>
 * element (a possible time/key/clef/divisions change) starts there. Set
 * part_id to one part's id from ListParts, or leave it empty for every
 * part. start_measure_index/end_measure_index bound the range for a large
 * score (end 0 = unbounded); output is additionally capped at 5000 rows
 * with `truncated` set if more existed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMeasures(ax: AxiomContext, input: MusicXmlPartQuery): ExtractMeasuresResult {
  const out = new ExtractMeasuresResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: MeasureInfo[] = [];
    let total = 0;
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      total += ranged.length;
      for (const m of ranged) {
        if (rows.length >= MAX_MEASURES_OUTPUT) continue;
        const mi = new MeasureInfo();
        mi.setPartId(part.id);
        mi.setIndex(m.index);
        mi.setNumber(m.number);
        mi.setImplicit(m.implicit);
        mi.setWidth(m.width ?? 0);
        mi.setWidthSpecified(m.widthSpecified);
        mi.setNoteCount(m.notes.filter((n) => !n.isRest).length);
        mi.setRestCount(m.notes.filter((n) => n.isRest).length);
        mi.setHasAttributes(m.attributesChanges.length > 0);
        rows.push(mi);
      }
    }
    out.setMeasuresList(rows);
    out.setTotalMeasures(total);
    out.setTruncated(rows.length < total);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting measures'));
    return out;
  }
}
