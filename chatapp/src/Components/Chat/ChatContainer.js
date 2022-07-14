import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Profile from "./../../Images/profile1.png"
import SocketIO from "socket.io-client";
import Message from '../Message/Message';
import { SEND_MESSAGE_RESET } from '../../Redux/Constants/messageConstants';
import { sendMessageAction, updateGroupRoleAction } from '../../Redux/Actions/messageAction';
import SendImg from "./../../Images/send.png"
import { toast } from 'react-toastify';
import { CLEAR_ERRORS } from '../../Redux/Constants/userConstants';
import {changeCurrentGroupToggleHandler} from "./ChatHomePage.js"


let socket;
let ENDPOINT = "https://chat-app-201901113.herokuapp.com/";

const ChatContainer = ({currentGroup,user,getMessages,isMemberInGroup}) => {

    const dispatch=useDispatch();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const{isSend,error:messageError}=useSelector((state)=>(state.messageReducer));

    const messagesEndRef = useRef(null);

    const chatFormSubmitHandler=(e)=>{
        e.preventDefault();
        if(message.trim()){
            const myform = new FormData();
            myform.set("message",message);
            myform.set("groupId",currentGroup._id);
        
            dispatch(sendMessageAction(myform))
        }else
        return;
    
      }


    useEffect(() => {
        if(messageError){
            toast.error(messageError);
            dispatch({type:CLEAR_ERRORS})
        }

        if(isSend){
            socket.emit("Message Send",{message,user:user._id,currentGroup:currentGroup._id,name:user.name});
            dispatch({type:SEND_MESSAGE_RESET});
            document.getElementById("messageChat").value="";
            setMessage("");
        }
        
    }, [isSend,messageError])

    const scrollToBottom = () => {
        if(messagesEndRef.current){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" , block: 'nearest', inline: 'start'})
        }
    }

    useEffect(scrollToBottom, [messages]);


    const groupRoleHandler=(group)=>{

        const myform = new FormData();
        myform.set("groupId",group._id);
    
        dispatch(updateGroupRoleAction(myform));
    
      }

    useEffect(() => {
        socket=SocketIO(ENDPOINT,{transports:['websocket']});
        socket.on("Received Message", messageFromBackEnd => {

            // const isMember=currentGroup.members.find((e)=>String(e.user)===String(user._id));
          if(currentGroup._id===messageFromBackEnd.currentGroup && isMemberInGroup)
            setMessages([...messages,messageFromBackEnd]);
        })
        return()=>{
            socket.off();
        }
      }, [messages])

    useEffect(()=>{
        setMessages(getMessages);
    },[getMessages]);


  return (
    <div className='chatUi'>
        <div className='chatUiHeader'>
            <img src={currentGroup && currentGroup.avatar.url!=="sampleUrl"?currentGroup.avatar.url:Profile} alt="Group_Img" />
            <h1 onClick={()=>(changeCurrentGroupToggleHandler(2))}>{currentGroup?currentGroup.name:"Sample Group"}</h1>
            <button onClick={()=>(groupRoleHandler(currentGroup))} className={isMemberInGroup?"groupBtn red":(currentGroup && currentGroup.groupRole==="Any one can Join"?"groupBtn green":(currentGroup.groupRole==="Invite only"?"groupBtn golden":"groupBtn gray"))}>{isMemberInGroup && isMemberInGroup.role==="master"?"Delete":(isMemberInGroup?"Leave":(currentGroup.groupRole==="Any one can Join"?"Join":(currentGroup.groupRole==="Invite only"?"Request":"Closed")))}</button>  
        </div>
        <div className='chatPanel'>
            {messages.length>0 && messages.map((e,i)=>(
                <Message key={i} groupId={currentGroup._id} messageId={e._id?e._id:e.messageId} user={e.name} message={e.message} role={e.user===undefined?"admin":(e.user===user._id?"right":"left")} messageTime={e.createAt} />
                ))}
            <div ref={messagesEndRef} />
        </div>
        <form className='inputBox' onSubmit={chatFormSubmitHandler}>
            <input id='messageChat' type="text" placeholder='Type here...' onChange={(e)=>(setMessage(e.target.value))}/>
            <button className='chatSendBtn' type="submit"><img src={SendImg} alt="Logo"/></button>
        </form>
  </div>
  )
}

export default ChatContainer