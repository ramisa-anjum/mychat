import React, { useState } from 'react';
import { getAuth, onAuthStateChanged,signOut  } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Leftside from './Leftside';
import Rightside from './Rightside';
import Middle from './Middle';
const Home = () => {
    
     const [email,setEmail]=useState(false)
     let [username,setUsername]=useState("")
     let [url,setUrl]=useState("")
     let [id,setId]=useState("")
     let [creationTime,setCreationTime]=useState("")
    let navigate = useNavigate();
    const auth = getAuth();
    onAuthStateChanged(auth,(user)=>{
        if (user) {
            //if(user.emailVerified){
              setEmail(true)
              setUsername(user.displayName)
              setUrl(user.photoURL)
              setCreationTime(user.metadata.creationTime)
              setId(user.uid)
            //}
           } else {
             navigate("/login",{state:"please login"})
           }
    });
   
  return (
    <>
     <div className='main'>
          <Leftside username={username} url={url} id={id}/>
          <Middle url={url} />
          <Rightside creationTime={creationTime}/>
          </div>
      {/* {email?
        
        <>
          <div className='main'>
          <Leftside username={username} url={url}/>
          <Middle />
          <Rightside creationTime={creationTime}/>
          </div>
        </>

        :
        <>
          <Button variant="dark">Please cheack your Email and varify it</Button>
       
        </>
      } */}
    </>
  );
};

export default Home;
