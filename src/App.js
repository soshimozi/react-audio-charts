import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import WebAudioKnob from './components/WebAudioKnob';

import Routes from './Routes';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Audio Diagrams</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        <WebAudioKnob 
                      max='20' 
                      min='1' 
                      units='Hz'
                      step='.25'
                      digits='1'
                      src={require('./images/LittlePhatty.png')}
                      sprites='100'
                      height='64'
                      value='8'
                      width='64'
                      diameter='64'>
        </WebAudioKnob>
        <Routes />
      </div>
    );
  }
}

export default App;
