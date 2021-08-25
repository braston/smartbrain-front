import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import 'tachyons';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

 const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
 };

class App extends Component {

  constructor () {
    super();
    this.state = initialState;
  }
  
loadUser = (data) => {
  this.setState({
    user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  });
}

calculateFaceLocation = (data) => {
 
    const faceArray = data.outputs[0].data.regions;
    const canvas = document.getElementById('inputImage');
    const canvasContext = canvas.getContext("2d");
    const width = Number(canvas.width);
  
    let image = new Image();
    image.src = this.state.imageUrl;

     const drawFace = (face, width, height) => {
        // Calculate Upper Left Corner Coordinates
        const upperX = face.left_col*width;
        const upperY = face.top_row*height;
  
        //Calculate Face Width and Height, Scale to Canvas Dimensions:
        const faceWidth = Math.round((face.right_col - face.left_col)*width);
        const faceHeight = Math.round((face.bottom_row - face.top_row)*height);

        // Draw rectangle
        canvasContext.beginPath();
        canvasContext.lineWidth='6';
        canvasContext.strokeStyle='red';
        canvasContext.rect(upperX, upperY, faceWidth, faceHeight);
        canvasContext.stroke();
    }
    
    image.onload = () => {
      let scaleFactor = image.height/image.width;
      canvas.height = canvas.width * scaleFactor;
      canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height );

      faceArray.forEach( face => {
        drawFace(face.region_info.bounding_box, width, canvas.height);
      })
    };
  }

  onInputChange = (event) => {
      this.setState({
        input: event.target.value,   
      });
  }

  onImageDetect = (event) => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://fierce-badlands-89362.herokuapp.com/imageurl',
            {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  input: this.state.input,                 
            })
    })
    .then( response => response.json())
    .then(response => {
          if(response){
            fetch('https://fierce-badlands-89362.herokuapp.com/image',
            {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id,                 
            })
          }) 
          .then(response => response.json())
          .then(data => {
            this.setState(Object.assign(this.state.user, {entries: data}));
          })
        .catch(err => console.log(err));
        }    
          this.calculateFaceLocation(response)})         
    }

    onRouteChange = (route) => {
      if (route === 'signout'){
        this.setState(initialState);
      }  
      else if (route === 'home'){
        this.setState({isSignedIn: true});
      }
      this.setState({ route: route});
    }
  
  render () {
    const { isSignedIn, imageUrl, route } = this.state;
    return (
      <div className="App">
        <Particles className='particles'/>
        < Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
            ?  <div>
                  < Logo />
                  < Rank name={this.state.user.name} entries={this.state.user.entries} />
                  < ImageLinkForm onInputChange={this.onInputChange} onImageDetect={this.onImageDetect}/>
                  < FaceRecognition imageUrl={imageUrl}/>
                </div>
            : ( route === 'signin'
                  ? < Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                  : < Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              )       
        }   
      </div>
    );
  }
}

export default App;
