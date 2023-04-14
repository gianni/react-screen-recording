import React from "react";
import html2canvas from "html2canvas";


class Recorder extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        videoSize: 0,
        isRecording: false
      }

      this.startRecording = this.startRecording.bind(this)
      this.stopRecording = this.stopRecording.bind(this)
      this.download = this.download.bind(this)
      this.loop = this.loop.bind(this)

      this.chunks = []
      this.videoUrl = ""
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d', {willReadFrequently: true})
    this.captureElement = document.getElementById('room')
}

  startRecording() {
    
    this.canvas.width = this.captureElement.clientWidth
    this.canvas.height = this.captureElement.clientHeight

    this.recordInterval = setInterval(this.loop, 1000 / 30)

    let videoStream = this.canvas.captureStream(1000 / 30)
    this.mediaRecorder = new MediaRecorder(videoStream);

    let _this = this

    this.mediaRecorder.ondataavailable = function(e) {
      _this.chunks.push(e.data);
    }
    
    this.mediaRecorder.onstop = function(e) {
      let blob = new Blob(_this.chunks, { 'type' : 'video/webm' })
      _this.setState({videoSize : blob.size})
      _this.chunks = []
      _this.videoURL = URL.createObjectURL(blob)
    }

    this.mediaRecorder.start()
    this.setState({isRecording : true})
  }

  download() {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = this.videoURL;
    a.download = `video-${this.getDate()}.webm`;
    document.body.appendChild(a);
    a.click();
  }

  getDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}-${month}-${day}`
  }


  loop() {
    html2canvas(this.captureElement).then(screenshot => {
      this.ctx.drawImage(screenshot, 0, 0)
    });
  }

  stopRecording() {
    clearInterval(this.recordInterval)
    this.mediaRecorder.stop()
    this.setState({isRecording : false})
  }

  render() {
    return (
      <div class="pt-4">
        <div>
          <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isRecording ? 'bg-red-600' : 'bg-cyan-200'}`} onClick={this.startRecording}>RECORD</button>
          <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.stopRecording}>STOP</button>
          <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.download}>DOWNLOAD</button>
        </div>
        <div class="p-2">
          Video size: {this.state.videoSize / 1024} Kb
        </div>
        <div>
          <canvas id="canvas" style={{display:'none'}}></canvas>
        </div>
      </div>
    )
  }
}

export default Recorder