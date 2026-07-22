import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractTempo } from './extract_tempo';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_TEMPO_P1 } from './testkit';

describe('ExtractTempo', () => {
  // INDEPENDENT ORACLE: ORACLE_TEMPO_P1 was transcribed by hand from P1's
  // <direction><sound tempo="120"/> and <metronome><beat-unit>quarter
  // </beat-unit><per-minute>120</per-minute></metronome>.
  it('extracts bpm=120 with beat_unit=quarter, not a metric modulation', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractTempo(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getTemposList().map((t) => ({
        partId: t.getPartId(),
        measureIndex: t.getMeasureIndex(),
        measureNumber: t.getMeasureNumber(),
        bpm: t.getBpm(),
        bpmSpecified: t.getBpmSpecified(),
        beatUnit: t.getBeatUnit(),
        beatUnitDots: t.getBeatUnitDots(),
        metricModulation: t.getMetricModulation(),
        beatUnit2: t.getBeatUnit2(),
      })),
    ).toEqual(ORACLE_TEMPO_P1);
  });

  it('a part with no tempo direction returns zero rows', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractTempo(ctx, q);
    expect(result.getTemposList()).toHaveLength(0);
  });

  it('extracts a metric-modulation mark (two beat-units) correctly', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1"><measure number="1">
        <direction><direction-type><metronome>
          <beat-unit>quarter</beat-unit><beat-unit-dot/>
          <beat-unit>quarter</beat-unit>
        </metronome></direction-type></direction>
        <note><rest/><duration>4</duration><voice>1</voice><type>quarter</type></note>
      </measure></part>
    </score-partwise>`;
    const q = new MusicXmlPartQuery();
    q.setXml(xml);
    q.setPartId('P1');
    const result = extractTempo(ctx, q);
    expect(result.getTemposList()).toHaveLength(1);
    const t = result.getTemposList()[0];
    expect(t.getMetricModulation()).toBe(true);
    expect(t.getBeatUnit()).toBe('quarter');
    expect(t.getBeatUnit2()).toBe('quarter');
    expect(t.getBeatUnitDots()).toBe(1);
    expect(t.getBpmSpecified()).toBe(false);
  });
});
