import React from 'react'
import { useDispatch } from 'react-redux'
import { acceptRejectAction } from '../../Redux/Actions/messageAction';
import "./Message.css"
import {format} from "timeago.js"

const Message = ({user,message,role,groupId,messageId,messageTime}) => {

  const dispatch=useDispatch();

  const requestBtnHandler=(isAccepted,messageId)=>{

    const myform = new FormData();

    myform.set("isAccepted",isAccepted);
    myform.set("messageId",messageId);
    myform.set("groupId",groupId);

    dispatch(acceptRejectAction(myform));

  }

  return (
   <div > 
        {role==="right"?
        <div className='m1'>
          <div className=' messageBox right'>
            {`You: ${message}`}
            <h6>{format(messageTime)}</h6>
          </div>
        </div>
        :
        <div className='m1'>
          <div className={`messageBox ${role}`}>
              {`${user}: ${message}`}
              {role==="admin" && message.substring(message.length-4,message.length)==="join" && <div className='requestButtons'>
                <button onClick={()=>(requestBtnHandler(1,messageId))}>Accept</button>
                <button onClick={()=>(requestBtnHandler(0,messageId))}>Reject</button>
              </div>}
              <h6>{format(messageTime)}</h6>
          </div>
        </div>
        }
    </div>
  )
}

export default Message