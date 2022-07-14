import React, { Fragment, useEffect,useState} from 'react';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useDispatch, useSelector } from 'react-redux';
import {toast} from "react-toastify"
import Loader from '../Loader/loader.js';
import"./ForgetPassword.css"
import { CLEAR_ERRORS } from '../../Redux/Constants/userConstants';
import { forgetPassword } from '../../Redux/Actions/userActions.js';

const ForgetPassword = () => {

    const dispatch=useDispatch();

    const {message,loading,error}= useSelector((state)=>(state.forgetPasswordReducer));

    const [email, setEmail] = useState("");

    useEffect(() => {

        if(error){
            toast.error(error);
            dispatch({type:CLEAR_ERRORS});
        }

        if(message){
            toast.success(message);
        }
    }, [dispatch,error,message])

    const forgetPasswordSubmit=(e)=>{
        e.preventDefault();

        const myform = new FormData();
        myform.set("email",email);

        dispatch(forgetPassword(myform));
    }

  return (
    <Fragment>
    {loading?<Loader />:
    <Fragment>
    <div className="forgetPasswordContainer">
        <div className="forgetPasswordBox">
            <div className="forgetPasswordHeading">Forget Password</div>
                <form className='forgetPasswordForm'onSubmit={forgetPasswordSubmit}>
                        <div className="emial">
                            <MailOutlineIcon />
                            <input 
                            type="email"
                            placeholder='Email'
                            required
                            value={email}
                            name="email"
                            onChange={(e)=>setEmail(e.currentTarget.value)} 
                            />
                        </div>
                        <input type="submit" value="Update" className='forgetPasswordBtn' />   
                    </form>
                </div>
            </div>
        </Fragment>
        }
    </Fragment>
  )
}

export default ForgetPassword