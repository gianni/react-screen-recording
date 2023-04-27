import React from "react";
import { RecorderProps, RecorderState } from "../types/RecorderProps";

class Recorder extends React.Component<RecorderProps, RecorderState> {

  canvasRef: React.RefObject<HTMLCanvasElement>
  modalRef: React.RefObject<HTMLDivElement>
  videoPreviewContainerRef: React.RefObject<HTMLDivElement>
  chunks: Blob[]
  frameRate: number
  ctx: CanvasRenderingContext2D | null | undefined
  captureElement: HTMLElement
  recordInterval: number | NodeJS.Timer | null
  mediaRecorder: MediaRecorder | null
  paintID: number

  constructor(props: RecorderProps) {

    super(props)
    this.state = {
      videoSize: '0',
      isRecording: false,
      isPlaying: false,
      hasRecorded: false,
      videoUrl: ''
    }

    this.canvasRef = React.createRef();
    this.modalRef = React.createRef();
    this.videoPreviewContainerRef = React.createRef();

    this.ctx = null
    this.chunks = []
    this.frameRate = 20
    this.captureElement = document.body
    this.recordInterval = null
    this.mediaRecorder = null
    this.paintID = 0

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.download = this.download.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.playAll = this.playAll.bind(this)
    this.rewindAll = this.rewindAll.bind(this)
    this.stopAll = this.stopAll.bind(this)
    this.addVideo = this.addVideo.bind(this)
    this.removeVideo = this.removeVideo.bind(this)

  }

  componentDidMount() {
    this.ctx = this.canvasRef.current?.getContext('2d', { willReadFrequently: true })
    this.captureElement = document.getElementById('room') || document.body
  }

  initMediaRecorder(stream: MediaStream) {
    let _this = this
    const mediaRecorder = new MediaRecorder(stream);

    // mediaRecorder events
    mediaRecorder.ondataavailable = function (e) {
      _this.chunks.push(e.data);
    }

    mediaRecorder.onstop = function (e) {
      let blob = new Blob(_this.chunks, { 'type': 'video/webm' })
      _this.setState({ videoSize: (blob.size / 1024).toFixed(2) })
      _this.setState({ videoUrl: URL.createObjectURL(blob) })
      _this.chunks = []
    }

    return mediaRecorder
  }

  recordAudio(videoElement: HTMLVideoElement) {
    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(videoElement)
    const stream_dest = ctx.createMediaStreamDestination()
    source.connect(stream_dest)
    return stream_dest.stream
  }

  paintVideo() {
    const paintCallback = () => {
      const videos = Array.from(document.querySelectorAll('#video')) as HTMLVideoElement[]

      const elementWidth = 200;
      const elementHeight = 127.5;
      const paddingX = 1;
      const paddingY = 1;

      const numElements = videos.length;
      const numColumns = Math.ceil(Math.sqrt(numElements));
      const numRows = Math.ceil(numElements / numColumns);

      this.canvasRef.current!.width = (elementWidth + paddingX) * numColumns + paddingX;
      this.canvasRef.current!.height = (elementHeight + paddingY) * numRows + paddingY;

      for (var i = 0; i < numElements; i++) {
        let elementX = (i % numColumns) * (elementWidth + paddingX) + paddingX;
        let elementY = Math.floor(i / numColumns) * (elementHeight + paddingY) + paddingY;

        this.ctx?.drawImage(videos[i], elementX, elementY, elementWidth, elementHeight);
      }

      this.paintID = requestAnimationFrame(paintCallback)
    }

    this.paintID = requestAnimationFrame(paintCallback)
  }

  recordVideos() {
    return this.canvasRef.current!.captureStream(this.frameRate)
  }

  startRecording() {

    const video = document.querySelectorAll('#video')[0] as HTMLVideoElement

    // get audio and video streams
    let audioStream = this.recordAudio(video)

    this.paintVideo()
    let videoStream = this.recordVideos()

    // mix streams video and audio
    let mixedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getAudioTracks()])

    this.mediaRecorder = this.initMediaRecorder(mixedStream)

    this.mediaRecorder.start()
    this.setState({
      isRecording: true,
      hasRecorded: false
    })
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
    if (document.getElementById('videoPreview')) {
      document.getElementById('videoPreview')?.remove()
    } else {
      const videoPreview = document.createElement('video')
      videoPreview.id = 'videoPreview'
      videoPreview.src = this.state.videoUrl
      videoPreview.controls = true
      this.videoPreviewContainerRef.current!.appendChild(videoPreview)
    }

    this.modalRef.current!.classList.toggle('open')
  }

  addVideo() {
    const video = document.createElement('video')
    const roomContainer = document.querySelector('#roomContainer')
    video.id = 'video'
    video.src = '/big-buck-bunny.webm'
    roomContainer?.appendChild(video)
    video.play()
  }

  removeVideo() {
    const lastVideo = document.querySelector('video:last-of-type');
    lastVideo?.remove()
  }

  playAll() {
    const videos = Array.from(document.querySelectorAll('#video')) as HTMLVideoElement[]
    const video1 = document.querySelectorAll('#video')[0] as HTMLVideoElement
    videos.forEach(video => {
      video.play()
    })

    //unmute video 1
    video1.muted = false
    this.setState({ isPlaying: true })
  }

  rewindAll() {
    const videos = Array.from(document.querySelectorAll('#video')) as HTMLVideoElement[]
    videos.forEach(video => {
      video.currentTime = 0
      video.play()
    })
    this.setState({ isPlaying: true })
  }

  stopAll() {
    const videos = Array.from(document.querySelectorAll('#video')) as HTMLVideoElement[]
    videos.forEach(video => {
      video.pause()
    })
    this.setState({ isPlaying: false })
  }

  getDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}-${month}-${day}`
  }

  stopRecording() {
    clearInterval(this.recordInterval!)
    this.mediaRecorder?.stop()
    cancelAnimationFrame(this.paintID)
    this.setState({
      isRecording: false,
      hasRecorded: true
    })
  }

  render() {
    return (
      <>
        <div className="pt-4">
          <div>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isPlaying ? 'bg-gray-200' : 'bg-cyan-200'}`} onClick={this.playAll}>PLAY ALL</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isPlaying ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.rewindAll}>RESTART ALL</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isPlaying ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.stopAll}>STOP ALL</button> |
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isRecording ? 'bg-red-600' : 'bg-cyan-200'}`} onClick={this.startRecording}>REC</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isRecording ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.stopRecording}>STOP REC</button> |
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.hasRecorded ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.toggleModal}>PREVIEW</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.hasRecorded ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.download}>DOWNLOAD</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isPlaying ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.addVideo}>ADD VIDEO</button>
            <button className={`bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2 ${this.state.isPlaying ? 'bg-cyan-200' : 'bg-gray-200'}`} onClick={this.removeVideo}>DELETE VIDEO</button>
          </div>
          <div className="p-2">
            Video size: {this.state.videoSize} Kb
          </div>
          <div>
            <canvas id="canvas" ref={this.canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>
        <div id="modal" ref={this.modalRef} className="absolute inset-0  w-full  justify-center">
          <div style={{ width: 1200 }} className="bg-black text-white p-16" ref={this.videoPreviewContainerRef}>
            <button className="bg-cyan-200 text-cyan-950 pr-2 pl-2 m-2" onClick={this.toggleModal}>CLOSE</button>
          </div>
        </div>
      </>
    )
  }
}

export default Recorder