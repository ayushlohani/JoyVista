/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from 'react-redux';

const Profile = ({user}) => {
  return (
    <div className="profile">
        <div className="profilepic"><img src={user.profilepic}></img></div>
        <div className="name">{user.username}</div>
    </div>
  )
}

export default Profile