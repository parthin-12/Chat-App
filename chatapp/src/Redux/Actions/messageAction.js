import axios from "axios";
import { ACCEPT_REJECT_FAIL, ACCEPT_REJECT_REQUEST, ACCEPT_REJECT_SUCCESS, ALL_GROUP_FAIL, ALL_GROUP_REQUEST, ALL_GROUP_SUCCESS, CREATE_GROUP_FAIL, CREATE_GROUP_REQUEST, CREATE_GROUP_SUCCESS, GET_ALL_MESSAGES_FAIL, GET_ALL_MESSAGES_REQUEST, GET_ALL_MESSAGES_SUCCESS, SEND_MESSAGE_FAIL, SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, UPDATE_GROUP_FAIL, UPDATE_GROUP_REQUEST, UPDATE_GROUP_ROLE_FAIL, UPDATE_GROUP_ROLE_REQUEST, UPDATE_GROUP_ROLE_SUCCESS, UPDATE_GROUP_SUCCESS, UPDATE_MEMBER_ROLE_FAIL, UPDATE_MEMBER_ROLE_REQUEST, UPDATE_MEMBER_ROLE_SUCCESS } from "../Constants/messageConstants";

export const createGroup = (newData) =>async(dispatch) =>{
    try {
        dispatch({
            type:CREATE_GROUP_REQUEST
        });
        
        const config={headers:{"Content-Type":"multipart/form-data"}};

        let link="/api/v1/group";
        const {data}=await axios.post(link,newData,config);

        dispatch({
            type:CREATE_GROUP_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:CREATE_GROUP_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const AllGroups = (keyword="") =>async(dispatch) =>{
    try {
        dispatch({
            type:ALL_GROUP_REQUEST
        });
        
        let link=`/api/v1/groups?keyword=${keyword}`;
        const {data}=await axios.get(link);

        dispatch({
            type:ALL_GROUP_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ALL_GROUP_FAIL,
            payload:error.response.data.message
        }); 
    }
}

export const sendMessageAction = (sendData) =>async(dispatch) =>{
    try {
        dispatch({
            type:SEND_MESSAGE_REQUEST
        });
        
        let link="/api/v1/message";

        const config={headers:{"Content-Type":"application/json"}};

        const {data}=await axios.post(link,sendData,config);

        dispatch({
            type:SEND_MESSAGE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:SEND_MESSAGE_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const getAllMessagesAction = (groupId) =>async(dispatch) =>{
    try {
        dispatch({
            type:GET_ALL_MESSAGES_REQUEST
        });
        
        let link=`/api/v1/messages/${groupId}`;

        const {data}=await axios.get(link);

        dispatch({
            type:GET_ALL_MESSAGES_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:GET_ALL_MESSAGES_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const updateGroupRoleAction = (sendData) =>async(dispatch) =>{
    try {
        dispatch({
            type:UPDATE_GROUP_ROLE_REQUEST
        });
        
        let link="/api/v1/grouprole";

        const config={headers:{"Content-Type":"application/json"}};

        const {data}=await axios.put(link,sendData,config);

        dispatch({
            type:UPDATE_GROUP_ROLE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:UPDATE_GROUP_ROLE_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const acceptRejectAction = (sendData) =>async(dispatch) =>{
    try {
        dispatch({
            type:ACCEPT_REJECT_REQUEST
        });
        
        let link="/api/v1/acceptreject";

        const config={headers:{"Content-Type":"application/json"}};

        const {data}=await axios.put(link,sendData,config);

        dispatch({
            type:ACCEPT_REJECT_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:ACCEPT_REJECT_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const updateMemberRoleAction = (sendData) =>async(dispatch) =>{
    try {
        dispatch({
            type:UPDATE_MEMBER_ROLE_REQUEST
        });
        
        let link="/api/v1/memberrole";

        const config={headers:{"Content-Type":"application/json"}};

        const {data}=await axios.put(link,sendData,config);

        dispatch({
            type:UPDATE_MEMBER_ROLE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:UPDATE_MEMBER_ROLE_FAIL,
            payload:error.response.data.message
        }); 
    }
}


export const updateGroup = (groupId,newData) =>async(dispatch) =>{
    try {
        dispatch({
            type:UPDATE_GROUP_REQUEST
        });
        
        const config={headers:{"Content-Type":"multipart/form-data"}};

        let link=`/api/v1/group/${groupId}`;
        const {data}=await axios.put(link,newData,config);

        dispatch({
            type:UPDATE_GROUP_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:UPDATE_GROUP_FAIL,
            payload:error.response.data.message
        }); 
    }
}

