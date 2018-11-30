import React from 'react';

const unit = (props) => {

    

    return (

        <div className="Unit">
          <button onClick={props.click}> Farenheit</button>
          <button onClick={props.click}> Celsius</button>
        </div>
    )
};

export default unit;