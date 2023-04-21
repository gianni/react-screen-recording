import React from "react";

type RainbowProps = {}
type RainbowState = {
  currentColor: string
}

class Rainbow extends React.Component<RainbowProps, RainbowState> {

    colors: string[] = ['red','yellow','green','blue']

    constructor(props: RainbowProps) {
        super(props);
        this.state = {currentColor:'grey'};
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