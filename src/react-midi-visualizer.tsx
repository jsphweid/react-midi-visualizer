import * as React from 'react'
import { MIDI } from 'midiconvert'
import { ReactMidiVisualizerOptionsType } from './common/types'

export interface ReactMidiVisualizerProps {
	audioContext: AudioContext
	width: number
	height: number
	midiJson: MIDI
	options?: ReactMidiVisualizerOptionsType
}

export default class ReactMidiVisualizer extends React.Component<ReactMidiVisualizerProps> {
	canvasContext: CanvasRenderingContext2D

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
		window.requestAnimationFrame(this.animationStep.bind(this))
	}

	private setCanvasContext = (canvas: HTMLCanvasElement): void => {
		if (this.canvasContext) return null
		this.canvasContext = canvas.getContext('2d')
	}

	private animationStep = (): void => {
		setTimeout(() => {
			window.requestAnimationFrame(this.animationStep.bind(this))
		}, 1000 / this.props.options.fps)
	}

	public render() {
		return (
			<canvas
				id="react-midi-visualizer-canvas"
				ref={this.setCanvasContext}
				height={this.props.height}
				width={this.props.width}
			/>
		)
	}
}
