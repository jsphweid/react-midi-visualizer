import * as React from "react";
import { Note } from "midiconvert";

import { ReactMidiVisualizerOptionsType } from "./types";
import Scene from "./scene";

export interface ReactMidiVisualizerProps {
  audioContext: AudioContext;
  width: number;
  height: number;
  startTime: number;
  notes: Note[];
  options?: ReactMidiVisualizerOptionsType;
}

export default class ReactMidiVisualizer extends React.Component<
  ReactMidiVisualizerProps
> {
  canvasContext: CanvasRenderingContext2D;
  scene: Scene;

  public static defaultProps: Partial<ReactMidiVisualizerProps> = {
    options: { fps: 60 }
  };

  constructor(props: ReactMidiVisualizerProps) {
    super(props);
  }

  componentDidMount() {
    this.remakeScene();
    window.requestAnimationFrame(this.animationStep.bind(this));
  }

  componentDidUpdate(prevProps: ReactMidiVisualizerProps) {
    if (prevProps.notes !== this.props.notes) {
      this.remakeScene();
    }
  }

  private remakeScene() {
    this.scene = new Scene(this.canvasContext, this.props);
  }

  private setCanvasContext = (canvas: HTMLCanvasElement): void => {
    if (this.canvasContext) return null;
    this.canvasContext = canvas.getContext("2d");
  };

  private animationStep = (): void => {
    setTimeout(() => {
      window.requestAnimationFrame(this.animationStep.bind(this));
      const timeSinceStart = this.props.startTime
        ? this.props.audioContext.currentTime - this.props.startTime
        : null;
      this.scene.drawFrame(timeSinceStart);
    }, 1000 / this.props.options.fps);
  };

  public render() {
    return (
      <canvas
        id="react-midiVisualizer-canvas"
        ref={this.setCanvasContext}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }
}
