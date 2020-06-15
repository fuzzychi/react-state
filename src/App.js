import React, {useReducer, useEffect} from 'react';
import './App.css';

import {UserContext} from './UserContext'
import { Route, Switch, BrowserRouter as Router, NavLink} from 'react-router-dom'
import MainComponent from './Components/MainComponent'
import SecondComp from './Components/SecondComp'
import { db } from './firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Rating from '@material-ui/lab/Rating';
import {DatePicker as DatePickerMUI} from '@material-ui/pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import MovieItem from './Components/MovieItem';


function App() {
  
  const notify = (msg) => {
    toast(msg,{position:toast.POSITION.TOP_RIGHT, autoClose:2000,})
  }

  const initialState = 
  { 
    movies : [],
    eventChange : true,
  }
  const [state, dispatch] = useReducer(reducer,initialState)

  useEffect(() => {
    const movieList= db.collection("movies").orderBy("dateWatched","desc");
    movieList.onSnapshot(snapshot => 
      {
        const list = [];
        snapshot.forEach(doc =>{
          list.push({
          id: doc.id,
          title:doc.data().title,
          rating:doc.data().rating,
          dateWatched:doc.data().dateWatched,
          dateAdded:doc.data().dateAdded
          })
          })
        dispatch({type:'SET_LIST', list:list})
      })
  },[]);

const handleAddMovie = (name,id) =>
{
  if(!state.movies.filter(movie => movie.title === name).length)
  {
    const today = new Date();
     db.collection("movies").add({
      id:id, 
      title:name,
      rating:"0",
      dateWatched:today,
      dateAdded:today,
    }).then(() =>
    { 
      notify(`${name} has been added`);
    })
  }
}
const removeMovie = (item) =>
{
  if(item){
    db.collection("movies").doc(item.id).delete().then(()=>{
      dispatch({type:'DELETE_MOVIE',item:item.id})
      notify(`${item.title} deleted`);
    })
  }
}
const handleChangeRating = (rating,id) => {
  if(rating && id)
  {
      db.collection("movies").doc(id).set({"rating":rating},{merge:true}).then(
        notify(`Rating changed`)
      )
  }
}
function reducer(prevState, action){
  switch(action.type)
  {
    case 'DELETE_MOVIE':
      return {...prevState,
            movies:(prevState.movies.filter(movie =>
              {
                if(movie.id !== action.item)
                  return movie
              }))}
    case 'SET_LIST':
      return {...prevState, movies:action.list}
    case 'ADD_DOP':
      return {...prevState, dop:[...prevState.dop, action.item]}
    case 'ADD_DIRECT':
      return {...prevState, directors:[...prevState.directors, action.item]}
    case 'ADD_MOVIE':
      return {...prevState, movies:[...prevState.movies, action.item]}
    default:
      return prevState;
  }
}   
const handleDateChange = (date, id) =>
{
  if(date && id)
  {
      db.collection("movies").doc(id).set({"dateWatched":date},{merge:true})
      notify("Date changed");
  }
}
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
             <SecondComp />
          </Route>
        </Switch>
      </Router>
      <ToastContainer />
      <h1>Watched Movies</h1>
      <div style={{display:'grid', 'grid-template-columns': '50px 200px 200px 200px 200px'}}>
      <div></div><div>Title</div><div>Rating</div><div>Date Seen</div><div>Date Entered</div>
      </div>    
      <TransitionGroup>
      {state.movies.map(movie => (
                  <CSSTransition classNames="item" timeout={1000} key={movie.id}>
                  <MovieItem item={movie}  
                  removeMovie={removeMovie} 
                  handleChangeRating={handleChangeRating} 
                  handleDateChange={handleDateChange}/>
                  </CSSTransition>
                  ))}
      </TransitionGroup>
      
      </UserContext.Provider>
      </div>
      )
}

export default App;


//{(watchedMovies.length > 0) ? watchedMovies : <p>(Empty)</p>}