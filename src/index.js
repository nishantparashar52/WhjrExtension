import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import Order from './containers/Order';
import Auth from './containers/Auth';
import { getCookies } from './helper';
// import SearchBar from './components/SearchBar';
import './style.css';
/*global chrome*/
class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      loader: false,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    // const socket = socketIOClient('http://192.168.4.86:9090');
    // socket.on("connect", () => {
    //   socket.emit('storeClientInfo', { customId: 'mayank' });
    // });
    // socket.on("FromAPI", data => console.log(data));
    // socket.on('flashActive', data => {
    //   chrome.notifications.create('', {
    //       type: "basic",
    //       title: "Flash Sale",
    //       message: "Flash Sale Active",
    //       iconUrl: "/icon.png"
        
    //   }, function(data) {
    //     console.log(data);
    //   });
      // showNotification('', {
      //   type: "basic",
      //   title: "Flash Sale",
      //   message: "Flash Sale Active",
      //   iconUrl: "/icon.png"
      // }, function (data) {
      //   // alert(data);
      // });
    // });
    let langCode;
    try {
      langCode = navigator.language.split('-')[0];
    } catch (ex) {
      langCode = "en";
    }
    axios.get(`/localization/lang_${langCode}.json`)
      .then(res => {
        this.setState({ localizationConfig: res.data });
      });
    this.sessionToken = '';
    this.setState({ loader: true });
    getCookies("http://www.lenskart.com", "frontend", id => {
      this.sessionToken = id || 'ddfc5abb-9d7a-42af-9856-db64857e24cb'; // id;
      axios.get('https://api.lenskart.com/v2/sessions/validate', { headers: { 'x-api-client': 'desktop', 'x-session-token': id } })
      .then(res => {
        if (res.data.result && res.data.result.attrs) {
          const { isLoggedIn } = res.data.result.attrs;
          this.setState({ isLoggedIn, loader: false });
        }
      }).catch(() => {
        this.setState({ isLoggedIn: false, loader: false });
      });
    });
  }

  render() {
    const { localizationConfig, isLoggedIn, loader } = this.state;
    return (
      <div className="main-container">
          <a id="lensLogo" data-click-action="Link" data-target="LensLogo" class="lens-logo" target="_blank" href="https://www.lenskart.com/?tag=lens-chrome-ext">
            <img src="https://static.lenskart.com/media/desktop/img/site-images/logo.svg" alt="lenskart" title="lenskart" />
          </a>
        {/* <SearchBar /> */}
        {loader && <div className="loader">
          <img src="https://static.lenskart.com/media/desktop/img/loader.gif" alt="ldr" />
        </div>}
        {isLoggedIn ?
          <Order localizationConfig={localizationConfig} sessionToken={this.sessionToken} /> :
          <Auth />
        }
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
