import { black } from '../common/constants'
import { Note } from 'midiconvert'
import { ReactMidiVisualizerProps } from '../react-midi-visualizer'
export default class Piano {
	private ctx: CanvasRenderingContext2D
	private width: number
	private height: number
	private noteRange: number[]
	private keyWidth: number
	private whiteKeyWidth: number
	private props: ReactMidiVisualizerProps

	private static whiteWidthToBlackRatio: number = 1.75
	private static isBlackPattern: number[] = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]
	private static keyOffsetPercents: number[] = [0, 0, -0.36, 0, -0.68, 0, 0, -0.26, 0, -0.5, 0, -0.75]
	private static whiteKeyHeight: number = 300
	private static blackKeyHeight: number = 200

	private static pixelsPerSecond: number = 200

	constructor(
		_ctx: CanvasRenderingContext2D,
		_width: number,
		_height: number,
		_noteRange: number[],
		eventAndKeyWidth: number,
		props: ReactMidiVisualizerProps
	) {
		this.ctx = _ctx
		this.width = _width
		this.height = _height
		this.noteRange = _noteRange
		this.keyWidth = eventAndKeyWidth
		this.whiteKeyWidth = this.keyWidth * Piano.whiteWidthToBlackRatio
		this.props = props
	}

	private makeWhiteKey(x: number, y: number): void {
		this.ctx.beginPath()
		this.ctx.lineWidth = 5
		this.ctx.strokeStyle = 'black'
		this.ctx.rect(x, y, this.whiteKeyWidth, Piano.whiteKeyHeight)
		this.ctx.stroke()
	}

	private makeBlackKey(x: number, y: number): void {
		this.ctx.fillStyle = black
		this.ctx.fillRect(x, y, this.keyWidth, Piano.blackKeyHeight)
	}

	private makeRect(x: number, y: number, width: number, height: number): void {
		this.ctx.beginPath()
		this.ctx.lineWidth = 3
		this.ctx.strokeStyle = 'black'
		this.ctx.rect(x, y, width, height)
		this.ctx.stroke()
	}

	public draw(timeSinceStart: number): void {
		const dropDistance = 400
		this.drawEvents(timeSinceStart, dropDistance)
		this.drawPiano(dropDistance)
	}

	private drawEvents(timeSinceStart: number, dropDistance: number): void {
		this.props.notes.forEach((note: Note) => {
			const numPixelsToRight = (note.midi - this.noteRange[0]) * this.keyWidth
			const timeUntilNoteIsPlayed = note.time - timeSinceStart
			const pixelsItMustTravel = dropDistance - timeUntilNoteIsPlayed * Piano.pixelsPerSecond
			const height = note.duration * Piano.pixelsPerSecond
			this.makeRect(numPixelsToRight, pixelsItMustTravel, this.keyWidth, height)
		})
	}

	private drawPiano(dropDistance: number): void {
		let currentX = 0
		for (let i = this.noteRange[0]; i <= this.noteRange[1]; i++, currentX += this.keyWidth) {
			const noteIndex = i % 12
			const noteIsBlack = !!Piano.isBlackPattern[noteIndex]
			if (noteIsBlack) {
				this.makeBlackKey(currentX, dropDistance)
			} else {
				const offset = this.keyWidth * Piano.keyOffsetPercents[noteIndex]
				this.makeWhiteKey(currentX + offset, dropDistance)
			}
		}
	}
}
