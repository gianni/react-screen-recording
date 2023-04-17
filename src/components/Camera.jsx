import React from "react";

class Video extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <video id='video' playsInline preload='none' controls width="400" muted poster="/poster.png">
        <source id='mp4' src="/trailer.mp4" type='video/mp4' />
        <p>Your user agent does not support the HTML5 Video element.</p>
      </video>
    )
  }
}

export default Video