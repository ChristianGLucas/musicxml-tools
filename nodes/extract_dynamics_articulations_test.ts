import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractDynamicsArticulations } from './extract_dynamics_articulations';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_DYNAMICS_P1, ORACLE_ARTICULATIONS_P1 } from './testkit';

describe('ExtractDynamicsArticulations', () => {
  // INDEPENDENT ORACLE: ORACLE_DYNAMICS_P1/ORACLE_ARTICULATIONS_P1 were
  // transcribed by hand from P1's <dynamics><mf/> direction and the
  // <staccato/><accent/> pair under the first note's <notations>.
  it('extracts the mf dynamic and the staccato+accent articulations on note 0', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractDynamicsArticulations(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getDynamicsList().map((d) => ({
        partId: d.getPartId(),
        measureIndex: d.getMeasureIndex(),
        measureNumber: d.getMeasureNumber(),
        dynamicType: d.getDynamicType(),
      })),
    ).toEqual(ORACLE_DYNAMICS_P1);
    expect(
      result.getArticulationsList().map((a) => ({
        partId: a.getPartId(),
        measureIndex: a.getMeasureIndex(),
        measureNumber: a.getMeasureNumber(),
        noteIndexInMeasure: a.getNoteIndexInMeasure(),
        articulationType: a.getArticulationType(),
      })),
    ).toEqual(ORACLE_ARTICULATIONS_P1);
  });

  it('a part with no dynamics/articulations returns zero rows for both', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractDynamicsArticulations(ctx, q);
    expect(result.getDynamicsList()).toHaveLength(0);
    expect(result.getArticulationsList()).toHaveLength(0);
  });

  it('extracts other-dynamics by its text content', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1"><measure number="1">
        <direction><direction-type><dynamics><other-dynamics>poco f</other-dynamics></dynamics></direction-type></direction>
        <note><rest/><duration>4</duration><voice>1</voice><type>quarter</type></note>
      </measure></part>
    </score-partwise>`;
    const q = new MusicXmlPartQuery();
    q.setXml(xml);
    q.setPartId('P1');
    const result = extractDynamicsArticulations(ctx, q);
    expect(result.getDynamicsList().map((d) => d.getDynamicType())).toEqual(['poco f']);
  });
});
