import React from 'react'

export default function Timer (props) {
    const time = props.timeInMilliseconds

      // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000);

    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100);

    // Milliseconds calculation
    const milliseconds = time % 100;

    return (<p className="stopwatch-time">{props.best?'Best Time-':'Time-'} 
    {minutes.toString().padStart(2, "0")}:
    {seconds.toString().padStart(2, "0")}:
    {milliseconds.toString().padStart(2, "0")}
  </p>)
}