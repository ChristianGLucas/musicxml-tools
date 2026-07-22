// package: christiangeorgelucas.musicxml_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class MusicXmlInput extends jspb.Message {
  getXml(): string;
  setXml(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MusicXmlInput.AsObject;
  static toObject(includeInstance: boolean, msg: MusicXmlInput): MusicXmlInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MusicXmlInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MusicXmlInput;
  static deserializeBinaryFromReader(message: MusicXmlInput, reader: jspb.BinaryReader): MusicXmlInput;
}

export namespace MusicXmlInput {
  export type AsObject = {
    xml: string,
  }
}

export class MusicXmlPartQuery extends jspb.Message {
  getXml(): string;
  setXml(value: string): void;

  getPartId(): string;
  setPartId(value: string): void;

  getStartMeasureIndex(): number;
  setStartMeasureIndex(value: number): void;

  getEndMeasureIndex(): number;
  setEndMeasureIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MusicXmlPartQuery.AsObject;
  static toObject(includeInstance: boolean, msg: MusicXmlPartQuery): MusicXmlPartQuery.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MusicXmlPartQuery, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MusicXmlPartQuery;
  static deserializeBinaryFromReader(message: MusicXmlPartQuery, reader: jspb.BinaryReader): MusicXmlPartQuery;
}

export namespace MusicXmlPartQuery {
  export type AsObject = {
    xml: string,
    partId: string,
    startMeasureIndex: number,
    endMeasureIndex: number,
  }
}

export class DetectResult extends jspb.Message {
  getIsMusicXml(): boolean;
  setIsMusicXml(value: boolean): void;

  getForm(): string;
  setForm(value: string): void;

  getMusicxmlVersion(): string;
  setMusicxmlVersion(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectResult): DetectResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectResult;
  static deserializeBinaryFromReader(message: DetectResult, reader: jspb.BinaryReader): DetectResult;
}

export namespace DetectResult {
  export type AsObject = {
    isMusicXml: boolean,
    form: string,
    musicxmlVersion: string,
    error: string,
  }
}

export class Creator extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Creator.AsObject;
  static toObject(includeInstance: boolean, msg: Creator): Creator.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Creator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Creator;
  static deserializeBinaryFromReader(message: Creator, reader: jspb.BinaryReader): Creator;
}

export namespace Creator {
  export type AsObject = {
    type: string,
    name: string,
  }
}

export class ScoreMetadata extends jspb.Message {
  getWorkTitle(): string;
  setWorkTitle(value: string): void;

  getWorkNumber(): string;
  setWorkNumber(value: string): void;

  getMovementTitle(): string;
  setMovementTitle(value: string): void;

  getMovementNumber(): string;
  setMovementNumber(value: string): void;

  clearCreatorsList(): void;
  getCreatorsList(): Array<Creator>;
  setCreatorsList(value: Array<Creator>): void;
  addCreators(value?: Creator, index?: number): Creator;

  getRights(): string;
  setRights(value: string): void;

  clearEncodingSoftwareList(): void;
  getEncodingSoftwareList(): Array<string>;
  setEncodingSoftwareList(value: Array<string>): void;
  addEncodingSoftware(value: string, index?: number): string;

  clearEncodingDatesList(): void;
  getEncodingDatesList(): Array<string>;
  setEncodingDatesList(value: Array<string>): void;
  addEncodingDates(value: string, index?: number): string;

  getSource(): string;
  setSource(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScoreMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ScoreMetadata): ScoreMetadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScoreMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScoreMetadata;
  static deserializeBinaryFromReader(message: ScoreMetadata, reader: jspb.BinaryReader): ScoreMetadata;
}

export namespace ScoreMetadata {
  export type AsObject = {
    workTitle: string,
    workNumber: string,
    movementTitle: string,
    movementNumber: string,
    creatorsList: Array<Creator.AsObject>,
    rights: string,
    encodingSoftwareList: Array<string>,
    encodingDatesList: Array<string>,
    source: string,
    error: string,
  }
}

