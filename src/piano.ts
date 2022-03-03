import { black, white, grey } from "./constants";
import { ReactMidiVisualizerProps } from "./react-midi-visualizer";
import { determineLowestHighestC } from "./helpers";
import { SegmentRangeType, NoteToDrawType, Note } from "./types";

export default class Piano {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private range: SegmentRangeType;
  private keyWidth: number;
  private topOfPianoY: number;
  private whiteKeyWidth: number;
  private keyboardHeight: number;
  private blackKeyHeight: number;
  private pixelsPerSecondFall: number;
  private notes: Note[];

  private static whiteWidthToBlackRatio: number = 1.75;
  private static isBlackPattern: number[] = [
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    0,
    1,
    0,
    1,
    0
  ];
  private static keyOffsetPercents: number[] = [
    0,
    0,
    -0.36,
    0,
    -0.68,
    0,
    0,
    -0.26,
    0,
    -0.5,
    0,
    -0.75
  ];
  private static lineThickness: number = 5;
  private static thicknessOffset: number = Piano.lineThickness / 2;

  constructor(_ctx: CanvasRenderingContext2D, props: ReactMidiVisualizerProps) {
    this.ctx = _ctx;

    const { options, notes } = props;
    this.width = props.width - Piano.thicknessOffset * 2;
    this.height = props.height - Piano.thicknessOffset;

    this.keyboardHeight = options.keyboardHeight || 0.25 * this.height;
    this.range = determineLowestHighestC(notes.map(note => note.midi));
    this.topOfPianoY = this.height - this.keyboardHeight;
    this.notes = notes;
    this.keyWidth = this.determineKeyWidth();
    this.whiteKeyWidth = this.keyWidth * Piano.whiteWidthToBlackRatio;
    this.pixelsPerSecondFall =
      options.pixelsPerSecondFall || this.height - this.keyboardHeight;
    this.blackKeyHeight = this.keyboardHeight * 0.66;
  }

  private determineKeyWidth(): number {
    const numberOfNotesOnPiano =
      this.range.highestMidiNote - this.range.lowestMidiNote + 1;
    const highestNoteIsBlack: boolean = !!Piano.isBlackPattern[
      this.range.highestMidiNote % 12
    ];
    return highestNoteIsBlack
      ? this.width / numberOfNotesOnPiano
      : this.width / (numberOfNotesOnPiano + Piano.whiteWidthToBlackRatio - 1);
  }

  private makeWhiteKey(note: NoteToDrawType): void {
    const { x, y } = note.point;
    const fillColor = note.depressed ? grey : white;
    this.makeRect(
      x,
      y,
      this.whiteKeyWidth,
      this.keyboardHeight,
      black,
      fillColor
    );
  }

  private makeBlackKey(note: NoteToDrawType): void {
    const { x, y } = note.point;
    const fillColor = note.depressed ? grey : black;
    this.makeRect(x, y, this.keyWidth, this.blackKeyHeight, black, fillColor);
  }

  private makeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    border: string,
    fill: string,
    lyric?: string | null
  ): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = Piano.lineThickness;
    this.ctx.strokeStyle = border;
    this.ctx.fillStyle = fill;
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.fill();
    if (lyric) {
      this.ctx.font = "28px serif";
      this.ctx.fillText(lyric, x + width + 5, y + height);
    }
  }

  private getcurrentDepressedNotes(clockTime: number): number[] {
    return this.notes
      .filter(
        ({ time, duration }) => clockTime >= time && clockTime < time + duration
      )
      .map(note => note.midi);
  }

  public draw(timeSinceStart: number): void {
    this.drawEvents(timeSinceStart);

    const depressedNotes = this.getcurrentDepressedNotes(timeSinceStart);
    this.drawPiano(depressedNotes);
  }

  private drawEvents(timeSinceStart: number): void {
    const offset = Piano.thicknessOffset;
    this.notes.forEach((note: Note) => {
      const numPixelsToRight =
        (note.midi - this.range.lowestMidiNote) * this.keyWidth + offset;
      const timeUntilNoteIsPlayed = note.time - timeSinceStart;
      const eventHeight = note.duration * this.pixelsPerSecondFall;
      const pixelsItMustTravel =
        this.topOfPianoY -
        timeUntilNoteIsPlayed * this.pixelsPerSecondFall -
        eventHeight;
      this.makeRect(
        numPixelsToRight,
        pixelsItMustTravel,
        this.keyWidth,
        eventHeight,
        black,
        grey,
        note.lyric
      );
    });
  }

  private drawPiano(depressedNotes: number[]): void {
    let currentX = Piano.thicknessOffset;
    const blackNotes: NoteToDrawType[] = [];
    const whiteNotes: NoteToDrawType[] = [];
    for (
      let i = this.range.lowestMidiNote;
      i <= this.range.highestMidiNote;
      i++, currentX += this.keyWidth
    ) {
      const noteIndex = i % 12;
      const noteIsBlack = !!Piano.isBlackPattern[noteIndex];
      const depressed = depressedNotes.indexOf(i) !== -1;
      if (noteIsBlack) {
        blackNotes.push({
          depressed,
          point: { x: currentX, y: this.topOfPianoY }
        });
      } else {
        const offset = this.keyWidth * Piano.keyOffsetPercents[noteIndex];
        whiteNotes.push({
          depressed,
          point: { x: currentX + offset, y: this.topOfPianoY }
        });
      }
    }
    whiteNotes.forEach(note => this.makeWhiteKey(note));
    blackNotes.forEach(note => this.makeBlackKey(note));
  }
}
