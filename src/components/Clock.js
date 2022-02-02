import React from "react";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.updateDate = this.updateDate.bind(this);
      

    this.state = {
      date: new Date().toLocaleTimeString(),
      days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      date: new Date().toLocaleTimeString(),
      time: new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})/, "$1$3"),
      //h: new Date().toLocaleTimeString().replace(/([\d])/, "$1$3"),
      //m: new Date().toLocaleTimeString().replace(/(:[\d]{2})/, "$1$3"),
      //s: new Date().toLocaleTimeString().replace(/(:[\d]{2})/, "$1$3"),
      period: new Date().toLocaleTimeString().replace(/(.*)/, "$1$3"),
    }
    this.interval = setInterval(this.updateDate, 1000);
  }
    
  componentWillUnmount() {
    clearInterval(this.interval);
  }
    
  updateDate() {
    this.setState({
      date: new Date().toLocaleTimeString(),
      time: new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})/, "$1$3"),
      //h: new Date().toLocaleTimeString().replace(/([\d])/, "$1$3"),
      //m: new Date().toLocaleTimeString().replace(/(:[\d]{2})/, "$1$3"),
      //s: new Date().toLocaleTimeString().replace(/(:[\d]{2})/, "$1$3"),
      period: new Date().toLocaleTimeString().replace(/(.*)/, "$1$3"),
    });
  }
    
  render() {
    return(
      <div class="border-dashed border-2 border-[#00000] text-white rounded-md col-span-1 shrink-0 h-36 w-36">{this.state.date}</div>
    );
  }
}

export default Clock