export class PartInfo extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getAbbreviation(): string;
  setAbbreviation(value: string): void;

  getInstrumentCount(): number;
  setInstrumentCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PartInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PartInfo): PartInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PartInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PartInfo;
  static deserializeBinaryFromReader(message: PartInfo, reader: jspb.BinaryReader): PartInfo;
}

export namespace PartInfo {
  export type AsObject = {
    id: string,
    name: string,
    abbreviation: string,
    instrumentCount: number,
  }
}

export class ListPartsResult extends jspb.Message {
  clearPartsList(): void;
  getPartsList(): Array<PartInfo>;
  setPartsList(value: Array<PartInfo>): void;
  addParts(value?: PartInfo, index?: number): PartInfo;

  getPartCount(): number;
  setPartCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPartsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListPartsResult): ListPartsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListPartsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPartsResult;
  static deserializeBinaryFromReader(message: ListPartsResult, reader: jspb.BinaryReader): ListPartsResult;
}

export namespace ListPartsResult {
  export type AsObject = {
    partsList: Array<PartInfo.AsObject>,
    partCount: number,
    error: string,
  }
}

export class ParsedPart extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getMeasureCount(): number;
  setMeasureCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParsedPart.AsObject;
  static toObject(includeInstance: boolean, msg: ParsedPart): ParsedPart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParsedPart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParsedPart;
  static deserializeBinaryFromReader(message: ParsedPart, reader: jspb.BinaryReader): ParsedPart;
}

export namespace ParsedPart {
  export type AsObject = {
    id: string,
    name: string,
    measureCount: number,
  }
}

export class ParsedScore extends jspb.Message {
  getForm(): string;
  setForm(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getComposer(): string;
  setComposer(value: string): void;

  clearPartsList(): void;
  getPartsList(): Array<ParsedPart>;
  setPartsList(value: Array<ParsedPart>): void;
  addParts(value?: ParsedPart, index?: number): ParsedPart;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParsedScore.AsObject;
  static toObject(includeInstance: boolean, msg: ParsedScore): ParsedScore.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParsedScore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParsedScore;
  static deserializeBinaryFromReader(message: ParsedScore, reader: jspb.BinaryReader): ParsedScore;
}

export namespace ParsedScore {
  export type AsObject = {
    form: string,
    title: string,
    composer: string,
    partsList: Array<ParsedPart.AsObject>,
    error: string,
  }
}

export class MeasureInfo extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  getNumber(): string;
  setNumber(value: string): void;

  getImplicit(): boolean;
  setImplicit(value: boolean): void;

  getWidth(): number;
  setWidth(value: number): void;

  getWidthSpecified(): boolean;
  setWidthSpecified(value: boolean): void;

  getNoteCount(): number;
  setNoteCount(value: number): void;

  getRestCount(): number;
  setRestCount(value: number): void;

  getHasAttributes(): boolean;
  setHasAttributes(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MeasureInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MeasureInfo): MeasureInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MeasureInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MeasureInfo;
  static deserializeBinaryFromReader(message: MeasureInfo, reader: jspb.BinaryReader): MeasureInfo;
}

export namespace MeasureInfo {
  export type AsObject = {
    partId: string,
    index: number,
    number: string,
    implicit: boolean,
    width: number,
    widthSpecified: boolean,
    noteCount: number,
    restCount: number,
    hasAttributes: boolean,
  }
}

export class ExtractMeasuresResult extends jspb.Message {
  clearMeasuresList(): void;
  getMeasuresList(): Array<MeasureInfo>;
  setMeasuresList(value: Array<MeasureInfo>): void;
  addMeasures(value?: MeasureInfo, index?: number): MeasureInfo;

  getTotalMeasures(): number;
  setTotalMeasures(value: number): void;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMeasuresResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMeasuresResult): ExtractMeasuresResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMeasuresResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMeasuresResult;
  static deserializeBinaryFromReader(message: ExtractMeasuresResult, reader: jspb.BinaryReader): ExtractMeasuresResult;
}

export namespace ExtractMeasuresResult {
  export type AsObject = {
    measuresList: Array<MeasureInfo.AsObject>,
    totalMeasures: number,
    truncated: boolean,
    error: string,
  }
}

export class NotePitch extends jspb.Message {
  getStep(): string;
  setStep(value: string): void;

