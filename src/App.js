import React, {useReducer, useState, useEffect} from 'react';
import './App.css';
import {UserContext} from './UserContext'
import { Route, Switch, BrowserRouter as Router, NavLink} from 'react-router-dom'
import MainComponent from './Components/MainComponent'
import SecondComp from './Components/SecondComp'
import axios from 'axios';
import { db } from './firebase';

function App() {
  const initialState = 
  { 
    movies : [],
    directors: [],
    dop:[],
  }
  const [state, dispatch] = useReducer(reducer,initialState)

  useEffect(() => {
    const movieList= db.collection("movies");
    movieList.onSnapshot(snapshot => 
      {
        const list = [];
        snapshot.forEach(doc =>{
          list.push(doc.data().title)
          })
        dispatch({type:'SET_LIST', list:list})
      })
  }, []);
  

const getDirector = async movieID =>
{ 
  const response = await axios(
    `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=766f9538cfe65a20e82986827e13778d`)
  const crew = await response.data.crew;
  const director = crew.filter(item => item["department"]==="Directing" && item["job"] === "Director")
  return director[0].name;
}

const getDOP = async movieID =>
{ 
  const response = await axios(
    `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=766f9538cfe65a20e82986827e13778d`)
  const crew = await response.data.crew;
  const dop = crew.filter(item => item["job"] === "Director of Photography")
  return dop[0].name
}

const handleAddMovie = (name,id) =>
{
  if(!state.movies.includes(name))
  {
    dispatch({type:'ADD_MOVIE', item:name})
    db.collection("movies").add({id:id, title:name})
    getDirector(id).then((data)=>{
        dispatch({type:'ADD_DIRECT', item:data})
    })
  /*  getDOP(id).then((data)=>{
      dispatch({type:'ADD_DOP', item:data})
  })*/
  }
}

const clearList = () =>
{
  
}

function reducer(prevState, action){
  switch(action.type)
  {
    case 'SET_LIST':
      return {...prevState, movies:action.list}
    case 'ADD_DOP':
      return {...prevState, dop:[...prevState.dop, action.item]}
    case 'ADD_DIRECT':
      return {...prevState, directors:[...prevState.directors, action.item]}
    case 'ADD_MOVIE':
      return {...prevState, movies:[...prevState.movies, action.item]}
    case 'CUSTOM_ADD':
      return {...prevState, skills:[...prevState.skills, action.payload]}
    case 'ADD_SKILL':
        return {...prevState, skills:[...prevState.skills, action.skill]};
    case 'REMOVE_SKILL':
        return {...prevState, 
              skills:(prevState.skills.filter((skill)=>{
                if(skill !== action.item)
                  return skill;
              }))
              };
    default:
      return prevState;
  }
}   
  
 const watchedMovies = state.movies.map((item)=>{
   return(<li style={{fontSize:"12pt"}}>{item}</li>)
 })
 const directors = state.directors.map((item)=>{
  return(<li>{item}</li>)
})
const dops = state.dop.map((item)=>{
  return(<li>{item}</li>)
})

  return (
      <div style={{padding:"25px"}}>
      <UserContext.Provider>
      <Router>
        <NavLink exact to="/" activeStyle={{fontWeight: "bold", fontSize:"16pt"}}>Find A Movie</NavLink> | 
        <NavLink to="/2" activeStyle={{fontWeight: "bold", fontSize:"16pt"}}> Control 2</NavLink> |
        <Switch>
          <Route exact path="/">
              <MainComponent handleAddMovie={handleAddMovie} />
          </Route>
          <Route path="/2">
             <SecondComp clearList={clearList}/>
          </Route>
        </Switch>
      </Router>
      <h1>Watched Movies</h1>
      <div style={{display:'grid', 'grid-template-columns': '300px 300px 300px 200px 200px'}}>
        <div>
        <p style={{'textDecoration':'underline'}}>Title</p>
        {(watchedMovies.length > 0) ? watchedMovies : <p>(Empty)</p>}
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Personal Rating</p>
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Director of Photography</p>
        {(dops.length > 0) ? dops : <p>(Empty)</p>}
        </div>
        <div>
        </div>
        <div>
        </div>
        </div>
      </UserContext.Provider>
      </div>
      )
}

export default App;
