import React from "react";
import Video from "./Video"


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stoptRecording.bind(this);
      }

    startRecording() {
        console.log('start rec')
    }

    stoptRecording() {
        console.log('stop rec')
    }

    render() {
      return (
        <div>
          <div>
            <Video></Video>
          </div>
          <div>
              <button onClick={this.startRecording}>START</button>
              <button onClick={this.stopRecording}>STOP</button>
          </div>
        </div>
      )
    }
}

export default Dashboard