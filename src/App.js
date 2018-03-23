import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// Require the client

import Clarifai from 'clarifai';

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
 apiKey: 'a6ce27301ad64150926093861f9c9fe7'
});


const particlesParams = {
  particles:{
    number:{
      value: 30,
      density:{
        enable: true,
        value_area: 600
    }
    }
  }
};

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onRouteChange = (route) => {
    if( route === 'signout' ){
      this.setState({isSignedIn: false});
    } else if( route === 'home' ){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})
  }

  calculateFaceLocation = (response) => {
    const clarifaiFaces = response.outputs[0].data.regions[0].region_info.bounding_box;
    console.log('calculateFaceLocation', clarifaiFaces);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    console.log('image', image);

    console.log('left_col', clarifaiFaces.left_col * width);
    const boxLocation = {
      leftCol   : clarifaiFaces.left_col * width,
      topRow    : clarifaiFaces.top_row * height,
      rightCol  : width - clarifaiFaces.right_col * width,
      bottomRow : height -  clarifaiFaces.bottom_row * height
    };

    console.log('boxLocation', boxLocation);
    return boxLocation;
  }

  displayFaceBox = (box) => {
    // console.log('displayFaceBox', box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    // console.log('button', this.state.input);
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then( response => {
        // do something with response
        // console.log(response);
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
     .catch( err => {
        // there was an error
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.isSignedIn} />
      <Logo />
      { this.state.route === 'home'
        ? <div>
            <Rank />
          </div>
        : ( this.state.route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
        )
      }
      <Particles className='particles' params={particlesParams} />
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} 
      />
      <FaceRecognition 
        imageUrl={this.state.imageUrl} 
        box={this.state.box}
      />

      </div>
         );
  }
}

export default App;
