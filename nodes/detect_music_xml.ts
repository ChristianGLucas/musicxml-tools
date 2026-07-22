import { MusicXmlInput, DetectResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { detectMusicXml as detect } from './lib';

/**
 * Detect whether the given text is MusicXML, and if so which of the two
 * interchangeable root forms it uses: score-partwise (organized part then
 * measure — the common form) or score-timewise (organized measure then
 * part). Never throws: unrecognized or malformed input simply comes back
 * with is_music_xml=false rather than an error; error is set only for an
 * oversized/pathologically-nested input that was rejected before parsing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectMusicXml(ax: AxiomContext, input: MusicXmlInput): DetectResult {
  const out = new DetectResult();
  const r = detect(input.getXml());
  out.setIsMusicXml(r.isMusicXml);
  out.setForm(r.form);
  out.setMusicxmlVersion(r.version);
  out.setError(r.error);
  return out;
}
