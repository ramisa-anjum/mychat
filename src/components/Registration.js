import React from 'react';
import { Form,Container,Button,Alert,Badge,Spinner } from 'react-bootstrap';
import {useState} from 'react';
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification,updateProfile,signInWithPopup,GoogleAuthProvider} from "firebase/auth";
import firebaseConfig from '../firebaseconfig';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
const Registration = () => {
    const db = getDatabase();
    let [username,setUsername]=useState("")
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [cpassword,setCpassword]=useState("")
    let [err,setErr]=useState("")
    let[loading,setLoading]=useState(false)
    let navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    let handleUserChange= (e) =>{
        setUsername(e.target.value)
    }
    let handleEmailChange= (e) =>{
        setEmail(e.target.value)
    }
    let handlePasswordChange= (e) =>{
        setPassword(e.target.value)
    }
    let handleCpasswordChange= (e) =>{
        setCpassword(e.target.value)
    }
    let handleGoogleSignin= (e)=>{
        e.preventDefault()
        const auth = getAuth();
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                navigate("/")
                console.log(user)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }



    let handleSubmit=(e)=>{
        e.preventDefault()
        if(!password || !cpassword){
            setErr("please fill all the field")
        }else if(password.length < 8 || cpassword.length < 8){
            setErr("password must be grater then 8 charecter")
        }else if(password !== cpassword){
            setErr("password not matched")
        }else if(!username){
            setErr("username is missing")
        }else if(!email ){
            setErr("email is missing")
        }
        else{
         setLoading(true)   
         const auth = getAuth();
         createUserWithEmailAndPassword(auth, email, password).then((user)=>{
           
            updateProfile(auth.currentUser, {
                displayName: username, 
                photoURL: "https://cdn1.vectorstock.com/i/1000x1000/80/60/avatar-icon-on-black-round-flat-symbol-vector-21698060.jpg"
              }).then(()=>{
                set(ref(db, 'users/'+ user.user.uid), {
                    username: username,
                    email: email,
                    img:user.user.photoURL
                    
                  });
              }).then(() => {
                setUsername("")
                setEmail("")
                setPassword("")
                setCpassword("")
                setErr("")
                setLoading(false)
                navigate("/login",{state:"account created successfully. Please login to continue"})
                const email = user.user;
                sendEmailVerification(email)
              }).catch((error) => {
                const errorCode = error.code;
                if(errorCode.includes("auth/email-already-in-use")){
                    setErr("Email already in use")
                }
              });
              
                        
         }).catch(error=>{
           
                const errorCode = error.code;
                if(errorCode.includes("auth/email-already-in-use")){
                    setErr("Email already in use")
                }
              
         })
        }
    }
  return (
      
      <Container>
            <Alert className="mt-4 mb-4" variant='success'>
            <h5 className="text-center">Registration form for My Chat</h5>
            </Alert>
          <Form>
                <Form.Group className="mb-3" value={username}>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control style={err.includes("username")? errmsg : errmsg2} onChange={handleUserChange} type="text" placeholder="Enter your user name" />
                </Form.Group>
                <Form.Group className="mb-3" value={email}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control style={err.includes("email")? errmsg : errmsg2} onChange={handleEmailChange} type="email" placeholder="Enter your E-mail" />
                </Form.Group>
                <Form.Group className="mb-3"value={password}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control style={err.includes("must")? errmsg : errmsg2} onChange={handlePasswordChange} type="password" placeholder="password" />
                </Form.Group>
                <Form.Group className="mb-3" value={cpassword}>
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control style={err.includes("not")? errmsg : errmsg2} onChange={handleCpasswordChange} type="password" placeholder="Confirm password" />
                </Form.Group>
  {err?
    <Alert className="mt-4 mb-4" variant='danger'>
       {err}
  </Alert>
  :
  ""}
  
                <Button onClick={handleSubmit} variant="info" type="submit">
                    {loading?
                        <Spinner animation="border" role="status">
                               <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        "sign up"
                        }
                    
                </Button>
                <Button onClick={handleGoogleSignin} className='ms-4' variant="success">Signin with Google</Button>
                <div className='text-center mt-3'>
                <Form.Text id="passwordHelpBlock" muted>
               Already have an account.  <Badge bg="dark"><Link className='text-white' to="/login">Login</Link></Badge>

               </Form.Text>
                </div>

    </Form>
      </Container>
  )
};
let errmsg={
    border:"1px solid red"
}
let errmsg2={
    borderSize:"1px"
}
export default Registration;
