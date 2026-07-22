import { MusicXmlPartQuery, ExtractTempoResult, TempoMarking } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract tempo markings in a part: a playback <sound tempo="..."/> (or
 * <metronome><per-minute>) value as bpm, and/or a human-readable
 * <metronome> mark's beat unit + dots (e.g. "dotted quarter = 96"). A
 * metric-modulation mark (two beat-units, e.g. dotted-quarter = quarter)
 * sets metric_modulation with beat_unit/beat_unit_2 holding the two units.
 * Set part_id to one part's id from ListParts, or leave it empty for
 * every part — tempo directions are usually only placed on the first
 * part, so ListParts + the first part's id is the common call shape.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTempo(ax: AxiomContext, input: MusicXmlPartQuery): ExtractTempoResult {
  const out = new ExtractTempoResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: TempoMarking[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const d of m.directions) {
          if (!d.tempo) continue;
          const tm = new TempoMarking();
          tm.setPartId(part.id);
          tm.setMeasureIndex(m.index);
          tm.setMeasureNumber(m.number);
          tm.setBpm(d.tempo.bpm);
          tm.setBpmSpecified(d.tempo.bpmSpecified);
          tm.setBeatUnit(d.tempo.beatUnit);
          tm.setBeatUnitDots(d.tempo.beatUnitDots);
          tm.setMetricModulation(d.tempo.metricModulation);
          tm.setBeatUnit2(d.tempo.beatUnit2);
          rows.push(tm);
        }
      }
    }
    out.setTemposList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting tempo'));
    return out;
  }
}
