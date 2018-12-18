import React from 'react';

const forecast = (props) => {
    return (
        <div className="displayForecast">
            <div className="forecastBottomSection">
                <div className="logoContainer"></div>
                <div className="indexContainer"></div>
                <div onPointerDown={props.backToList} className="listContainer"></div>
            </div>
        </div>
    )
}

export default forecast;