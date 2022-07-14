import axios from "axios";
import {FORGET_PASSWORD_FAIL, FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, LOAD_FAIL, LOAD_REQUEST, LOAD_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS} from "./../Constants/userConstants.js";


/////////LOGIN///////

export const loginUser = (newData) =>async(dispatch) =>{
    try {
        dispatch({
            type:LOGIN_REQUEST
        });

        const config={headers:{"Content-Type":"application/json"}};
        let link="/api/v1/login";
        const {data}=await axios.post(link,newData,config);

        dispatch({
            type:LOGIN_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:LOGIN_FAIL,
            payload:error.response.data.message
        }); 
    }
}


/////////////////////////LOAD USER////////////////
export const loadUser = () =>async(dispatch) =>{
    try {
        dispatch({
            type:LOAD_REQUEST
        });

        const config={headers:{"Content-Type":"application/json"}};
        let link="/api/v1/user";
        const {data}=await axios.get(link,config);

        dispatch({
            type:LOAD_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:LOAD_FAIL,
            payload:error.response.data.message
        }); 
    }
}

/////////////////LOGOUT//////////////
export const logoutUser = () =>async(dispatch) =>{
    try {
        let link="/api/v1/logout";
        await axios.get(link);

        dispatch({
            type:LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type:LOGOUT_FAIL,
            payload:error.response.data.message
        }); 
    }
}

/////////////////////////REGISTER USER////////////////
export const registerUser = (formData) =>async(dispatch) =>{
    try {
        dispatch({
            type:REGISTER_REQUEST
        });

        const config={headers:{"Content-Type":"multipart/form-data"}};

        let link="/api/v1/register";
        console.log(formData.get('name'));
        const {data}=await axios.post(link,formData,config);

        dispatch({
            type:REGISTER_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:REGISTER_FAIL,
            payload:error.response.data.message
        }); 
    }
}


////////////////////////////FORGET PASSWORD///////////////////

export const forgetPassword = (newData) =>async(dispatch) =>{
    try {
        dispatch({
            type:FORGET_PASSWORD_REQUEST 
        });

        const config={headers:{"Content-Type":"application/json"}};
        let link="/api/v1/password/forget";
        const {data}=await axios.post(link,newData,config);

        dispatch({
            type:FORGET_PASSWORD_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:FORGET_PASSWORD_FAIL,
            payload:error.response.data.message
        }); 
    }
}


////////////////////////////RESET PASSWORD /////////////


export const resetPassword = (token,newData) =>async(dispatch) =>{
    try {
        dispatch({
            type:RESET_PASSWORD_REQUEST 
        });

        const config={headers:{"Content-Type":"application/json"}};
        let link=`/api/v1/password/reset/${token}`;
        const {data}=await axios.put(link,newData,config);
        console.log(data);

        dispatch({
            type:RESET_PASSWORD_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:RESET_PASSWORD_FAIL,
            payload:error.response.data.message
        }); 
    }
}

//////////////////////////////////////////UPDATE PASSWORD//////////////////////


export const updatePassword = (newData)=>async(dispatch) =>{

    try {
        dispatch({
            type:UPDATE_PASSWORD_REQUEST
        });

        const config={headers:{"Content-Type":"application/json"}};
        let link="/api/v1/user/update/password";
        const {data}=await axios.put(link,newData,config);

        dispatch({
            type:UPDATE_PASSWORD_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:UPDATE_PASSWORD_FAIL,
            payload:error.response.data.message
        }); 
    }
}


/////////////////////////////////////UPDATE PROFILE//////////////////////////

export const updateProfile = (newData)=>async(dispatch) =>{

    try {
        dispatch({
            type:UPDATE_PROFILE_REQUEST
        });

        const config={headers:{"Content-Type":"multipart/form-data"}};
        let link="/api/v1/user/update";
        const {data}=await axios.put(link,newData,config);

        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:UPDATE_PROFILE_FAIL,
            payload:error.response.data.message
        }); 
    }
}
