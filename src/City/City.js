import React from 'react';

const city = (props) => {

    return (

        <div className="CityParentContainer"> 

        <div id={`city${props.id}`} className="City">
            <div className="cityContainerLeft">
                <div className="cityTime"> {props.time}</div>
                <div className="cityName">{props.city}</div>
             </div>
             <div className="cityContainerRight">
                <p>{props.temp}°</p>
             </div>

        </div>

        <div onClick={props.click} className="deleteBtn">
            Delete
        </div>

        

        </div>
    )
};

export default city;