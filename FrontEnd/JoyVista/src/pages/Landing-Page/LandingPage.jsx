/* eslint-disable no-unused-vars */
import React from 'react'
import "./LandingPage.scss"
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo/Logo'

const LandingPage = () => {
  return (
    <div className="landing-page">
        <div className="header">
            <div className="right"><Logo /></div>
            <div className="left">
                <Link className='link hi' to={"/login"}>Log In</Link>
                <Link className='link' to = "/register">Register</Link>
            </div>
        </div>
        <div className="main">
            <img src='../../../public/Home.png'></img>
        </div>
    </div>
  )
}

export default LandingPage