  getAlter(): number;
  setAlter(value: number): void;

  getAlterSpecified(): boolean;
  setAlterSpecified(value: boolean): void;

  getOctave(): number;
  setOctave(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotePitch.AsObject;
  static toObject(includeInstance: boolean, msg: NotePitch): NotePitch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NotePitch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotePitch;
  static deserializeBinaryFromReader(message: NotePitch, reader: jspb.BinaryReader): NotePitch;
}

export namespace NotePitch {
  export type AsObject = {
    step: string,
    alter: number,
    alterSpecified: boolean,
    octave: number,
  }
}

export class NoteInfo extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getIsRest(): boolean;
  setIsRest(value: boolean): void;

  getIsUnpitched(): boolean;
  setIsUnpitched(value: boolean): void;

  hasPitch(): boolean;
  clearPitch(): void;
  getPitch(): NotePitch | undefined;
  setPitch(value?: NotePitch): void;

  getDuration(): number;
  setDuration(value: number): void;

  getType(): string;
  setType(value: string): void;

  getDots(): number;
  setDots(value: number): void;

  getVoice(): string;
  setVoice(value: string): void;

  getStaff(): number;
  setStaff(value: number): void;

  getStaffSpecified(): boolean;
  setStaffSpecified(value: boolean): void;

  getTieStart(): boolean;
  setTieStart(value: boolean): void;

  getTieStop(): boolean;
  setTieStop(value: boolean): void;

  getChord(): boolean;
  setChord(value: boolean): void;

  getGrace(): boolean;
  setGrace(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NoteInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NoteInfo): NoteInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NoteInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NoteInfo;
  static deserializeBinaryFromReader(message: NoteInfo, reader: jspb.BinaryReader): NoteInfo;
}

export namespace NoteInfo {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    isRest: boolean,
    isUnpitched: boolean,
    pitch?: NotePitch.AsObject,
    duration: number,
    type: string,
    dots: number,
    voice: string,
    staff: number,
    staffSpecified: boolean,
    tieStart: boolean,
    tieStop: boolean,
    chord: boolean,
    grace: boolean,
  }
}

export class ExtractNotesResult extends jspb.Message {
  clearNotesList(): void;
  getNotesList(): Array<NoteInfo>;
  setNotesList(value: Array<NoteInfo>): void;
  addNotes(value?: NoteInfo, index?: number): NoteInfo;

  getTotalNotes(): number;
  setTotalNotes(value: number): void;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractNotesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractNotesResult): ExtractNotesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractNotesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractNotesResult;
  static deserializeBinaryFromReader(message: ExtractNotesResult, reader: jspb.BinaryReader): ExtractNotesResult;
}

export namespace ExtractNotesResult {
  export type AsObject = {
    notesList: Array<NoteInfo.AsObject>,
    totalNotes: number,
    truncated: boolean,
    error: string,
  }
}

export class TimeSignatureChange extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  clearBeatsList(): void;
  getBeatsList(): Array<string>;
  setBeatsList(value: Array<string>): void;
  addBeats(value: string, index?: number): string;

  clearBeatTypeList(): void;
  getBeatTypeList(): Array<string>;
  setBeatTypeList(value: Array<string>): void;
  addBeatType(value: string, index?: number): string;

  getSymbol(): string;
  setSymbol(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeSignatureChange.AsObject;
  static toObject(includeInstance: boolean, msg: TimeSignatureChange): TimeSignatureChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeSignatureChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeSignatureChange;
  static deserializeBinaryFromReader(message: TimeSignatureChange, reader: jspb.BinaryReader): TimeSignatureChange;
}

export namespace TimeSignatureChange {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    beatsList: Array<string>,
    beatTypeList: Array<string>,
    symbol: string,
  }
}

export class ExtractTimeSignaturesResult extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<TimeSignatureChange>;
  setChangesList(value: Array<TimeSignatureChange>): void;
  addChanges(value?: TimeSignatureChange, index?: number): TimeSignatureChange;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractTimeSignaturesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractTimeSignaturesResult): ExtractTimeSignaturesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractTimeSignaturesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractTimeSignaturesResult;
  static deserializeBinaryFromReader(message: ExtractTimeSignaturesResult, reader: jspb.BinaryReader): ExtractTimeSignaturesResult;
}

