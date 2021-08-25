import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    if(imageUrl.length > 0){
        return (
            <div className='center ma3'>
                <div className='mt2'>
                    <canvas width='500px' id='inputImage'></canvas>
                </div>
            </div>   
             
        );
    } else {
        return(
            <div></div>
        );
    }
}

export default FaceRecognition;