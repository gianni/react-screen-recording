import React from "react";

class Video extends React.Component {

  constructor(props) {
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

export default Video