export namespace ExtractTimeSignaturesResult {
  export type AsObject = {
    changesList: Array<TimeSignatureChange.AsObject>,
    error: string,
  }
}

export class KeySignatureChange extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getFifths(): number;
  setFifths(value: number): void;

  getMode(): string;
  setMode(value: string): void;

  getKeyName(): string;
  setKeyName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeySignatureChange.AsObject;
  static toObject(includeInstance: boolean, msg: KeySignatureChange): KeySignatureChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeySignatureChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeySignatureChange;
  static deserializeBinaryFromReader(message: KeySignatureChange, reader: jspb.BinaryReader): KeySignatureChange;
}

export namespace KeySignatureChange {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    fifths: number,
    mode: string,
    keyName: string,
  }
}

export class ExtractKeySignaturesResult extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<KeySignatureChange>;
  setChangesList(value: Array<KeySignatureChange>): void;
  addChanges(value?: KeySignatureChange, index?: number): KeySignatureChange;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractKeySignaturesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractKeySignaturesResult): ExtractKeySignaturesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractKeySignaturesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractKeySignaturesResult;
  static deserializeBinaryFromReader(message: ExtractKeySignaturesResult, reader: jspb.BinaryReader): ExtractKeySignaturesResult;
}

export namespace ExtractKeySignaturesResult {
  export type AsObject = {
    changesList: Array<KeySignatureChange.AsObject>,
    error: string,
  }
}

export class ClefChange extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getSign(): string;
  setSign(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  getLineSpecified(): boolean;
  setLineSpecified(value: boolean): void;

  getOctaveChange(): number;
  setOctaveChange(value: number): void;

  getOctaveChangeSpecified(): boolean;
  setOctaveChangeSpecified(value: boolean): void;

  getStaffNumber(): number;
  setStaffNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClefChange.AsObject;
  static toObject(includeInstance: boolean, msg: ClefChange): ClefChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClefChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClefChange;
  static deserializeBinaryFromReader(message: ClefChange, reader: jspb.BinaryReader): ClefChange;
}

export namespace ClefChange {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    sign: string,
    line: number,
    lineSpecified: boolean,
    octaveChange: number,
    octaveChangeSpecified: boolean,
    staffNumber: number,
  }
}

export class ExtractClefsResult extends jspb.Message {
  clearClefsList(): void;
  getClefsList(): Array<ClefChange>;
  setClefsList(value: Array<ClefChange>): void;
  addClefs(value?: ClefChange, index?: number): ClefChange;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractClefsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractClefsResult): ExtractClefsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractClefsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractClefsResult;
  static deserializeBinaryFromReader(message: ExtractClefsResult, reader: jspb.BinaryReader): ExtractClefsResult;
}

export namespace ExtractClefsResult {
  export type AsObject = {
    clefsList: Array<ClefChange.AsObject>,
    error: string,
  }
}

export class TempoMarking extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getBpm(): number;
  setBpm(value: number): void;

  getBpmSpecified(): boolean;
  setBpmSpecified(value: boolean): void;

  getBeatUnit(): string;
  setBeatUnit(value: string): void;

  getBeatUnitDots(): number;
  setBeatUnitDots(value: number): void;

  getMetricModulation(): boolean;
  setMetricModulation(value: boolean): void;

  getBeatUnit2(): string;
  setBeatUnit2(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TempoMarking.AsObject;
  static toObject(includeInstance: boolean, msg: TempoMarking): TempoMarking.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TempoMarking, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TempoMarking;
  static deserializeBinaryFromReader(message: TempoMarking, reader: jspb.BinaryReader): TempoMarking;
}

export namespace TempoMarking {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    bpm: number,
    bpmSpecified: boolean,
    beatUnit: string,
    beatUnitDots: number,
    metricModulation: boolean,
    beatUnit2: string,
  }
}

