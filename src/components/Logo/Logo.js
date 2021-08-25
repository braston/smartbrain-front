import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import logo from './logo.png';

const Logo = () => {
    return(
        <div>
            <Tilt className='Tilt br3 shadow-2' style={{ height: '5em', width: '5em'}}>
                <img className='pt2' src={logo} alt='placeholder'></img>
            </Tilt>
        </div>

   
    );
}

export default Logo;
