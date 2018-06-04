import { ReactMidiVisualizerProps } from './react-midi-visualizer'
import Piano from './piano/piano'
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

		this.piano = new Piano(_ctx, props)
	}

	public drawFrame = (time: number) => {
		this.drawClearRect()
		this.piano.draw(time)
	}

	private drawClearRect = () => {
		this.ctx.fillStyle = white
		this.ctx.fillRect(0, 0, this.width, this.height)
	}
}