export class ExtractTempoResult extends jspb.Message {
  clearTemposList(): void;
  getTemposList(): Array<TempoMarking>;
  setTemposList(value: Array<TempoMarking>): void;
  addTempos(value?: TempoMarking, index?: number): TempoMarking;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractTempoResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractTempoResult): ExtractTempoResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractTempoResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractTempoResult;
  static deserializeBinaryFromReader(message: ExtractTempoResult, reader: jspb.BinaryReader): ExtractTempoResult;
}

export namespace ExtractTempoResult {
  export type AsObject = {
    temposList: Array<TempoMarking.AsObject>,
    error: string,
  }
}

export class LyricSyllable extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getNoteIndexInMeasure(): number;
  setNoteIndexInMeasure(value: number): void;

  getVerseNumber(): string;
  setVerseNumber(value: string): void;

  getSyllabic(): string;
  setSyllabic(value: string): void;

  getText(): string;
  setText(value: string): void;

  getExtend(): boolean;
  setExtend(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LyricSyllable.AsObject;
  static toObject(includeInstance: boolean, msg: LyricSyllable): LyricSyllable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LyricSyllable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LyricSyllable;
  static deserializeBinaryFromReader(message: LyricSyllable, reader: jspb.BinaryReader): LyricSyllable;
}

export namespace LyricSyllable {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    noteIndexInMeasure: number,
    verseNumber: string,
    syllabic: string,
    text: string,
    extend: boolean,
  }
}

export class ExtractLyricsResult extends jspb.Message {
  clearSyllablesList(): void;
  getSyllablesList(): Array<LyricSyllable>;
  setSyllablesList(value: Array<LyricSyllable>): void;
  addSyllables(value?: LyricSyllable, index?: number): LyricSyllable;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractLyricsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractLyricsResult): ExtractLyricsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractLyricsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractLyricsResult;
  static deserializeBinaryFromReader(message: ExtractLyricsResult, reader: jspb.BinaryReader): ExtractLyricsResult;
}

export namespace ExtractLyricsResult {
  export type AsObject = {
    syllablesList: Array<LyricSyllable.AsObject>,
    error: string,
  }
}

export class PartSummary extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getPartName(): string;
  setPartName(value: string): void;

  getMeasureCount(): number;
  setMeasureCount(value: number): void;

  getNoteCount(): number;
  setNoteCount(value: number): void;

  getRestCount(): number;
  setRestCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PartSummary.AsObject;
  static toObject(includeInstance: boolean, msg: PartSummary): PartSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PartSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PartSummary;
  static deserializeBinaryFromReader(message: PartSummary, reader: jspb.BinaryReader): PartSummary;
}

export namespace PartSummary {
  export type AsObject = {
    partId: string,
    partName: string,
    measureCount: number,
    noteCount: number,
    restCount: number,
  }
}

export class SummarizePartsResult extends jspb.Message {
  clearPartsList(): void;
  getPartsList(): Array<PartSummary>;
  setPartsList(value: Array<PartSummary>): void;
  addParts(value?: PartSummary, index?: number): PartSummary;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizePartsResult.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizePartsResult): SummarizePartsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizePartsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizePartsResult;
  static deserializeBinaryFromReader(message: SummarizePartsResult, reader: jspb.BinaryReader): SummarizePartsResult;
}

export namespace SummarizePartsResult {
  export type AsObject = {
    partsList: Array<PartSummary.AsObject>,
    error: string,
  }
}

export class InstrumentInfo extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getInstrumentId(): string;
  setInstrumentId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getAbbreviation(): string;
  setAbbreviation(value: string): void;

  getSound(): string;
  setSound(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentInfo.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentInfo): InstrumentInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentInfo;
  static deserializeBinaryFromReader(message: InstrumentInfo, reader: jspb.BinaryReader): InstrumentInfo;
}

export namespace InstrumentInfo {
  export type AsObject = {
    partId: string,
    instrumentId: string,
    name: string,
    abbreviation: string,
    sound: string,
  }
}

export class ExtractInstrumentsResult extends jspb.Message {
  clearInstrumentsList(): void;
  getInstrumentsList(): Array<InstrumentInfo>;
  setInstrumentsList(value: Array<InstrumentInfo>): void;
  addInstruments(value?: InstrumentInfo, index?: number): InstrumentInfo;

