import React from 'react';

const city = (props) => {

    return (

        <div onClick={props.click} className="City">
            <div className="cityContainerLeft">
                <div className="cityTime"> 12:00 PM</div>
                <div className="cityName">{props.city}</div>
             </div>
             <div className="cityContainerRight">
                <p>{props.temp}°</p>
             </div>

        </div>
    )
};

export default city;