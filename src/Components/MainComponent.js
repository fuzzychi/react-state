import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { movies } from '../Movies';
import Autosuggest from 'react-autosuggest';

function MainComponent({handleAddMovie})
{
    const [state, setState] = useState(
        {
            suggestedMovies:[],
            value: '',
            selected: false,
            selectedID:'',
            selectedTitle:'',
            selectedYear: '',
            overview:'',
            poster_path:'',
    })
    const search = async val =>{
        const response = await axios(
        `https://api.themoviedb.org/3/search/movie?query=${val}&language=en-US&api_key=766f9538cfe65a20e82986827e13778d`)
        const movies = await response.data.results.sort((a,b) =>{return b["vote_average"] - a["vote_average"]})
        return movies;
    }
    const movieDetail = async val => {
        const response = await axios(
            `https://api.themoviedb.org/3/movie/${val}?api_key=766f9538cfe65a20e82986827e13778d`)
            const movies = await response.data.results.sort((a,b) =>{return b["vote_average"] - a["vote_average"]})
            return movies;
    }
    const onChange = (event, {newValue}) =>{       
        setState((prevState) => {return ({...prevState, value: newValue})})
    }
    const getSuggestionValue = (suggestion) =>{
        return suggestion.title;
    }
    const renderSuggestion = (suggestion) => {
        if(suggestion.release_date && suggestion.title){
        return(<span>{suggestion.title} ({suggestion.release_date.substr(0,4)})</span>)
        }
    }
    const onSuggestionsFetchRequested = ({value}) => {
        search(value).then(resp => 
            setState((prevState) => {return ({...prevState, suggestedMovies:resp})})
        )
    }
    const onSuggestionsClearRequested = () => {
        setState((prevState) => {return ({...prevState, suggestedMovies:[]})})
    }
    const onSuggestionSelected = (event, {suggestion}) => {
        setState((prevState) => {return ({...prevState, 
            selected:true, 
            selectedID:suggestion.id,
            selectedYear:suggestion.release_date.substr(0,4), 
            selectedTitle:suggestion.title,
            overview:suggestion.overview,
            poster_path:suggestion.poster_path,
        })})
        console.log(suggestion)
    }
    const {value, suggestedMovies, selected,selectedID,selectedTitle,overview,selectedYear,poster_path} = state;
    const inputProps = {
        placeholder: 'Type here...',
        value,
        onChange: onChange
    };
    return(
        <div>
            <br></br>
            <Autosuggest 
                suggestions={suggestedMovies}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={onSuggestionSelected}
            />
            <h1>{selectedTitle} - {selectedYear}</h1>
            <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="poster" style={{width:"150px"}} />
            <p style={{width:"400px"}}>{overview}</p>
            <button disabled={!selected} onClick={()=> {handleAddMovie(selectedTitle, selectedID)}}>Add movie</button>
            <hr></hr>
        </div>
    )
}

export default MainComponent