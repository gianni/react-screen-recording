import React from "react";

class Rainbow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {currentColor:'grey'};
        this.colors = ['red','yellow','green','blue']
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({currentColor : this.colors[Math.floor(Math.random()*this.colors.length)]})
        }, 500);
    }

    render() {
      return (
        <div style={{backgroundColor: this.state.currentColor, height:200, width:200}}></div>
      )
    }
}

export default Rainbow