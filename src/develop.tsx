import * as React from "react";
import * as ReactDOM from "react-dom";

import data from "./sample";
import ReactMidiVisualizer from "./react-midi-visualizer";

function App() {
  const [ac, setAc] = React.useState<AudioContext | null>(null);
  const [startTime, setStartTime] = React.useState<number | null>(null);

  function startAudioContext() {
    const audioContext = new AudioContext();
    setAc(audioContext);
  }

  function start() {
    if (ac) {
      setStartTime(ac.currentTime);
    }
  }

  return (
    <>
      <button onClick={startAudioContext} disabled={!!ac}>
        boot audioContext
      </button>
      <button onClick={start} disabled={!ac}>
        start
      </button>
      <br />
      {ac && startTime ? (
        <ReactMidiVisualizer
          audioContext={ac}
          height={500}
          width={800}
          startTime={startTime}
          notes={data[0].midiJson.tracks[0].notes}
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
