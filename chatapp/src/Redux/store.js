import { createStore ,combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {forgetPasswordReducer, profileReducer, userReducer} from "./Reducers/userReducers.js"
import { getGroupsReducer, groupReducer, messageReducer,getAllMessagesReducer,updateRoleReducer } from "./Reducers/messageReducers.js";

const reducer=combineReducers({
    user:userReducer,
    groupReducer:groupReducer,
    allGroupsReducer:getGroupsReducer,
    messageReducer:messageReducer,
    getAllMessagesReducer:getAllMessagesReducer,
    groupRoleReducer:updateRoleReducer,
    forgetPasswordReducer:forgetPasswordReducer,
    profileReducer:profileReducer
});

const initialState={};

const middleware=[thunk];


const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;