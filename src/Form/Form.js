import React from 'react';


const form = (props) => {

    return (

        <div className="Form">
            <div className="inputContainer" >
                <input id="city" type="text" name="city" placeholder="City or Zipcode" />

                <input id="country" type="text" name="country" placeholder="Country" />
                <span onClick={props.hideSearchScreen}>Cancel</span>
                <div className="clearInputBtn" onClick={props.clearInput}> blah</div>
            </div>
            

            <input onClick={props.click} type="submit" value="Submit" />

        </div>
    )
};

export default form;