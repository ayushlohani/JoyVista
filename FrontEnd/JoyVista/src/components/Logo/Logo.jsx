/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'
import "./Logo.scss"
const Logo = () => {
  return (
    <Link className="link-logo" to={"/"}><img src="./logo.png" /></Link>
  )
}

export default Logo