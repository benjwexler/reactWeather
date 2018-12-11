import React from 'react';

const unit = (props) => {

    

    return (

        <div className="Unit">
          <div className={props.currentUnit === "C" ? 'currentUnit' : null} onClick={props.click}> °C</div>&nbsp;/&nbsp;
          <div className={props.currentUnit === "F" ? 'currentUnit' : null} onClick={props.click}> °F</div>
        </div>
    )
};

export default unit;