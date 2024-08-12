/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import Loader from '../../components/Loader/Loader';
import { fetchfromapi, sendDataToapi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user,setuser] = useState(null);
  const {data} = useFetch("/users/loggedin-user");
  useEffect(()=>{
    setuser(data);
  },[data]);
  
  const [loading,setloading] = useState(false);
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

  return (
    <>{user && <div>Home <button onClick={handleLogout}>Logout</button>{loading && 
    <Loader />}</div>}{!user && <div>Please Login <button onClick={()=>{navigate("/login")}}>Login</button></div>}</>
  )
}

export default Home