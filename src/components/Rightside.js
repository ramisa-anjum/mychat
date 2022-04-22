import React, { useEffect, useState } from 'react'
import { Dropdown,ButtonGroup,Button,ListGroup,Modal,Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { getAuth,signOut ,updateProfile } from "firebase/auth";
import { getDatabase, ref, set,onValue,push,remove} from "firebase/database";
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch } from 'react-redux';

import moment from 'moment'
const Rightside = (props) => {
  const db = getDatabase();
  let [groupreq,setGroupreq] = useState([])
  let [groups,setGroups] = useState([])
  let dispatch=useDispatch()

  let [proimg,setProimg] = useState("")
  const auth = getAuth();

  const groupsRef = ref(db, 'groups/');

  useEffect(()=>{
    
    onValue(groupsRef, (snapshot) => {
      let grouparr=[]

    snapshot.forEach(group=>{
       
      let allgrp={
          ...group.val(),
          id: group.key
      }
       grouparr.push(allgrp)
      
      
    })
setGroups(grouparr)
}); 

  },[props])

  const reqRef = ref(db, 'sendreq/');
  
  useEffect(()=>{
      
    onValue(reqRef, (snapshot) => {
      let grpreqarr=[]
      snapshot.forEach(grpreq=>{
       
       grpreqarr.push(grpreq.val())
       
    })
    setGroupreq(grpreqarr)
    
});

 },[])
    let handleAccept = (id,id2,name,id3)=>{
      set(push(ref(db, 'groupmember/')), {
        id:id,
        grpkey:id2,
        sendername:name,
       senderid:id3
       });
    }


    
let handleSendRequest=(grpname,id,id2)=>{
  
  //console.log(auth.currentUser.uid,auth.currentUser.displayName)
  set(push(ref(db, 'sendreq/')), {
 
   sender:auth.currentUser.uid,
   sendername: auth.currentUser.displayName,
   groupname:grpname,
   adminid:id,
   grpkey:id2
  });
}

  return (
    <div className='rightside'>
    <h4>User Data</h4>
    <ListGroup>
    <ListGroup.Item className='listitem'>*{props.creationTime}</ListGroup.Item>
    <ListGroup.Item className='listitem'>*{moment(props.creationTime).fromNow()}</ListGroup.Item>
    </ListGroup>
    <h4>Group Request</h4>
    <ListGroup className='listgrp'>
        
        {groupreq.map(item=>(
          item.adminid == auth.currentUser.uid?
          <ListGroup.Item 
       className='user listitem'>{item.sendername} send request to join your {item.groupname} group<Button onClick={()=>handleAccept(item.adminid,item.grpkey,item.sendername,item.sender)} className="ms-5 btn-sm btn-dark">ACCEPT</Button></ListGroup.Item>
        :
        ""
        ))}
      </ListGroup> 

      <h4>All Groups</h4>
      <ListGroup className='listgrp'>
      
      {groups.map(item=>(
        item.adminid !== auth.currentUser.uid?
        <ListGroup.Item className='listitem'>{item.groupname} <Button onClick={()=>handleSendRequest(item.groupname,item.adminid,item.id)} className="ms-5 btn-sm btn-dark">send group request</Button>
       </ListGroup.Item>
        :
        ""
      ))}
          
      </ListGroup>
    </div>
  )
}

export default Rightside