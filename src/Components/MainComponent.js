import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { movies } from '../Movies';


function MainComponent({handleAddMovie})
{
    const [state, setState] = useState(
        {
            movies:[],
            loading:false,
            value: ''
    })
    
    const search = async val =>{
        setState((prevState)=>{return({...prevState, loading:true})})
        const response = await axios(
        `https://api.themoviedb.org/3/search/movie?query=${val}&language=en-US&api_key=766f9538cfe65a20e82986827e13778d`)
        const movies = await response.data.results.sort((a,b) =>{return b["vote_average"] - a["vote_average"]})
        setState((prevState)=>{return({...prevState, movies:movies, loading:false})
        })
    }
    const handleChange = event =>
    {       
        if(event.target.value)
        {
            search(event.target.value)
        }
        else{
            setState((prevState)=>{return({...prevState,movies:[]})
        })
        }
    }
   
    return(
        <div>
            <br></br>
            <label>Search: </label><input type="text" onChange={handleChange}></input>
            <hr></hr>
            <div style={{backgroundColor:"#dddd"}}>
            {state.movies.map(item => {
                if(item['vote_count'] > 100){
                return(<li style={{fontSize:(4+item["vote_average"]**1.3)}} onClick={()=>{handleAddMovie(item["title"],item["id"])}}><button>+</button> {item["title"]} - {item["vote_average"]}</li>
                )
                }
            })}
            </div>
        </div>
    )
}

export default MainComponent