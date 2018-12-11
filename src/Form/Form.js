import React from 'react';

const form = (props) => {

    return (

        <div className="Form">
            <input id="city" type="text" name="city" placeholder="City or Zipcode" />
            <input id="country" type="text" name="country" placeholder="Country"/>
            <input onClick={props.click} type="submit" value="Submit"/>
            <div>{props.nonsense}</div>
        </div>
    )
};

export default form;