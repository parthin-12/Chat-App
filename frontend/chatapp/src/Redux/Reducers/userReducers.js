import {CLEAR_ERRORS, FORGET_PASSWORD_FAIL, FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, LOAD_FAIL, LOAD_REQUEST, LOAD_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_RESET, UPDATE_PASSWORD_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_RESET, UPDATE_PROFILE_SUCCESS} from "./../Constants/userConstants.js";

export const userReducer=(state={user:{}},action)=>{
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOAD_REQUEST:
        case REGISTER_REQUEST:
            return {
                ...state,
                loading:true,
                user:{},
                isAuth:false
            }

        case LOGIN_SUCCESS:
        case LOAD_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                loading:false,
                user:action.payload.user,
                isAuth:true
            }

        case LOGOUT_SUCCESS:
            return{
                loading:false,
                isAuth:false,
                user:{}
            }

        case LOGIN_FAIL:
        case LOGOUT_FAIL:
        case REGISTER_FAIL:
            return{
                ...state,
                user:{},
                loading:false,
                error:action.payload,
                isAuth:false,
            }

        case LOAD_FAIL:
            return{
                user:null,
                loading:false,
                error:action.payload,
                isAuth:false,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
    
        default:
            return state;
    }
}

export const forgetPasswordReducer = (state={},action) =>{
    switch (action.type) {
        case FORGET_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
           return {
               ...state,
                loading:true,
                error:null
           }
        
        case FORGET_PASSWORD_SUCCESS:
        return {
            loading:false,
            message:action.payload.message
        }

        case RESET_PASSWORD_SUCCESS:
            return{
                loading:false,
                success:action.payload.success
            }

        case FORGET_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
        return {
            ...state,
            loading:false,
            error:action.payload,
        }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            };   
    
        default:
            return state;
    }
}


export const profileReducer = (state={},action) =>{
    switch (action.type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
           return {
                ...state,
                loading:true,
                isUpdated:false
           }          
        
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        return {
            loading:false,
            isUpdated:action.payload.success
        }   

        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        return {
            ...state,
            loading:false,
            error:action.payload,
        }

        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
            return{
                ...state,
                loading:false,
                isUpdated:false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            };   
    
        default:
            return state;
    }
}