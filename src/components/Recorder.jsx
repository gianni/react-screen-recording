import React from "react";
import html2canvas from "html2canvas";


class Recorder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      videoSize: 0,
      isRecording: false,
      videoUrl: ""
    }

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.download = this.download.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.playAll = this.playAll.bind(this)
    this.stopAll = this.stopAll.bind(this)
    this.loop = this.loop.bind(this)

    this.chunks = []
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })
    this.captureElement = document.getElementById('room')
  }

  startRecording() {

    this.canvas.width = this.captureElement.clientWidth
    this.canvas.height = this.captureElement.clientHeight

    this.recordInterval = setInterval(this.loop, 1000 / 30)

    let videoStream = this.canvas.captureStream(1000 / 30)
    this.mediaRecorder = new MediaRecorder(videoStream);

    let _this = this

    this.mediaRecorder.ondataavailable = function (e) {
      _this.chunks.push(e.data);
    }

    this.mediaRecorder.onstop = function (e) {
      let blob = new Blob(_this.chunks, { 'type': 'video/webm' })
      _this.setState({ videoSize: blob.size })
      _this.setState({ videoUrl: URL.createObjectURL(blob) })
      _this.chunks = []
    }

    this.mediaRecorder.start()
    this.setState({ isRecording: true })
  }

  download() {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = this.state.videoUrl;
    a.download = `video-${this.getDate()}.webm`;
    document.body.appendChild(a);
    a.click();
  }

  toggleModal() {
    let modal = document.getElementById('modal')
    modal.classList.toggle('open')
  }

  playAll() {
    let videos = document.querySelectorAll('#video')
    videos.forEach(video => {
      video.play()
    })
  }

  stopAll() {
    let videos = document.querySelectorAll('#video')
    videos.forEach(video => {
      video.pause()
    })
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
    this.setState({ isRecording: false })
  }

  render() {
    return (
      <>
        <div className="pt-4">
          <div>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.playAll}>PLAY ALL</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.stopAll}>STOP ALL</button> |
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isRecording ? 'bg-red-600' : 'bg-cyan-200'}`} onClick={this.startRecording}>REC</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.stopRecording}>STOP REC</button> |
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.toggleModal}>PREVIEW</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2`} onClick={this.download}>DOWNLOAD</button>

          </div>
          <div className="p-2">
            Video size: {this.state.videoSize / 1024} Kb
          </div>
          <div>
            <canvas id="canvas" style={{ display: 'none' }}></canvas>
          </div>
        </div>
        <div id="modal" className="absolute inset-0  w-full  justify-center">
          <div style={{ width: 1200 }} className="bg-black text-white p-16">
            <video id="video" src={this.state.videoUrl} controls width="100%" />
            <button className="bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2" onClick={this.toggleModal}>CLOSE</button>
          </div>
        </div>
      </>
    )
  }
}

export default Recorder