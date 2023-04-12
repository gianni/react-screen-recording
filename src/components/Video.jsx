import React from "react";

class Video extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.record = this.record.bind(this);
    }

    componentDidMount() {
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.video = document.getElementById('video')
      this.canvas.width=480
      this.canvas.height=270
    }

    startRecording() {
      console.log('start rec')
      this.recordInterval = setInterval(this.record, 1000 / 30)
    }

    record() {
      if (!this.video.paused && !this.video.ended) {
        this.ctx.drawImage(this.video, 0, 0)
      }
    }

    stopRecording() {
      console.log('stop rec')
      clearInterval(this.recordInterval)
    }

    render() {
      return (
        <div>
          <div>
            <video id='video' playsInline controls loop mute="true">
              <source src='https://webrtc.github.io/samples/src/video/chrome.webm' type='video/webm' />
              <source src='https://webrtc.github.io/samplessrc/video/chrome.mp4' type='video/mp4' />
              <p>This browser does not support the video element.</p>
            </video>
            <canvas id="canvas"></canvas>
          </div>
          <div>
            <button onClick={this.startRecording}>START</button>
            <button onClick={this.stopRecording}>STOP</button>
          </div>
        </div>
      )
    }
}

export default Video