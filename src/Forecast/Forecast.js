import React from 'react';

const forecast = (props) => {
    return (
        <div className="displayForecast">
        <div className="cityNameContainter">{props.displayCity}</div>
        <div className="currentConditionContainter">Current Condition</div>
        <div className="currentTempContainer">{props.displayCityCurrentTemp}°</div>
        <div className="dayOfWeekAndHighLowContainer">
            <div className="dayOfWeek">{props.displayCityGmtOffset}</div>
            <div className="highLowContainer">
                <div className="minOrMaxTemp">{props.displayCityMaxTemp}</div>
                <div className="minOrMaxTemp">{props.displayCityMinTemp}</div>
            </div>
        </div>
            <div className="forecastBottomSection">
                <div className="logoContainer"></div>
                <div className="indexContainer"></div>
                <div onPointerDown={props.backToList} className="listContainer"></div>
            </div>
        </div>
    )
}

export default forecast;