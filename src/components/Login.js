import React from 'react';
import { Form,Container,Button,Alert,Badge,Spinner,Modal } from 'react-bootstrap';
import {useState} from 'react';
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import firebaseConfig from '../firebaseconfig';
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const state= useLocation();
    const provider = new GoogleAuthProvider();

    const [show, setShow] = useState(false);
    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let [err,setErr]=useState("")
    let [passerr,setpassErr]=useState("")
    let [resetPass,setResetpass]=useState("")
    let[loading,setLoading]=useState(false)
    let navigate = useNavigate();
    
    const auth = getAuth();


    const notify=()=> toast(state.state);
    if(state.state){
        notify()
        state.state =""
    }
    let handleEmailChange= (e) =>{
        setEmail(e.target.value)
    }
    let handlePasswordChange= (e) =>{
        setPassword(e.target.value)
    }
  
    let handleSubmit=(e)=>{
        e.preventDefault()
        if(!email || !password){
            setErr("please fill all the field")
        }else if(password.length < 8){
            setErr("password must be grater then 8 charecter")
        }
        else{
            setLoading(true) 
                signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    
                    const user = userCredential.user;
                    setLoading(false)
                    navigate("/")
                })
                .catch((error) => {
                    console.log(error.code)
                   
                });
        }
    }
    let handlePasswordReset= (e)=>{
        setResetpass(e.target.value)
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


    const handleCloseButton=()=>{
        setShow(false)
    }
    const handleClose = () => {
        if(resetPass){
            sendPasswordResetEmail(auth, resetPass)
        .then(() => {
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
        }else{
            setpassErr("Please enter an email")
        }
    }
    const handleShow = () => setShow(true);
  
  return (
    <Container>
    <ToastContainer/>
    <Alert className="mt-4 mb-4" variant='success'>
    <h5 className="text-center">Login form for MyChat</h5>
    </Alert>
  <Form>
        <Form.Group className="mb-3" value={email}>
            <Form.Label>Email</Form.Label>
            <Form.Control style={err.includes("email")? errmsg : errmsg2} onChange={handleEmailChange} type="email" placeholder="Enter your E-mail" />
        </Form.Group>
        <Form.Group className="mb-3"value={password}>
            <Form.Label>Password</Form.Label>
            <Form.Control style={err.includes("must")? errmsg : errmsg2} onChange={handlePasswordChange} type="password" placeholder="password" />
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
                        "sign in"
                        }
        </Button>
        <Button variant="danger" className='ms-4' onClick={handleShow}>
        Forgot password
      </Button>
        <div className='text-center mt-3'>
        <Form.Text id="passwordHelpBlock" muted>
       Don't have an account.  <Badge bg="dark"><Link className='text-white' to="/registration">Registration</Link></Badge>

       </Form.Text>
        </div>
        <Button onClick={handleGoogleSignin} variant="success">Signin with Google</Button>

        

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control onChange={handlePasswordReset} type="email" placeholder="write your mail" />
        </Form.Group>
        </Form>
        {passerr?
            <Alert className="mt-4 mb-4" variant='danger'>
                {passerr}
            </Alert>
            :
            ""
            }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseButton}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
          Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
</Form>
</Container>
  );
};
let errmsg={
    border:"1px solid red"
}
let errmsg2={
    borderSize:"1px"
}
export default Login;
