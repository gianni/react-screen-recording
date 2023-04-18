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

    this.canvasRef = React.createRef();
    this.modalRef = React.createRef();

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.download = this.download.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.playAll = this.playAll.bind(this)
    this.stopAll = this.stopAll.bind(this)

    this.chunks = []
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d', { willReadFrequently: true })
    this.captureElement = document.getElementById('room')
  }

  recordAudio(videoElement) {
    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(videoElement)
    const stream_dest = ctx.createMediaStreamDestination()
    source.connect(stream_dest)
    return stream_dest.stream
  }

  recordScreen(screenElement) {
    const frameRate = 30
    this.canvasRef.current.width = screenElement.clientWidth
    this.canvasRef.current.height = screenElement.clientHeight

    this.recordInterval = setInterval(() => {
      html2canvas(this.captureElement).then(screenshot => {
        this.ctx.drawImage(screenshot, 0, 0)
      });
    }, frameRate)

    return this.canvasRef.current.captureStream(frameRate)
  }

  startRecording() {
    
    let _this = this
    const video = document.querySelectorAll('#video')[0]

    // get audio and video streams
    let audioStream = this.recordAudio(video)
    let videoStream = this.recordScreen(this.captureElement)

    // mix streams video and audio
    let mixedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getAudioTracks()])
    this.mediaRecorder = new MediaRecorder(mixedStream);

    // mediaRecorder events
    this.mediaRecorder.ondataavailable = function (e) {
      _this.chunks.push(e.data);
    }

    this.mediaRecorder.onstop = function (e) {
      let blob = new Blob(_this.chunks, { 'type': 'video/webm' })
      _this.setState({ videoSize: (blob.size / 1024).toFixed(2)  })
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
    this.modalRef.current.classList.toggle('open')
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
            Video size: {this.state.videoSize} Kb
          </div>
          <div>
            <canvas id="canvas" ref={this.canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>
        <div id="modal" ref={this.modalRef} className="absolute inset-0  w-full  justify-center">
          <div style={{ width: 1200 }} className="bg-black text-white p-16">
            <video id="videoPreview" src={this.state.videoUrl} controls width="100%" />
            <button className="bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2" onClick={this.toggleModal}>CLOSE</button>
          </div>
        </div>
      </>
    )
  }
}

export default Recorder