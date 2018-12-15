import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const form = (props) => {

    return (

        <div className="Form">
            <div className="inputContainer" >
                
                <input id="city" type="text" name="city" placeholder="City or Zipcode" />

                <input id="country" type="text" name="country" placeholder="Country" />
                <span id="cancel" onClick={props.hideSearchScreen}>Cancel</span>
                <div className="clearInputBtn" onClick={props.clearInput}> blah</div>
            </div>

            {/* <i className="fa-2x fas fa-search-plus fontAwesome"></i> */}

           <div id="searchIcon"> 
        
        
           <FontAwesomeIcon className="blah" icon="search" />

           </div>
            

            <input onClick={props.click} type="submit" value="Submit" />

        </div>
    )
};

export default form;