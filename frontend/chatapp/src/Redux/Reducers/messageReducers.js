import { ACCEPT_REJECT_FAIL, ACCEPT_REJECT_REQUEST, ACCEPT_REJECT_RESET, ACCEPT_REJECT_SUCCESS, ALL_GROUP_FAIL, ALL_GROUP_REQUEST, ALL_GROUP_SUCCESS, CREATE_GROUP_FAIL, CREATE_GROUP_REQUEST, CREATE_GROUP_RESET, CREATE_GROUP_SUCCESS, GET_ALL_MESSAGES_FAIL, GET_ALL_MESSAGES_REQUEST, GET_ALL_MESSAGES_SUCCESS, SEND_MESSAGE_FAIL, SEND_MESSAGE_REQUEST, SEND_MESSAGE_RESET, SEND_MESSAGE_SUCCESS, UPDATE_GROUP_FAIL, UPDATE_GROUP_REQUEST, UPDATE_GROUP_RESET, UPDATE_GROUP_ROLE_FAIL, UPDATE_GROUP_ROLE_REQUEST, UPDATE_GROUP_ROLE_RESET, UPDATE_GROUP_ROLE_SUCCESS, UPDATE_GROUP_SUCCESS, UPDATE_MEMBER_ROLE_FAIL, UPDATE_MEMBER_ROLE_REQUEST, UPDATE_MEMBER_ROLE_RESET, UPDATE_MEMBER_ROLE_SUCCESS } from "../Constants/messageConstants"
import { CLEAR_ERRORS } from "../Constants/userConstants"

export const groupReducer=(state={group:{}},action)=>{
    switch (action.type) {
        case CREATE_GROUP_REQUEST:
        case UPDATE_GROUP_REQUEST:
            return {
                ...state,
                loading:true,
                success:false,
                group:{},
            }

        case CREATE_GROUP_SUCCESS:
        case UPDATE_GROUP_SUCCESS:
            return {
                loading:false,
                group:action.payload.group,
                success:action.payload.success
            }

        case CREATE_GROUP_FAIL:
        case UPDATE_GROUP_FAIL:
            return{
                ...state,
                group:{},
                loading:false,
                error:action.payload,
            }

        case CREATE_GROUP_RESET:
        case UPDATE_GROUP_RESET:
            return {
                ...state,
                success:false
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

export const getGroupsReducer=(state={groups:{},userGroups:{}},action)=>{
    switch (action.type) {
        case ALL_GROUP_REQUEST:
            return {
                ...state,
                loading:true,
                groups:{},
                userGroups:{}
            }

        case ALL_GROUP_SUCCESS:
            return {
                loading:false,
                groups:action.payload.groups,
                userGroups:action.payload.userGroups
            }

        case ALL_GROUP_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload,
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

export const messageReducer=(state={},action)=>{
    switch (action.type) {
        case SEND_MESSAGE_REQUEST:
            return {
                ...state,
                loading:true,
                isSend:false
            }

        case SEND_MESSAGE_SUCCESS:
            return {
                loading:false,
                isSend:action.payload.success,
            }

        case SEND_MESSAGE_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload,
            }

        case SEND_MESSAGE_RESET:
            return {
                ...state,
                isSend:false
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


export const getAllMessagesReducer=(state={messages:[]},action)=>{
    switch (action.type) {
        case GET_ALL_MESSAGES_REQUEST:
            return {
                ...state,
                loading:true,
                isMemberInGroup:false,
                memberRole:"",
                messages:[]
            }

        case GET_ALL_MESSAGES_SUCCESS:
            return {
                loading:false,
                messages:action.payload.messages,
                isMemberInGroup:action.payload.isMemberInGroup,
                memberRole:action.payload.memberRole
            }

        case GET_ALL_MESSAGES_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload,
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


export const updateRoleReducer=(state={},action)=>{
    switch (action.type) {
        case UPDATE_GROUP_ROLE_REQUEST:
        case ACCEPT_REJECT_REQUEST:
        case UPDATE_MEMBER_ROLE_REQUEST:
            return {
                ...state,
                loading:true,
                isUpdated:false,
                message:"",
                adminMessage:"",
                messageId:null
            }

        case UPDATE_GROUP_ROLE_SUCCESS:
        case ACCEPT_REJECT_SUCCESS:
        case UPDATE_MEMBER_ROLE_SUCCESS:
            return {
                loading:false,
                isUpdated:action.payload.success,
                message:action.payload.message,
                adminMessage:action.payload.adminMessage,
                messageId:action.payload.messageId
            }

        case UPDATE_GROUP_ROLE_FAIL:
        case ACCEPT_REJECT_FAIL:
        case UPDATE_MEMBER_ROLE_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload,
            }

        case UPDATE_GROUP_ROLE_RESET:
        case ACCEPT_REJECT_RESET:
        case UPDATE_MEMBER_ROLE_RESET:
            return {
                ...state,
                isUpdated:false,
                message:"",
                adminMessage:"",
                messageId:null,
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