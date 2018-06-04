import { black, white, grey } from '../common/constants'
import { Note } from 'midiconvert'
import ReactMidiVisualizer, { ReactMidiVisualizerProps } from '../react-midi-visualizer'
import { determineLowestHighestC } from '../common/helpers'
import { SegmentRangeType, PointType, NoteToDrawType } from '../common/types'
export default class Piano {
	private ctx: CanvasRenderingContext2D
	private width: number
	private height: number
	private range: SegmentRangeType
	private keyWidth: number
	private topOfPianoY: number
	private whiteKeyWidth: number
	private keyboardHeight: number
	private blackKeyHeight: number
	private pixelsPerSecondFall: number
	private notes: Note[]

	private static whiteWidthToBlackRatio: number = 1.75
	private static isBlackPattern: number[] = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]
	private static keyOffsetPercents: number[] = [0, 0, -0.36, 0, -0.68, 0, 0, -0.26, 0, -0.5, 0, -0.75]

	constructor(_ctx: CanvasRenderingContext2D, props: ReactMidiVisualizerProps) {
		this.ctx = _ctx

		const { options, width, height, notes } = props
		this.keyboardHeight = options.keyboardHeight || 0.25 * height
		this.range = determineLowestHighestC(notes.map(note => note.midi))
		this.topOfPianoY = height - this.keyboardHeight
		this.notes = notes
		this.keyWidth = props.width / (this.range.highestMidiNote - this.range.lowestMidiNote + 1)
		this.whiteKeyWidth = this.keyWidth * Piano.whiteWidthToBlackRatio
		this.width = width
		this.height = height
		this.pixelsPerSecondFall = options.pixelsPerSecondFall || height - this.keyboardHeight
		this.blackKeyHeight = this.keyboardHeight * 0.66
	}

	private makeWhiteKey(note: NoteToDrawType): void {
		const { x, y } = note.point
		const fillColor = note.depressed ? grey : white
		this.makeRect(x, y, this.whiteKeyWidth, this.keyboardHeight, black, fillColor)
	}

	private makeBlackKey(note: NoteToDrawType): void {
		const { x, y } = note.point
		const fillColor = note.depressed ? grey : black
		this.makeRect(x, y, this.keyWidth, this.blackKeyHeight, black, fillColor)
	}

	private makeRect(x: number, y: number, width: number, height: number, border: string, fill: string): void {
		this.ctx.beginPath()
		this.ctx.lineWidth = 3
		this.ctx.strokeStyle = border
		this.ctx.fillStyle = fill
		this.ctx.rect(x, y, width, height)
		this.ctx.stroke()
		this.ctx.fill()
	}

	private getcurrentDepressedNotes(clockTime: number): number[] {
		return this.notes
			.filter(({ time, duration }) => clockTime >= time && clockTime < time + duration)
			.map(note => note.midi)
	}

	public draw(timeSinceStart: number): void {
		// get depressed notes
		this.drawEvents(timeSinceStart)

		const depressedNotes = this.getcurrentDepressedNotes(timeSinceStart)
		this.drawPiano(depressedNotes)
	}

	private drawEvents(timeSinceStart: number): void {
		this.notes.forEach((note: Note) => {
			const numPixelsToRight = (note.midi - this.range.lowestMidiNote) * this.keyWidth
			const timeUntilNoteIsPlayed = note.time - timeSinceStart
			const pixelsItMustTravel = this.topOfPianoY - timeUntilNoteIsPlayed * this.pixelsPerSecondFall
			const height = note.duration * this.pixelsPerSecondFall
			this.makeRect(numPixelsToRight, pixelsItMustTravel, this.keyWidth, height, black, grey)
		})
	}

	private drawPiano(depressedNotes: number[]): void {
		let currentX = 0
		const blackNotes: NoteToDrawType[] = []
		const whiteNotes: NoteToDrawType[] = []
		for (let i = this.range.lowestMidiNote; i <= this.range.highestMidiNote; i++, currentX += this.keyWidth) {
			const noteIndex = i % 12
			const noteIsBlack = !!Piano.isBlackPattern[noteIndex]
			const depressed = depressedNotes.indexOf(i) !== -1
			if (noteIsBlack) {
				blackNotes.push({ depressed, point: { x: currentX, y: this.topOfPianoY } })
			} else {
				const offset = this.keyWidth * Piano.keyOffsetPercents[noteIndex]
				whiteNotes.push({ depressed, point: { x: currentX + offset, y: this.topOfPianoY } })
			}
		}
		whiteNotes.forEach(note => this.makeWhiteKey(note))
		blackNotes.forEach(note => this.makeBlackKey(note))
	}
}
