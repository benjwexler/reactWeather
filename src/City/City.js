import React, { Component } from 'react';

const city = (props) => {

    return (

        <div id={`city${props.id}`} className="CityParentContainer"
            // onMouseDown={props.lock}
            // onTouchStart={props.lock}
            onPointerDown={props.lock}
            // onPointerUp={props.move}
            onMouseUp={props.move}
            onTouchEnd={props.move}
            onMouseMove={props.drag}
            onTouchMove={props.drag}
            onWheel={props.preventScroll}
            
          
        >
            <div className="City">
                <div className="cityContainerLeft">
                    <div className="cityTime"> {props.time}</div>
                    <div className="cityName">{props.city}</div>

                </div>
                <div className="cityContainerRight">
                    <p>{props.temp}°</p>
                </div>
            </div>
            <div onClick={props.deleteCity} onTouchStart={props.deleteCity} className="deleteBtn">
                Delete
                </div>
        </div>
    )
};

export default city;