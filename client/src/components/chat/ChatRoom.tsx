import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import styles from './ChatRoom.module.css';
import { useParams } from "react-router"
interface Message {
 user: string;
 text: string;
 timestamp: Date;
 isCurrentUser: boolean;
}

const ChatRoomCompo: React.FC = () => {
 const [messages, setMessages] = useState<Message[]>([]);
 const [message, setMessage] = useState("");
 const [isConnected, setIsConnected] = useState(false);
 const [isTyping, setIsTyping] = useState(false);
 const socketRef = useRef<Socket | null>(null);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const [roomId, setRoomId] = useState("");

 const params = useParams()
 
 const { state } = useLocation();
  const { userName, name } = state || {};

  const roomid = params.roomId

  
  useEffect(()=>{
   
    setRoomId(roomid)
    
    
    const data  = localStorage.getItem(roomid)
   
    
    if(data){
      const mess: Message[] = JSON.parse(data)
      setMessages(mess)
    }
   },[userName,name])
 
 useEffect(() => {
   socketRef.current = io('http://localhost:3000');
   const socket = socketRef.current;

   socket.on('connect', () => {
     setIsConnected(true);
     socket.emit('join', { userName : userName, name : name });
     const roomName = [userName, name].sort().join("_");
  
     
     setRoomId(roomName)
   });

   socket.on('message', ({ user, text }: { user: string, text: string }) => {
     const newMessage: Message = {
       user,
       text,
       timestamp: new Date(),
       isCurrentUser: user === userName
     };
   
     
     setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      
     
      const data = JSON.stringify(updatedMessages);
   
      
      
      localStorage.setItem(roomid, data);
      
      return updatedMessages;  
  });
   });

   socket.on('userTyping', ({ user, isTyping }) => {
     if (user !== userName) {
       setIsTyping(isTyping);
     }
   });

   socket.on('disconnect', () => {
     setIsConnected(false);
   });

   return () => {
     socket.disconnect();
   };
 }, [userName, name]);

 useEffect(() => {
   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const handleSendMessage = () => {
 
  
   if (message.trim() && socketRef.current) {
     socketRef.current.emit('sendMessage', {
       userName,
       roomid,
       message
     });
     setMessage('');
   }
 };

 const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
   setMessage(e.target.value);
   socketRef.current?.emit('typing', {
     user: userName,
     isTyping: e.target.value.length > 0
   });
 };

 const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === 'Enter' && !e.shiftKey) {
     e.preventDefault();
     handleSendMessage();
   }
 };

 return (
  <div className={styles.chatContainer}>
    <div className={styles.chatHeader}>
      <div className={styles.userInfo}>
        {state.imageBase64 && (
          <img 
            src={state.imageBase64} 
            alt={name}
            className={styles.userAvatar}
          />
        )}
        <div className={styles.userDetails}>
          <span className={styles.userName}>{name}</span>
          {isConnected && <span className={styles.onlineStatus}>• online</span>}
        </div>
      </div>
    </div>

    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${styles.messageWrapper} ${
            msg.isCurrentUser ? styles.currentUser : styles.otherUser
          }`}
        >
          <div className={styles.message}>
            <div className={styles.messageContent}>{msg.text}</div>
            <div className={styles.messageTime}>
              {new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className={styles.typingIndicator}>
          <span className={styles.typingDots}>•••</span>
          {name} is typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>

    <div className={styles.inputContainer}>
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className={styles.messageInput}
      />
      <button 
        onClick={handleSendMessage}
        disabled={!message.trim()}
        className={styles.sendButton}
      >
        <span>{message.trim() ? 'Send' : '✉'}</span>
      </button>
    </div>
  </div>
);
};

export default ChatRoomCompo;