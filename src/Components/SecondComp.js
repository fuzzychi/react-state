import React, {useState} from 'react';


function SecondComp({clearList})
{
    const [inputField, setInputField] = useState('')
    const handleChange = (event) =>{
        setInputField(event.target.value)
    }
    return(
        <div>
            <br/>
            <button>Clear List</button>
        </div>
    )
}

export default SecondComp