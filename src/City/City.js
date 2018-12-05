import React from 'react';

const city = (props) => {

    return (

        <div onClick={props.click} className="City">
          <p>Name: {props.city} | {props.temp}°{props.unit}</p>
        </div>
    )
};

export default city;