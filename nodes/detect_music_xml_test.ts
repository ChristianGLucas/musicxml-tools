import { MusicXmlInput } from '../gen/messages_pb';
import { detectMusicXml } from './detect_music_xml';
import {
  ctx,
  FIXTURE_PARTWISE_XML,
  FIXTURE_TIMEWISE_XML,
  FIXTURE_NON_MUSICXML_XML,
  FIXTURE_MALFORMED_XML,
  FIXTURE_XXE_XML,
  FIXTURE_BILLION_LAUGHS_XML,
  ORACLE_DETECT,
} from './testkit';

function run(xml: string) {
  const input = new MusicXmlInput();
  input.setXml(xml);
  return detectMusicXml(ctx, input);
}

describe('DetectMusicXml', () => {
  // INDEPENDENT ORACLE: ORACLE_DETECT in testkit.ts was transcribed by
  // hand from the fixture's root element, not derived by running this node.
  it('detects score-partwise and its version', () => {
    const result = run(FIXTURE_PARTWISE_XML);
    expect(result.getIsMusicXml()).toBe(ORACLE_DETECT.isMusicXml);
    expect(result.getForm()).toBe(ORACLE_DETECT.form);
    expect(result.getMusicxmlVersion()).toBe(ORACLE_DETECT.version);
    expect(result.getError()).toBe('');
  });

  it('detects score-timewise', () => {
    const result = run(FIXTURE_TIMEWISE_XML);
    expect(result.getIsMusicXml()).toBe(true);
    expect(result.getForm()).toBe('score-timewise');
    expect(result.getMusicxmlVersion()).toBe('4.0');
  });

  it('reports is_music_xml=false for well-formed XML that is not MusicXML, without an error', () => {
    const result = run(FIXTURE_NON_MUSICXML_XML);
    expect(result.getIsMusicXml()).toBe(false);
    expect(result.getForm()).toBe('');
    expect(result.getError()).toBe('');
  });

  it('reports is_music_xml=false (never throws) for malformed XML', () => {
    const result = run(FIXTURE_MALFORMED_XML);
    expect(result.getIsMusicXml()).toBe(false);
  });

  it('reports is_music_xml=false for empty input, without crashing', () => {
    const result = run('');
    expect(result.getIsMusicXml()).toBe(false);
    expect(result.getError()).toBe('');
  });

  // SECURITY ORACLE: a DOCTYPE declaring a SYSTEM external entity makes
  // fast-xml-parser throw ("External entities are not supported") rather
  // than resolve it — verified directly against the installed
  // fast-xml-parser@4.5.7 before writing this test. This proves the node
  // degrades that rejection into a clean is_music_xml=false rather than
  // letting an unhandled exception escape (which would be an Axiom node
  // crash, not a security leak, but a caller-visible defect either way).
  it('never resolves an XXE external-entity DOCTYPE — and never crashes on one', () => {
    const result = run(FIXTURE_XXE_XML);
    expect(result.getIsMusicXml()).toBe(false);
  });

  it('does not exponentially expand a billion-laughs internal entity (parses fine; entity passes through unexpanded)', () => {
    const result = run(FIXTURE_BILLION_LAUGHS_XML);
    expect(result.getIsMusicXml()).toBe(true);
    expect(result.getForm()).toBe('score-partwise');
  });

  it('is deterministic across repeated invocations on the same input', () => {
    const a = run(FIXTURE_PARTWISE_XML);
    const b = run(FIXTURE_PARTWISE_XML);
    expect(a.toObject()).toEqual(b.toObject());
  });
});