  getPartCount(): number;
  setPartCount(value: number): void;

  getInstrumentCount(): number;
  setInstrumentCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractInstrumentsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractInstrumentsResult): ExtractInstrumentsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractInstrumentsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractInstrumentsResult;
  static deserializeBinaryFromReader(message: ExtractInstrumentsResult, reader: jspb.BinaryReader): ExtractInstrumentsResult;
}

export namespace ExtractInstrumentsResult {
  export type AsObject = {
    instrumentsList: Array<InstrumentInfo.AsObject>,
    partCount: number,
    instrumentCount: number,
    error: string,
  }
}

export class PartDuration extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getTotalDurationDivisions(): number;
  setTotalDurationDivisions(value: number): void;

  getLastDivisionsPerQuarter(): number;
  setLastDivisionsPerQuarter(value: number): void;

  getDivisionsKnown(): boolean;
  setDivisionsKnown(value: boolean): void;

  getTotalQuarterNotes(): number;
  setTotalQuarterNotes(value: number): void;

  getTotalQuarterNotesReliable(): boolean;
  setTotalQuarterNotesReliable(value: boolean): void;

  getDivisionsChangedMidPart(): boolean;
  setDivisionsChangedMidPart(value: boolean): void;

  getUsesBackupForward(): boolean;
  setUsesBackupForward(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PartDuration.AsObject;
  static toObject(includeInstance: boolean, msg: PartDuration): PartDuration.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PartDuration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PartDuration;
  static deserializeBinaryFromReader(message: PartDuration, reader: jspb.BinaryReader): PartDuration;
}

export namespace PartDuration {
  export type AsObject = {
    partId: string,
    totalDurationDivisions: number,
    lastDivisionsPerQuarter: number,
    divisionsKnown: boolean,
    totalQuarterNotes: number,
    totalQuarterNotesReliable: boolean,
    divisionsChangedMidPart: boolean,
    usesBackupForward: boolean,
  }
}

export class ComputeDurationResult extends jspb.Message {
  clearPartsList(): void;
  getPartsList(): Array<PartDuration>;
  setPartsList(value: Array<PartDuration>): void;
  addParts(value?: PartDuration, index?: number): PartDuration;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComputeDurationResult.AsObject;
  static toObject(includeInstance: boolean, msg: ComputeDurationResult): ComputeDurationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ComputeDurationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComputeDurationResult;
  static deserializeBinaryFromReader(message: ComputeDurationResult, reader: jspb.BinaryReader): ComputeDurationResult;
}

export namespace ComputeDurationResult {
  export type AsObject = {
    partsList: Array<PartDuration.AsObject>,
    error: string,
  }
}

export class DynamicMarking extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getDynamicType(): string;
  setDynamicType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DynamicMarking.AsObject;
  static toObject(includeInstance: boolean, msg: DynamicMarking): DynamicMarking.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DynamicMarking, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DynamicMarking;
  static deserializeBinaryFromReader(message: DynamicMarking, reader: jspb.BinaryReader): DynamicMarking;
}

export namespace DynamicMarking {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    dynamicType: string,
  }
}

export class ArticulationMarking extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getNoteIndexInMeasure(): number;
  setNoteIndexInMeasure(value: number): void;

  getArticulationType(): string;
  setArticulationType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArticulationMarking.AsObject;
  static toObject(includeInstance: boolean, msg: ArticulationMarking): ArticulationMarking.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ArticulationMarking, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArticulationMarking;
  static deserializeBinaryFromReader(message: ArticulationMarking, reader: jspb.BinaryReader): ArticulationMarking;
}

export namespace ArticulationMarking {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    noteIndexInMeasure: number,
    articulationType: string,
  }
}

export class ExtractDynamicsArticulationsResult extends jspb.Message {
  clearDynamicsList(): void;
  getDynamicsList(): Array<DynamicMarking>;
  setDynamicsList(value: Array<DynamicMarking>): void;
  addDynamics(value?: DynamicMarking, index?: number): DynamicMarking;

