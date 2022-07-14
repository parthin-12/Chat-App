import './App.css';
import {BrowserRouter as Router,Navigate,Route,Routes} from "react-router-dom"
import LoginRegister from './Components/Home/LoginRegister';
import ChatHomePage from './Components/Chat/ChatHomePage.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Redux/Actions/userActions';
import Loader from './Components/Loader/loader';
import ForgetPassword from './Components/Home/ForgetPassword';
import ResetPassword from './Components/Home/ResetPassword';
import UpdateProfile from './Components/Home/UpdateProfile';
import UpdatePassword from './Components/Home/UpdatePassword';

function App() {

  const dispatch=useDispatch();
  const {isAuth,loading}=useSelector((state)=>(state.user));

  useEffect(() => {
    dispatch(loadUser());
  }, [])
  

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LoginRegister/>}/>
        <Route exact path="/chat" element={isAuth?<ChatHomePage/>:(loading===false?<Navigate to="/"/>:<Loader/>)} />
        <Route exact path="/password/forget" element={<ForgetPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/update/profile" element={<UpdateProfile />} />
        <Route exact path="/update/password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
