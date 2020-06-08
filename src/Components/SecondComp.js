import React, {useState} from 'react';


function SecondComp({dispatch, handleAdd})
{
    const [inputField, setInputField] = useState('')
    const handleChange = (event) =>{
        setInputField(event.target.value)
    }
    return(
        <div>
            <br/>
             <input type="text" id="newField" value={inputField} onChange={handleChange}/>
             <button onClick={() => {dispatch({type: 'CUSTOM_ADD', payload:inputField})
                                    setInputField("")
             }}>Add</button>
        </div>
    )
}

export default SecondComp