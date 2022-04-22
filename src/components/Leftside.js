import React, { useEffect, useState } from 'react'
import { Dropdown,ButtonGroup,Button,ListGroup,Modal,Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { getAuth,signOut ,updateProfile } from "firebase/auth";
import { getDatabase, ref, set,onValue,push,remove} from "firebase/database";
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch } from 'react-redux';

const Leftside = (props) => {
  const [show, setShow] = useState(false);
  const [groupshow, setGroupShow] = useState(false);
  const [inviteshow, setInviteShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleGroupClose = () => setGroupShow(false);
  const handleGroupShow = () => setGroupShow(true);

  
  const handleInviteClose = () => setInviteShow(false);
  const handleInviteShow = () => setInviteShow(true);

  let dispatch=useDispatch()
  const db = getDatabase();
    let navigate = useNavigate();
    let [users,setUsers]=useState([])
    let [activeuser,setActiveuser]=useState("")
    let [uploadImg,setUploadimg] = useState("")
    let [proimg,setProimg] = useState("")
    let [groupname,setGroupname] = useState("")
    let [groups,setGroups] = useState([])
    let [members,setMembers] = useState([])    


    const auth = getAuth();
    let handleLogOut = ()=>{
        signOut(auth).then(() => {
            navigate("/login",{state:"You are log out"})
          }).catch((error) => {
            console.log(error)
          });
    }
    

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

    let memberarr=[]
    const memberRef = ref(db, 'groupmember/');
    useEffect(()=>{
      
       onValue(memberRef, (snapshot) => {
         snapshot.forEach(user=>{
          
          memberarr.push(user.val())
          
       })
       
});
setMembers(memberarr)
    },[props])



    let userarr=[]
    const usersRef = ref(db, 'users/');
    useEffect(()=>{
       onValue(usersRef, (snapshot) => {
         snapshot.forEach(user=>{
           if(user.key !== props.id){
            let userinfo={
              ...user.val(),
              id:user.key
            }
          userarr.push(userinfo)
           }else{
             setProimg(user.val().img)
           }
       })   
       
    });
        setUsers(userarr)
        console.log(userarr)
    },[props])

    
    


    let handleUser=(id)=>{
      setActiveuser(id)
      dispatch({type:"ACTIVE_USER", payload:id})
    }

let handleGroupName=(e)=>{
setGroupname(e.target.value)
}
let handleCreateGroupname  =(e)=>{
    
  set(push(ref(db, 'groups/')), {
    groupname: groupname,
   adminid:auth.currentUser.uid,
   adminname: auth.currentUser.displayName,
   
  });
}  
let handleImg = (e)=>{
    setUploadimg(e.target.files[0])
}
let handleImgUpload=()=>{
  const storage = getStorage();
  const storageRef = refer(storage,`userprofile/${auth.currentUser.uid}/${uploadImg.name}`);
  const uploadTask = uploadBytesResumable(storageRef, uploadImg);
  uploadTask.on('state_changed', 
  (snapshot) => {
    
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
   
    
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      
      console.log('File available at', downloadURL);
      const db = getDatabase();
      set(ref(db, 'users/' + auth.currentUser.uid), {
        username: auth.currentUser.displayName,
        email: auth.currentUser.email,
        id:auth.currentUser.uid,
        img : downloadURL
      });
      setShow(false)
      updateProfile(auth.currentUser, {
        
        photoURL: downloadURL
      })
    });
  }
);

}

let handleSendInvitation=(id,name,grpname)=>{
  //console.log(id,name)
  //console.log(auth.currentUser.uid,auth.currentUser.displayName)
  set(push(ref(db, 'send/')), {
 
   sender:auth.currentUser.uid,
   sendername: auth.currentUser.displayName,
   receiver:id,
   receivername:name,
   groupname:grpname
  });
}

  return (
    <div className='leftside'>
    <img src={proimg} width="100"/><br/>
    <Dropdown as={ButtonGroup}>
        <Button variant="success">{props.username}</Button>

        <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />

        <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
            <Dropdown.Item onClick={handleShow}>change profile picture</Dropdown.Item>
            <Dropdown.Item onClick={handleGroupShow}>Create group</Dropdown.Item>

        </Dropdown.Menu>
    </Dropdown>
  


    <h2 className='mt-5 friends' >Group member</h2>
    <ListGroup className='listgrp'>
    {members.map((item)=>(
      <ListGroup.Item style={activeuser == item.id ? activecss:activecss2}
       className='user' onClick={()=>handleUser(item.id)}>{item.name}</ListGroup.Item>
    ))} 
    </ListGroup>

    <h3>group name</h3>

    <ListGroup>
    {groups.map((item,index)=>(
      item.adminid == auth.currentUser.uid ?
      
      <ListGroup.Item key={index}>{item.groupname}{item.id} <Button onClick={handleInviteShow} variant="info" >send invitation</Button></ListGroup.Item> 

      :
      ""
    ))}
    </ListGroup>
    
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control onChange={handleImg} type="file"/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleImgUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={groupshow} onHide={handleGroupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body><Form.Control onChange={handleGroupName} placeholder="Group Name" type="text"/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGroupClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateGroupname}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={inviteshow} onHide={handleInviteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite your Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
        <ListGroup className='listgrp'>
         
         {users.map((useritem, index)=>(

            <ListGroup.Item>
                {useritem.username}
                <Button className="ms-5 btn-sm btn-warning">Send</Button>
            </ListGroup.Item>
         ))}
       
      
      
        </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInviteClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

      
     
    </div>
  )
}
let activecss={
  color:"red"
}
let activecss2={
  color:"black"
}

export default Leftside