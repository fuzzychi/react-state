import React from 'react';


function MainComponent({dispatch, handleAdd})
{
    return(
        <div>
            <br />
            <button onClick={() => dispatch({type: 'R_NAME'})}>CHANGE NAME</button>
            <button onClick={() => dispatch({type: 'INCREASE'})}>+</button>
            <button onClick={() => dispatch({type: 'DECREASE'})}>-</button>
        </div>
    )
}

export default MainComponent