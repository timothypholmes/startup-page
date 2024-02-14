import React from "react";

import { readSettings } from './readSettings';
const settings = readSettings();


class Windy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.link,
    }
  }

  setLink(lat, long) {
    var link = `https://embed.windy.com/embed.html?type=map&lat=${String(lat)}&lon=${String(long)}`;
    this.setState({ link: link })
  }

  componentDidMount() {
    if (settings.latitude) {
      console.log(settings.latitude)
      this.setLink(settings.latitude, settings.longitude)
    } else if(navigator.geolocation) { // get location
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLink(position.coords.latitude, position.coords.longitude)
      })
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  render() {
    return(
      <>
        <div class="sticky rounded-xl overflow-hidden h-80 border-0 dark:border-4 dark:border-off-white2"> 
            <iframe class="overflow-hidden flex bg-blue5 xs:hidden rounded-xl" width="505" height="320"
              src={this.state.link}>
            </iframe>
        </div>
      </>
    );
  }
}

export default Windy