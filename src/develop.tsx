import * as React from "react";
import * as ReactDOM from "react-dom";

import { sample1, sample2 } from "./sample";
import ReactMidiVisualizer from "./react-midi-visualizer";

function App() {
  const [ac, setAc] = React.useState<AudioContext | null>(null);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [notes, setNotes] = React.useState(sample1);

  function startAudioContext() {
    const audioContext = new AudioContext();
    setAc(audioContext);
  }

  function start() {
    if (ac) {
      setStartTime(ac.currentTime);
    }
  }

  function handleChange() {
    setNotes(notes === sample1 ? sample2 : sample1);
  }

  return (
    <>
      <button onClick={startAudioContext} disabled={!!ac}>
        boot audioContext
      </button>
      <button onClick={start} disabled={!ac}>
        start
      </button>
      <button onClick={handleChange} disabled={!ac}>
        change
      </button>
      <br />
      {ac ? (
        <ReactMidiVisualizer
          audioContext={ac}
          height={500}
          width={800}
          startTime={startTime}
          notes={notes}
          options={{
            fps: 60,
            keyboardHeight: 200,
            pixelsPerSecondFall: 200
          }}
        />
      ) : null}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
