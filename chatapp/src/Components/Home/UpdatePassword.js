import React, { Fragment, useEffect,useState} from 'react';
import LockOpenIcon from "@material-ui/icons/LockOpenOutlined";
import KeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";
import "./UpdatePassword.css"
import { loadUser,updatePassword } from '../../Redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import Loader from '../Loader/loader';
import { CLEAR_ERRORS, UPDATE_PASSWORD_RESET } from '../../Redux/Constants/userConstants';


const UpdatePassword = () => {

    const dispatch =useDispatch();
    const navigate =useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {isUpdated,loading,error}=useSelector((state)=>(state.profileReducer));

    useEffect(() => {

        if(error){
            toast.error(error);
            dispatch({type:CLEAR_ERRORS});
        }

        if(isUpdated){
            toast.success("Password Updated Successfully");
            dispatch({type:UPDATE_PASSWORD_RESET})
            dispatch(loadUser());
            navigate("/chat");
        }
    }, [dispatch,navigate,error,isUpdated])

    const updatePasswordSubmit=(e)=>{
        e.preventDefault();

        const myform = new FormData();

        myform.set("oldPassword",oldPassword);
        myform.set("password",newPassword);
        myform.set("confirmPassword",confirmPassword);

        dispatch(updatePassword(myform));
    }


  return (
    <Fragment>
        {loading?<Loader />:
        <Fragment>
        <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
                <div className="updatePasswordHeading">Update Password</div>
                    <form className='updatePasswordForm'onSubmit={updatePasswordSubmit}>
                            <div className="oldPassword">
                                <KeyIcon />
                                <input 
                                type="password"
                                placeholder='Old Password'
                                required
                                value={oldPassword}
                                name="password"
                                onChange={(e)=>setOldPassword(e.currentTarget.value)} 
                                />
                            </div>
                            <div className="newPassword">
                                <LockOpenIcon />
                                <input 
                                type="password"
                                placeholder='New Password'
                                required
                                value={newPassword}
                                name="password"
                                onChange={(e)=>setNewPassword(e.currentTarget.value)} 
                                />
                            </div>
                            <div className="confirmPassword">
                                <LockIcon />
                                <input 
                                type="password"
                                placeholder='Confirm Password'
                                required
                                value={confirmPassword}
                                name="password"
                                onChange={(e)=>setConfirmPassword(e.currentTarget.value)} 
                                />
                            </div>
                            <input type="submit" value="Update" className='updatePasswordBtn' />   
                        </form>
                    </div>
                </div>
    </Fragment>
        }
    </Fragment>
  )
}

export default UpdatePassword