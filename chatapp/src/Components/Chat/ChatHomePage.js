import React, {useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { logoutUser } from '../../Redux/Actions/userActions';
import "./ChatHomePage.css"
import Profile from "./../../Images/profile1.png"
import {MdGroupAdd} from "react-icons/md"
import {ImArrowLeft} from "react-icons/im"
import {AiFillSetting} from "react-icons/ai"
import DescriptionSharpIcon from "@material-ui/icons/DescriptionSharp";
import GroupSharpIcon from "@material-ui/icons/GroupSharp";
import AccountTreeSharpIcon from "@material-ui/icons/AccountTreeSharp";
import { AllGroups, createGroup, getAllMessagesAction, updateGroup, updateGroupRoleAction, updateMemberRoleAction } from '../../Redux/Actions/messageAction';
import { CLEAR_ERRORS } from '../../Redux/Constants/userConstants';
import { CREATE_GROUP_RESET, UPDATE_GROUP_ROLE_RESET } from '../../Redux/Constants/messageConstants';
import Loader from "./../Loader/loader.js"
import ChatContainer from './ChatContainer';
import SocketIO from "socket.io-client";
import Welcome from './Welcome';
import {Link} from "react-router-dom";
import moment from "moment"

const groupRoles=["Any one can Join","Invite only","Closed"];
let ENDPOINT = "https://chat-app-201901113.herokuapp.com/";

let changeCurrentGroupToggleHandler=()=>{};

const ChatHomePage = () => {

  changeCurrentGroupToggleHandler=(x)=>{
    if(x===1){
      setSendUser({name:"",desc:""});
      setGroupRole(groupRoles[0]);
      setAvatar(null);
      setAvatarPreview(Profile);
      setCreateGroupToggle(1);
    }else if(x===2){
      setCreateGroupToggle(2);
    }else if(x===3){
      setSendUser({name:currentGroup.name,desc:currentGroup.desc});
      setGroupRole(currentGroup.groupRole);
      setAvatarPreview(currentGroup.avatar.url==="sampleUrl"?Profile:currentGroup.avatar.url);
      setCreateGroupToggle(3);
    }else{
      if(createGroupToggle===3){
        setCreateGroupToggle(2);
      }else{
        setCreateGroupToggle(0);
      }
    }

  }

    const dispatch=useDispatch();
    
    const [avatar, setAvatar] = useState(null);
    const [groupRole, setGroupRole] = useState(groupRoles[0]);
    const [avatarPreview, setAvatarPreview] = useState(Profile);
    const [createGroupToggle, setCreateGroupToggle] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [currentGroup, setCurrentGroup] = useState(null);
    const [sendUser, setSendUser] = useState({
      name:"",
      desc:"",
  });

    const [color, setColor] = useState(null);
  
    const onClickColorChangeHandler=(e,group)=>{
  
      if(color!==e.currentTarget){
        if(color){
          color.style.backgroundColor="rgb(234,234,234)";
          color.style.border="none";
        }
          e.currentTarget.style.backgroundColor='rgb(150,150,150)';
          e.currentTarget.style.border="2px solid rgb(50,50,50)";
          setColor(e.currentTarget);
          dispatch(getAllMessagesAction(group._id));
          setCurrentGroup(group);
      }
    }

    const{success,error}=useSelector((state)=>(state.groupReducer));
    const{user}=useSelector((state)=>(state.user));
    const{messages,error:messageError,isMemberInGroup,memberRole}=useSelector((state)=>(state.getAllMessagesReducer));
    const{isUpdated,message,error:groupRoleError,adminMessage,messageId}=useSelector((state)=>(state.groupRoleReducer));
    const{error:groupError,loading,groups,userGroups}=useSelector((state)=>(state.allGroupsReducer));
    

    const {name,desc}=sendUser;

    const logoutBtnHandler=()=>{
        dispatch(logoutUser());
        toast.success("Logout Successfully");
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

  const groupSubmitHandler=(e)=>{
    e.preventDefault();

    const myform = new FormData();
    myform.set("name",name);
    myform.set("desc",desc);
    myform.set("groupRole",groupRole);
    myform.set("avatar",avatar);


    if(createGroupToggle===1)
      dispatch(createGroup(myform));
    else
      dispatch(updateGroup(currentGroup._id,myform))
  }

  const groupRoleHandler=(group)=>{

    const myform = new FormData();
    myform.set("groupId",group._id);

    dispatch(updateGroupRoleAction(myform));

  }

  const memberRoleHandler=(groupId,memberId,isKick)=>{

    const myform = new FormData();
    myform.set("groupId",groupId);
    myform.set("memberId",memberId);
    myform.set("isKick",isKick);

    dispatch(updateMemberRoleAction(myform));

  }


  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch({type:CLEAR_ERRORS});
    }else
    if (groupError){
      toast.error(groupError);
      dispatch({type:CLEAR_ERRORS});
    }else
    if(messageError){
      toast.error(messageError);
      dispatch({type:CLEAR_ERRORS});
    }else
    if(groupRoleError){
      toast.error(groupRoleError);
      dispatch({type:CLEAR_ERRORS});
    }
    else {
      if(success){
        if(createGroupToggle===1)
          toast.success("Group Created Successfully");
        else
          toast.success("Group Updated Successfully");
      dispatch({type:CREATE_GROUP_RESET});
      dispatch(AllGroups());
      changeCurrentGroupToggleHandler(1);
      setCreateGroupToggle(0);
      setCurrentGroup(null);
    }
  }

  }, [error,success,groupError,messageError,groupRoleError])

  useEffect(() => {
    if(isUpdated){
      dispatch(AllGroups());
      if(adminMessage){
        const socket=SocketIO(ENDPOINT,{transports:['websocket']});
        socket.emit("Message Send",{message:adminMessage,currentGroup:currentGroup._id,name:"Admin",messageId});
      }
      // setCreateGroupToggle(0);
      changeCurrentGroupToggleHandler(1);
      setCreateGroupToggle(0);
      setCurrentGroup(null);
      dispatch({type:UPDATE_GROUP_ROLE_RESET});
    }
  }, [isUpdated,messageId,adminMessage])

  useEffect(() => {
    if(message){
      toast.success(message);
    }
  }, [message])
  
  

  useEffect(() => {
    dispatch(AllGroups());
  }, [])

  useEffect(() => {
      dispatch(AllGroups(searchInput));
  }, [searchInput])
  
  
  

  return (
    // <Fragment>
    //   {(loading!==null && loading===false)?
        <div className="chatContainer">
          <div className='chatPage'>
            <div className='headerBtns'>
              <Link to="/update/profile">
                <button className='logoutBtn lightGreen'>Profile</button>
              </Link>
              <Link to="/update/password">
                <button className='logoutBtn golden'>Password</button>
              </Link>
              <button onClick={logoutBtnHandler} className='logoutBtn red'>Logout</button>
            </div>
            <div className="chatBox">
              {currentGroup?<ChatContainer currentGroup={currentGroup} user={user} getMessages={messages} isMemberInGroup={isMemberInGroup}/>:<Welcome userName={user.name}/>}

              {createGroupToggle===0 && <div className='groupContainer'>
                <div className="groupHeading">
                  <ImArrowLeft style={{visibility:"hidden"}}/>
                  <h1>Chat App</h1>
                  <MdGroupAdd onClick={()=>(changeCurrentGroupToggleHandler(1))}/>
                </div>
                <input value={searchInput} onChange={(e)=>(setSearchInput(e.target.value))} type="text" placeholder='Search or start new chat' name='serachChat'/>
                {loading?<Loader/>: <div className='groupBox'>
                  {userGroups.length>0 && userGroups.map((group)=>(
                      <div key={group._id} className='groupItem' onClick={(e)=>(onClickColorChangeHandler(e,group))}>
                          <img src={group.avatar.url==="sampleUrl"?Profile:group.avatar.url} alt="Group_Img" />
                          <div className='textBox'>
                              <h1>{group.name}</h1>
                              <h5>Created by:{group.members[0].user._id===user._id?"You":group.createBy.user.name}</h5>
                          </div>
                          <button onClick={()=>(groupRoleHandler(group))} className={`groupBtn red`}>{group.members[0].user._id===user._id?"Delete":"Leave"}</button>
                        </div>
                  ))}
                  {groups.length>0 && groups.map((group)=>(
                        <div key={group._id} className='groupItem' onClick={(e)=>(onClickColorChangeHandler(e,group))}>
                          <img src={group.avatar.url==="sampleUrl"?Profile:group.avatar.url} alt="Group_Img" />
                          <div className='textBox'>
                              <h1>{group.name}</h1>
                              <h5>Created by:{group.createBy.user.name}</h5>
                          </div>
                          <button onClick={()=>(groupRoleHandler(group))} className={group.groupRole==="Any one can Join"?"groupBtn green":(group.groupRole==="Invite only"?"groupBtn golden":"groupBtn gray")}>{group.groupRole==="Any one can Join"?"Join":(group.groupRole==="Invite only"?"Request":"Closed")}</button>
                      </div>
                  ))}
                </div>}
              </div>}

              {(createGroupToggle===1 || createGroupToggle===3) && <div className='groupContainer'>
                <div className="groupHeading">
                  <ImArrowLeft  onClick={()=>(changeCurrentGroupToggleHandler(0))}/>
                  <h1>{createGroupToggle===1?"Create":"Update"} Group</h1>
                  <MdGroupAdd style={{visibility:"hidden"}}/>
                </div>
                <form className='groupForm' onSubmit={groupSubmitHandler} encType="multipart/form-data">
                  <div id='groupImage'>
                      <img src={avatarPreview} alt="Avatar Preview"/>
                      <input type="file" name="avatar" accept='image/*' onChange={registerDataChange} id="uploadBtn"/>
                  </div>
                        <div>
                          <GroupSharpIcon />
                          <input 
                          type="text"
                          placeholder='Group Name'
                          required
                          value={name}
                          name="name"
                          onChange={registerDataChange} 
                          />
                      </div>
                      <div>
                      <DescriptionSharpIcon />
                        <textarea
                          className='submitDialogTextArea'
                          cols="30"
                          rows="1"
                          value={desc}
                          required
                          placeholder="Description"
                          name='desc'
                          onChange={registerDataChange}
                          ></textarea>
                      </div>
                      <div>
                        <AccountTreeSharpIcon />
                          <select
                              onChange={(e)=>(setGroupRole(e.target.value))}
                              value={groupRole}
                          >
                              {groupRoles && groupRoles.map((e)=>(
                                  <option key={e} value={e}>{e}</option>
                              ))}
                          </select>
                      </div>
                      <input type="submit" value={createGroupToggle===1?"Create":"Update"} disabled={success?true:false} className='groupSubmitBtn' /> 
                </form>     
              </div>}

              {createGroupToggle===2 && <div className='groupContainer'>
                  <div className="groupHeading">
                    <ImArrowLeft  onClick={()=>(changeCurrentGroupToggleHandler(0))}/>
                    <h1>{currentGroup.name}</h1>
                    {(memberRole==="admin" || memberRole==="master") && <AiFillSetting onClick={()=>(changeCurrentGroupToggleHandler(3))} className/>}
                  </div>

                  <div className='groupInfo'>
                    {/* <h4>Group ID-{currentGroup._id}</h4> */}
                    {/* {(memberRole==="admin" || memberRole==="master") && <button onClick={()=>(changeCurrentGroupToggleHandler(3))} className='groupSubmitBtn'>Change</button>} */}
                    <h5>Create At: {moment(currentGroup.createAt).format('DD-MM-YYYY HH:mm:ss') }</h5>
                    <h3><b><u>Description</u></b>: {currentGroup && currentGroup.desc}</h3>
                    <h4>Group members - {currentGroup && currentGroup.members.length}</h4>
                        {currentGroup && currentGroup.members.map((member)=>(
                            <div key={member._id} className='groupItem bgBlack'>
                              <img src={member.user.avatar.url==="sampleUrl"?Profile:member.user.avatar.url} alt="Group_Img" />
                              <div className='textBox'>
                                  <h1>{user._id===member.user._id?"You":member.user.name}</h1>
                                  <h5 style={{color:member.role==="master"?"orange":(member.role==="admin"?"rgb(255,60,60)":"greenYellow")}}>({member.role})</h5>
                              </div>
                              {(memberRole==="admin" || memberRole==="master") && member.role!=="master" && user._id!==member.user._id && <div className='memberBtn'>
                                <button onClick={()=>(memberRoleHandler(currentGroup._id,member.user._id,0))} className={member.role==="admin"?"red":"green"}>{member.role==="admin"?"Member":"Admin"}</button>
                                <button onClick={()=>(memberRoleHandler(currentGroup._id,member.user._id,1))} className='red'>Kick</button>
                              </div>}
                              {/* <button onClick={()=>(groupRoleHandler(group))} className={group.groupRole==="Any one can Join"?"groupBtn green":(group.groupRole==="Invite only"?"groupBtn golden":"groupBtn gray")}>{group.groupRole==="Any one can Join"?"Join":(group.groupRole==="Invite only"?"Request":"Closed")}</button> */}
                          </div>
                      ))}
                    </div>
                    
                </div>}

            </div>
          </div>
        </div>
    //   :(loading===true && <Loader/>)} 
    // </Fragment>
  )
}

export {changeCurrentGroupToggleHandler}

export default ChatHomePage