import React, {useReducer, useState} from 'react';
import './App.css';
import {AppContext} from './appContext'
import { Route, Switch, BrowserRouter as Router, NavLink} from 'react-router-dom'
import MainComponent from './Components/MainComponent'
import SecondComp from './Components/SecondComp'
import {availableOptions} from './Options'

function App() {


const rn = require('random-number');
const newName = () =>
  {
    const names = ['Benny','Ronnie','Alex','Paul','Dane','Madeon'];
    const gen = rn.generator({
      min:  0
    , max:  (names.length - 1)
    , integer: true
    })
    return names[gen()];
  }
const handleAdd = (item) =>{
    dispatch({type: 'ADD_SKILL', skill:item});
    setAvailableSkills(availableSkills.filter((i)=>{
      return !(item === i);
    }));
}
const handleDelete = (item) =>
{
  setAvailableSkills([...availableSkills,item]);
  dispatch({type: 'REMOVE_SKILL', item:item})
}
const initialState = 
  {
    name: newName(),
    age: 20,
    skills : [],
    }
function reducer(prevState, action){
  switch(action.type)
  {
    case 'CUSTOM_ADD':
      return {...prevState, skills:[...prevState.skills, action.payload]}
    case 'INCREASE':
      return {...prevState, age: prevState.age+1};
    case 'DECREASE' :
      return {...prevState, age: prevState.age-1};
    case 'R_NAME':
      return {...prevState, name:newName()};
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
  const [state, dispatch] = useReducer(reducer, initialState)

  const [availableSkills, setAvailableSkills] = 
  useState(['Acrobat','Photographer','Cinematographer','Musician','Doctor','Engineer','Dancer','Stripper','Actor']);
  const [bodyOptions, setBodyOptions] = 
  useState(['A','B','C','D','E'])
  const [generatorOption, setGeneratorOption] = 
  useState(['A','B','C','D','E'])



  const choosenSkillsList = state.skills.map((item)=>{
    return(<li style={{fontSize:"14pt",fontWeight:"bold"}}>
      <button onClick={()=>{handleDelete(item)}}>x</button>{item}
      </li>)});
  const availableSkillsList = availableSkills.map((item)=>{
      return (<li>
        <button onClick={()=>{handleAdd(item)}}>+</button> {item}
        </li>)});
  const bodyOptionsList = bodyOptions.map((item)=>{
    return (<li>
      <button onClick={()=>{handleAdd(item)}}>+</button> {item}
      </li>)});

  
  
  return (
      <div style={{padding:"25px"}}>
      <AppContext.Provider>
      <Router>
        <NavLink exact to="/" activeStyle={{fontWeight: "bold", fontSize:"16pt"}}>Control 1</NavLink> | 
        <NavLink to="/2" activeStyle={{fontWeight: "bold", fontSize:"16pt"}}> Control 2</NavLink> |
        <Switch>
          <Route exact path="/">
              <MainComponent dispatch={dispatch} handleAdd={handleAdd} />
          </Route>
          <Route path="/2">
              <SecondComp dispatch={dispatch} handleAdd={handleAdd}/>
          </Route>
        </Switch>
      </Router>
      <h1>{state.name}</h1>
      <p>Age:{state.age}</p>
      <div style={{display:'grid', 'grid-template-columns': '200px 200px 200px 200px 200px'}}>
        <div>
        <p style={{'textDecoration':'underline'}}>Chosen Skills:</p>
          {(choosenSkillsList.length > 0) ? choosenSkillsList : <p>(Empty)</p>}
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Available Skills: </p>
          {(availableSkillsList.length > 0) ? availableSkillsList : <p>(Empty)</p>}
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Available Skills: </p>
          {(bodyOptionsList.length > 0) ? bodyOptionsList : <p>(Empty)</p>}
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Available Skills: </p>
          {(availableSkillsList.length > 0) ? availableSkillsList : <p>(Empty)</p>}
        </div>
        <div>
        <p style={{'textDecoration':'underline'}}>Available Skills: </p>
          {(availableSkillsList.length > 0) ? availableSkillsList : <p>(Empty)</p>}
        </div>
        </div>
      </AppContext.Provider>
      </div>
      )
}

export default App;