  clearArticulationsList(): void;
  getArticulationsList(): Array<ArticulationMarking>;
  setArticulationsList(value: Array<ArticulationMarking>): void;
  addArticulations(value?: ArticulationMarking, index?: number): ArticulationMarking;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractDynamicsArticulationsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractDynamicsArticulationsResult): ExtractDynamicsArticulationsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractDynamicsArticulationsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractDynamicsArticulationsResult;
  static deserializeBinaryFromReader(message: ExtractDynamicsArticulationsResult, reader: jspb.BinaryReader): ExtractDynamicsArticulationsResult;
}

export namespace ExtractDynamicsArticulationsResult {
  export type AsObject = {
    dynamicsList: Array<DynamicMarking.AsObject>,
    articulationsList: Array<ArticulationMarking.AsObject>,
    error: string,
  }
}

export class TranspositionInfo extends jspb.Message {
  getPartId(): string;
  setPartId(value: string): void;

  getMeasureIndex(): number;
  setMeasureIndex(value: number): void;

  getMeasureNumber(): string;
  setMeasureNumber(value: string): void;

  getDiatonic(): number;
  setDiatonic(value: number): void;

  getDiatonicSpecified(): boolean;
  setDiatonicSpecified(value: boolean): void;

  getChromatic(): number;
  setChromatic(value: number): void;

  getOctaveChange(): number;
  setOctaveChange(value: number): void;

  getOctaveChangeSpecified(): boolean;
  setOctaveChangeSpecified(value: boolean): void;

  getDoubleTransposition(): boolean;
  setDoubleTransposition(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TranspositionInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TranspositionInfo): TranspositionInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TranspositionInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TranspositionInfo;
  static deserializeBinaryFromReader(message: TranspositionInfo, reader: jspb.BinaryReader): TranspositionInfo;
}

export namespace TranspositionInfo {
  export type AsObject = {
    partId: string,
    measureIndex: number,
    measureNumber: string,
    diatonic: number,
    diatonicSpecified: boolean,
    chromatic: number,
    octaveChange: number,
    octaveChangeSpecified: boolean,
    doubleTransposition: boolean,
  }
}

export class ExtractTranspositionResult extends jspb.Message {
  clearTranspositionsList(): void;
  getTranspositionsList(): Array<TranspositionInfo>;
  setTranspositionsList(value: Array<TranspositionInfo>): void;
  addTranspositions(value?: TranspositionInfo, index?: number): TranspositionInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractTranspositionResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractTranspositionResult): ExtractTranspositionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractTranspositionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractTranspositionResult;
  static deserializeBinaryFromReader(message: ExtractTranspositionResult, reader: jspb.BinaryReader): ExtractTranspositionResult;
}

export namespace ExtractTranspositionResult {
  export type AsObject = {
    transpositionsList: Array<TranspositionInfo.AsObject>,
    error: string,
  }
}

export class StructuralIssue extends jspb.Message {
  getSeverity(): string;
  setSeverity(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StructuralIssue.AsObject;
  static toObject(includeInstance: boolean, msg: StructuralIssue): StructuralIssue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StructuralIssue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StructuralIssue;
  static deserializeBinaryFromReader(message: StructuralIssue, reader: jspb.BinaryReader): StructuralIssue;
}

export namespace StructuralIssue {
  export type AsObject = {
    severity: string,
    message: string,
  }
}

export class ValidateStructureResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getForm(): string;
  setForm(value: string): void;

  clearIssuesList(): void;
  getIssuesList(): Array<StructuralIssue>;
  setIssuesList(value: Array<StructuralIssue>): void;
  addIssues(value?: StructuralIssue, index?: number): StructuralIssue;

  getPartCount(): number;
  setPartCount(value: number): void;

  getDeclaredPartCount(): number;
  setDeclaredPartCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateStructureResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateStructureResult): ValidateStructureResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateStructureResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateStructureResult;
  static deserializeBinaryFromReader(message: ValidateStructureResult, reader: jspb.BinaryReader): ValidateStructureResult;
}

export namespace ValidateStructureResult {
  export type AsObject = {
    valid: boolean,
    form: string,
    issuesList: Array<StructuralIssue.AsObject>,
    partCount: number,
    declaredPartCount: number,
    error: string,
  }
}

