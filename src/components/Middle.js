import React,{useEffect, useState} from 'react'
import { InputGroup,FormControl,Button,Card,Modal,Form } from 'react-bootstrap';
import { FileArrowUp,SendFill, TrashFill } from 'react-bootstrap-icons';
import { getDatabase, ref, set,onValue,push,remove} from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
const Middle = () => {
  const data = useSelector((id)=>id.activeuserid.id)
  let [text,setText]=useState("")
  let [msg,setMsg]=useState([])
  
  let [one,setOne]=useState(true)
  
  const auth = getAuth()


  

  let handleMsg=()=>{
     
     const db = getDatabase();

    set(push(ref(db, 'messages/')), {
      msg: text,
     sender:auth.currentUser.uid,
     receiver:data,
     username: auth.currentUser.displayName,
    img:auth.currentUser.photoURL
     
    });

    setOne(!one)
    
  }
  useEffect(()=>{
    const db = getDatabase();
    const starCountRef = ref(db, 'messages/');
    onValue(starCountRef, (snapshot) => {
      const msgarr=[]
       snapshot.forEach(msg=>{
         msgarr.push(msg.val())
         
       })
       setMsg(msgarr)
});
  },[one])

  
  let handleText =(e)=>{
    setText(e.target.value)
  }
 
 


  return (
    <div className='middle'>
        <div className="msgbox">
        {msg.map(item=>(
          item.receiver == data || item.sender == data ?
          <Card style={item.sender == auth.currentUser.uid?msgalign:msgalign2}>
        <Card.Body>
          <Card.Title> <img className='imgcard' src={item.img} width="40"/>{item.username}</Card.Title>
          <Card.Text>
           {item.msg}
          </Card.Text>
          
        </Card.Body>
      </Card>
      :
      ""
        ))}
          
        
        </div>
         <InputGroup>
        <FormControl
        onChange={handleText}
        placeholder="Write your message"
        aria-label="Recipient's username with two button addons"
        />
        <Button className='btn-dark' onClick={handleMsg}>
        <SendFill/>
        </Button>
        <Button className='btn-dark'>
        <FileArrowUp/>
        </Button>
       </InputGroup>

       

      
    </div>
  )
}
let msgalign={
  width:'300px',
  marginRight:'auto',
  marginTop:'10px'
}
let msgalign2={
  width:'300px',
  marginLeft:'auto',
  marginTop:'10px'
}
export default Middle