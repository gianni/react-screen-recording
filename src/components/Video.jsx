import React from "react";
import html2canvas from "html2canvas";
import Rainbow from "./Rainbow";

class Video extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.loop = this.loop.bind(this)

        this.chunks = []
        this.videoUrl = ""
    }

    componentDidMount() {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.captureElement = document.getElementById('capture')
        this.replay = document.getElementById('replay')
    }

    startRecording() {

      this.canvas.width = this.captureElement.clientWidth
      this.canvas.height = this.captureElement.clientHeight

      this.recordInterval = setInterval(this.loop, 1000 / 30)

      let videoStream = this.canvas.captureStream(1000 / 30)
      this.mediaRecorder = new MediaRecorder(videoStream);

      let _this = this

      this.mediaRecorder.ondataavailable = function(e) {
        console.log(e.data)
        _this.chunks.push(e.data);
      }
      
      this.mediaRecorder.onstop = function(e) {
        let blob = new Blob(_this.chunks, { 'type' : 'video/webm' })
        _this.chunks = []
        const videoURL = URL.createObjectURL(blob)
        console.log('blob', blob)
        console.log('blob url', videoURL)
        _this.replay.setAttribute("src",videoURL)

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = videoURL;
        a.download = 'recordedVideo';
        document.body.appendChild(a);
        a.click();

      }

      this.mediaRecorder.start()
    }

    loop() {
      html2canvas(this.captureElement).then(canvas => {
        this.ctx.drawImage(canvas, 0, 0)
      });
    }

    stopRecording() {
      clearInterval(this.recordInterval)
      this.mediaRecorder.stop()
    }

    render() {
      return (
        <div>
          <div>
            <div id="capture" style={{backgroundColor:'#000000'}}>
              <textarea>Scrivi qui ...</textarea>
              <Rainbow></Rainbow>
            </div>
            <canvas id="canvas" style={{display:'none'}}></canvas>
          </div>
          <div>
            <button onClick={this.startRecording}>START</button>
            <button onClick={this.stopRecording}>STOP</button>
          </div>
          <div>
            Video Registrato <br/>
            <video id="replay" playsInline controls loop muted>
                <source src="" type="video/webm"/>
                <p>This browser does not support the video element.</p>
            </video>
          </div>
        </div>
      )
    }
}

export default Video