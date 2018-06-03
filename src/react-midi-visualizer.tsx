import * as React from 'react'
import { Note } from 'midiconvert'
import { ReactMidiVisualizerOptionsType } from './common/types'
import Piano from './piano/piano'
import Scene from './scene'

export interface ReactMidiVisualizerProps {
	audioContext: AudioContext
	width: number
	height: number
	startTime: number
	notes: Note[]
	options?: ReactMidiVisualizerOptionsType
}

export default class ReactMidiVisualizer extends React.Component<ReactMidiVisualizerProps> {
	canvasContext: CanvasRenderingContext2D
	scene: Scene

	private static defaultProps: Partial<ReactMidiVisualizerProps> = {
		options: { fps: 60 }
	}

	constructor(props: ReactMidiVisualizerProps) {
		super(props)
	}

	componentDidMount() {
		const props = {
			...this.props,
			options: {
				...ReactMidiVisualizer.defaultProps.options,
				...this.props.options
			}
		}

		this.scene = new Scene(this.canvasContext, props)
		window.requestAnimationFrame(this.animationStep.bind(this))
	}

	private setCanvasContext = (canvas: HTMLCanvasElement): void => {
		if (this.canvasContext) return null
		this.canvasContext = canvas.getContext('2d')
	}

	private animationStep = (): void => {
		setTimeout(() => {
			window.requestAnimationFrame(this.animationStep.bind(this))
			const timeSinceStart = this.props.startTime
				? this.props.audioContext.currentTime - this.props.startTime
				: null
			this.scene.drawFrame(timeSinceStart)
		}, 1000 / this.props.options.fps)
	}

	public render() {
		return (
			<canvas
				id="react-midiVisualizer-canvas"
				ref={this.setCanvasContext}
				height={this.props.height}
				width={this.props.width}
			/>
		)
	}
}
