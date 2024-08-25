/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import Loader from '../../components/Loader/Loader';
import { fetchfromapi, sendDataToapi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../Landing-Page/LandingPage';
import Profile from '../../components/Profile/Profile';
import { useDispatch } from 'react-redux';
import { Useraction } from '../../store/Slices/userSlice';

const Home = () => {
  const navigate = useNavigate();
  const [user,setuser] = useState(null);
  const {data} = useFetch("/users/loggedin-user");
  useEffect(()=>{
    setuser(data);
  },[data]);
  
  const [loading,setloading] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    setloading(true);
    sendDataToapi("/users/logout").then((res)=>{
      setloading(false);
      console.log(res);
      window.location.reload();
    }).catch((err)=>{
      setloading(false);
      console.log(err);
    })
  }
  useEffect(()=>{
    if(user){
      dispatch(Useraction.loginUser(user.data));
    }
  },[dispatch,user])

  return (
    <>
    {user && 
    <div className='Home'>
      <div className="prof"><Profile key={user?.data?.username} user = {user.data} handleLogout = {handleLogout}/></div>
      <div className="content"></div>
      <div className="sidebar"></div>
    </div>}
    {loading && <Loader />}
    {!user && <LandingPage />}
    </>
  )
}

export default Home