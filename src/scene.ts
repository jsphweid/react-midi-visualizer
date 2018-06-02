import { ReactMidiVisualizerProps } from './react-midi-visualizer'
import Piano from './piano/piano'
import { determineLowestHighestC } from './common/helpers'
import { white } from './common/constants'
export default class Scene {
	ctx: CanvasRenderingContext2D
	width: number
	height: number
	piano: Piano

	constructor(_ctx: CanvasRenderingContext2D, props: ReactMidiVisualizerProps) {
		this.ctx = _ctx
		this.width = props.width
		this.height = props.height

		const { lowestC, highestC } = determineLowestHighestC(props.notes.map(note => note.midi))
		this.piano = new Piano(_ctx, 10, 10, [lowestC, highestC])
	}

	public drawFrame = (time: number) => {
		this.drawClearRect()
		this.piano.draw()
	}

	private drawClearRect = () => {
		this.ctx.fillStyle = white
		this.ctx.fillRect(0, 0, this.width, this.height)
	}
}
