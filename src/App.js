import "./App.css";
import Camera from "./components/Camera";
import Recorder from "./components/Recorder";

function App() {
  return (
    <div className="bg-gray-800 text-cyan-200 h-screen">
      <div className="p-4">
        <div className="text-lg p-2">MEETING CONFERENCE</div>
        <hr />
        <div id="room" className="bg-gray-700 p-8">
          <div className="flex-wrap grid grid-cols-4 gap-4 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(video =>
              <Camera key={video} />
            )}
          </div>
        </div>
        <div>
          <Recorder />
        </div>
      </div>
    </div>
  );
}

export default App;
