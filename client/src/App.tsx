
import './App.css'
import Login from './components/Auth/Login'
import SoldierDashboard from './components/army/SoldierDashboard';
import Register from './components/Auth/Register'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Page';
import CommanderDashboard from './components/army/CommanderDashboard';
import SekectUserChat from './components/chat/SekectUserChat';
import ChatRoomCompo from './components/chat/ChatRoom';
import HomeArmy from './components/army/LinkArmy';
import Home from './components/Home/Home';




function App() {
  

  return (
    <>
    <Router>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/HomePage" element={<HomePage />} />
       <Route path="/HomeArmy" element={<HomeArmy/>} />
       <Route path="/Login" element={<Login />} />
       <Route path="/Register" element={<Register />} />
       <Route path="/Commander" element={<CommanderDashboard />} />
       <Route path="/SekectUserChat" element={<SekectUserChat />} />
       <Route path="/ChatRoom/:roomId" element={<ChatRoomCompo />} />
       <Route path="/soldier" element={<SoldierDashboard />}/>
      </Routes>
    </Router>
    
    </>
  )
   
}

export default App
