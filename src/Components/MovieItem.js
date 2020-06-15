import React from 'react';

import Rating from '@material-ui/lab/Rating';
import {DatePicker as DatePickerMUI} from '@material-ui/pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function MovieItem({item, removeMovie, handleChangeRating, handleDateChange})
{
    return(<>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>  
        <div><button style={{width:"20px"}} onClick={() => removeMovie(item)}>x</button></div>
        <div>{item.title}</div>
        <div><Rating onChange={(event, newValue) => handleChangeRating(newValue,item.id)} value={item.rating} precision={0.5}/></div>
        <div>
          <DatePickerMUI
          value={item.dateWatched.toDate()}
          onChange={(date) => handleDateChange(date,item.id)}
          animateYearScrolling
          format="MM/dd/yyyy"
          showTodayButton="true"/>
        </div>
        <div>
          <DatePickerMUI
          value={item.dateAdded.toDate()}
          onChange={handleDateChange}
          animateYearScrolling
          format="MM/dd/yyyy"
          disabled="true"/>
        </div>
        </MuiPickersUtilsProvider>
    </>)
}

export default MovieItem