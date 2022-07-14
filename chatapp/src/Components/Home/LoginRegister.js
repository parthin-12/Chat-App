import React, { Fragment, useEffect } from 'react'
import { useState} from 'react'
import "./LoginRegister.css"
import {Link, useNavigate} from "react-router-dom"
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockCloseIcon from "@material-ui/icons/Lock";
import FaceIcon from "@material-ui/icons/Face";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Profile from "./../../Images/profile1.png"
import { loginUser, registerUser } from '../../Redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CLEAR_ERRORS } from '../../Redux/Constants/userConstants';
import Loader from '../Loader/loader';

const LoginRegister = () => {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(Profile);

    const {error,isAuth,loading}=useSelector((state)=>(state.user));

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [sendUser, setSendUser] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    });


    useEffect(() => {
      if(error){
        toast.error(error);
        dispatch({type:CLEAR_ERRORS});
      }

      if(isAuth){
        navigate("/chat");
      }

    }, [error,isAuth])
    

    const {name,email,password,confirmPassword}=sendUser;

    const loginSubmit=(e)=>{
        e.preventDefault();
        dispatch(loginUser({"email":loginEmail,"password":loginPassword}));
    }

    const registerDataChange = (e)=>{

        if(e.target.name==='avatar'){
            const reader =new  FileReader();

            reader.onload = () => {
                if(reader.readyState===2){
                    setAvatar(reader.result);
                    setAvatarPreview(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
        else{
            setSendUser({...sendUser,[e.target.name]:e.target.value})
        }

    };

    const registerSubmit=(e)=>{
        e.preventDefault();

        const myform = new FormData();
        myform.set("name",name);
        myform.set("email",email);
        myform.set("password",password);
        myform.set("confirmPassword",confirmPassword);
        myform.set("avatar",avatar);

        dispatch(registerUser(myform));
    }



  return (
    <Fragment>
    {loading===false?
        <div className="loginRegisterContainer">
            <div className="loginBox">
                <form className='loginForm' onSubmit={loginSubmit}>
                    <h1>LOGIN</h1>
                    <div className="loginEmail">
                        <MailOutlineIcon />
                        <input 
                        type="email"
                        placeholder='Email'
                        required
                        value={loginEmail}
                        name="email"
                        onChange={(e)=>setLoginEmail(e.currentTarget.value)} 
                        />
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon />
                        <input 
                        type="password"
                        placeholder='Password'
                        required
                        value={loginPassword}
                        name="password"
                        onChange={(e)=>setLoginPassword(e.currentTarget.value)} 
                        />
                    </div>
                    <Link to="/password/forget">Forget Password?</Link>
                    <input type="submit" value="Login" className='loginBtn'/>
                </form>
            </div>
            <div className='borderClass'>
                <div className='borderDraw'></div>
                <div className='circle'>OR</div>
                <div className='borderDraw'></div>
            </div>
            <div className="registerBox">
            <form className='registerForm' onSubmit={registerSubmit} encType="multipart/form-data">
                <h1>REGISTER</h1>
                <div id='proflieImage'>
                    <img src={avatarPreview} alt="Avatar Preview"/>
                    <input type="file" name="avatar" accept='image/*' onChange={registerDataChange} id="uploadBtn"/>
                </div>
                <div className="registerName">
                        <FaceIcon />
                        <input 
                        type="text"
                        placeholder='Name'
                        required
                        value={name}
                        name="name"
                        onChange={registerDataChange} 
                        />
                    </div>
                    <div className="registerEmail">
                        <MailOutlineIcon />
                        <input 
                        type="email"
                        placeholder='Email'
                        required
                        value={email}
                        name="email"
                        onChange={registerDataChange} 
                        />
                    </div>
                    <div className="registerPassword">
                        <LockOpenIcon />
                        <input 
                        type="password"
                        placeholder='Password'
                        required
                        value={password}
                        name="password"
                        onChange={registerDataChange} 
                        />
                    </div>
                    <div className="registerConfirmPassword">
                        <LockCloseIcon />
                        <input 
                        type="password"
                        placeholder='Confirm Password'
                        required
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={registerDataChange} 
                        />
                    </div>
                    <input type="submit" value="Register" className='registerBtn' /> 
                </form>
            </div>
        </div>
    :
    <Loader/>}
    </Fragment>
  )
}

export default LoginRegister