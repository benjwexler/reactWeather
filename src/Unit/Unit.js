import React from 'react';

const unit = (props) => {

    

    return (

        <div className="Unit">
          <div onClick={props.click}> °C</div>&nbsp;/&nbsp;
          <div onClick={props.click}> °F</div>
        </div>
    )
};

export default unit;