import "./App.css";
import Camera from "./components/Camera";
import Recorder from "./components/Recorder";

function getVideos() {
  const videosNumber = Math.floor(Math.random() * 11) + 2;
  const videos = []
  for(let i = 0; i < videosNumber; i++) {
    videos.push(i)
  }
  return videos
}


function App() {
  return (
    <div className="bg-gray-800 text-cyan-200 h-screen">
      <div className="p-4">
        <div className="text-lg p-2">MEETING CONFERENCE</div>
        <hr />
        <div id="room" className="bg-gray-700 p-8">
          <div className="flex-wrap grid grid-cols-4 gap-4 justify-items-center">
            {getVideos().map(video =>
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
