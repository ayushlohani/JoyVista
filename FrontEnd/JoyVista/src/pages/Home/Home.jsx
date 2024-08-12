/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';

const Home = () => {
  const [user,setuser] = useState(null);
  const {data} = useFetch("/users/loggedin-user");
  useEffect(()=>{
    setuser(data);
  },[data]);
  
  return (
    <>{user && <div>Home</div>}{!user && <div>Please Login</div>}</>
  )
}

export default Home