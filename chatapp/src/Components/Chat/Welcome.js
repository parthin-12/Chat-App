import React from 'react'
import "./Welcome.css"
import Robot from "./../../Images/robot.gif"

const Welcome = ({userName}) => {
  return (
    <div className='welcomeContainer'>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  )
}

export default Welcome