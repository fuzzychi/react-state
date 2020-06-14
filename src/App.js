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

function App() {

  const initialState = 
  { 
    movies : [],
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
  }, []);

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
      //dispatch({type:'ADD_MOVIE', item:name})
    })
  }
}
const removeMovie = (item) =>
{
    db.collection("movies").doc(item.id).delete().then(()=>{
      dispatch({type:'DELETE_MOVIE',item:item.id})
    })
}
const onDateChange = (date,id) =>{
  if(date && id)
  {
      db.collection("movies").doc(id).set({"dateWatched":date},{merge:true})
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

 const watchedMovies = state.movies.map((item)=>{
   return(
        <>
        <button style={{width:"20px"}} onClick={() => removeMovie(item)}>x</button>
        <div>{item.title}</div>
        <div><Rating value={item.rating} precision={0.5}/></div>
        <div><DatePicker selected={item.dateWatched.toDate()} dateFormat="MMMM d, yyyy" onChange={(date)=> {onDateChange(date,item.id)}} /></div>
        </>)
 })

 console.log(new Date())
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
      <h1>Watched Movies</h1>
      <div style={{display:'grid', 'grid-template-columns': '400px 300px 300px 200px 200px'}}>
      <div style={{display:'grid', 'grid-template-columns': '30px 300px 250px 300px'}}>
      <div></div><div>Title</div><div>Rating</div><div>Date Seen</div>
        {(watchedMovies.length > 0) ? watchedMovies : <p>(Empty)</p>}
        </div>
        <div>
        </div>
        <div>
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
