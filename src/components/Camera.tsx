import React from "react";

type CameraProps = {}
type CameraState = {}

class Camera extends React.Component<CameraProps, CameraState> {

  constructor(props: CameraProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <video id='video' playsInline preload='none' controls muted poster="/poster-big-buck-bunny.png">
        <source id='mp4' src="/big-buck-bunny.webm" type='video/webm' />
        <p>Your user agent does not support the HTML5 Video element.</p>
      </video>
    )
  }
}

export default Camera