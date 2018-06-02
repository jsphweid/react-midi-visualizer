import { black } from '../common/constants'
export default class Piano {
	private ctx: CanvasRenderingContext2D
	private x: number
	private y: number
	private noteRange: number[]
	private static keyWidth: number = 40 // hi
	private static whiteWidthToBlackRatio: number = 1.75
	private static isBlackPattern: number[] = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]
	private static keyOffsetPercents: number[] = [0, 0, -0.36, 0, -0.68, 0, 0, -0.26, 0, -0.5, 0, -0.75]
	private static whiteKeyHeight: number = 300
	private static whiteKeyWidth: number = Piano.keyWidth * Piano.whiteWidthToBlackRatio
	private static blackKeyHeight: number = 200

	constructor(_ctx: CanvasRenderingContext2D, _x: number, _y: number, _noteRange: number[]) {
		this.ctx = _ctx
		this.x = _x
		this.y = _y
		this.noteRange = _noteRange
	}

	private makeWhiteKey(x: number, y: number): void {
		this.ctx.beginPath()
		this.ctx.lineWidth = 5
		this.ctx.strokeStyle = 'black'
		this.ctx.rect(x, y, Piano.whiteKeyWidth, Piano.whiteKeyHeight)
		this.ctx.stroke()
	}

	private makeBlackKey(x: number, y: number): void {
		this.ctx.fillStyle = black
		this.ctx.fillRect(x, y, Piano.keyWidth, Piano.blackKeyHeight)
	}

	public draw() {
		let currentX = this.x
		const pianoKeys: any[] = []
		for (let i = this.noteRange[0]; i <= this.noteRange[1]; i++, currentX += Piano.keyWidth) {
			const noteIndex = i % 12
			const noteIsBlack = !!Piano.isBlackPattern[noteIndex]
			if (noteIsBlack) {
				this.makeBlackKey(currentX, this.y)
			} else {
				const offset = Piano.keyWidth * Piano.keyOffsetPercents[noteIndex]
				this.makeWhiteKey(currentX + offset, this.y)
			}
		}
	}
}
