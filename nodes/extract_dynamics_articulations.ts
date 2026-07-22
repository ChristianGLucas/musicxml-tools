import { MusicXmlPartQuery, ExtractDynamicsArticulationsResult, DynamicMarking, ArticulationMarking } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract dynamics markings (<direction-type>/<dynamics>, e.g. "mf"/"ff"/
 * "sfz" — the element name itself, or the text of <other-dynamics>) and
 * note-level articulation/technical markings (<notations>/<articulations>
 * or <technical>, e.g. "staccato"/"accent"/"tenuto" — again the element
 * name) in a part. Articulation rows carry note_index_in_measure (0-based
 * among ALL notes including rests) for lining up against ExtractNotes.
 * Set part_id to one part's id from ListParts, or leave it empty for
 * every part.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractDynamicsArticulations(ax: AxiomContext, input: MusicXmlPartQuery): ExtractDynamicsArticulationsResult {
  const out = new ExtractDynamicsArticulationsResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const dynamicsRows: DynamicMarking[] = [];
    const articulationRows: ArticulationMarking[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        for (const d of m.directions) {
          for (const dynType of d.dynamics) {
            const dm = new DynamicMarking();
            dm.setPartId(part.id);
            dm.setMeasureIndex(m.index);
            dm.setMeasureNumber(m.number);
            dm.setDynamicType(dynType);
            dynamicsRows.push(dm);
          }
        }
        m.notes.forEach((n, noteIdx) => {
          for (const artType of n.articulationTypes) {
            const am = new ArticulationMarking();
            am.setPartId(part.id);
            am.setMeasureIndex(m.index);
            am.setMeasureNumber(m.number);
            am.setNoteIndexInMeasure(noteIdx);
            am.setArticulationType(artType);
            articulationRows.push(am);
          }
        });
      }
    }
    out.setDynamicsList(dynamicsRows);
    out.setArticulationsList(articulationRows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting dynamics/articulations'));
    return out;
  }
}
