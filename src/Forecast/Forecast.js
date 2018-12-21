import React from 'react';

const forecast = (props) => {
    return (
        <div className="displayForecast">
        <div className="cityNameContainter">{props.displayCity}</div>
        <div className="currentConditionContainter">Current Condition</div>
        <div className="currentTempContainer">{props.displayCityCurrentTemp}°</div>
            <div className="forecastBottomSection">
                <div className="logoContainer"></div>
                <div className="indexContainer"></div>
                <div onPointerDown={props.backToList} className="listContainer"></div>
            </div>
        </div>
    )
}

export default forecast;