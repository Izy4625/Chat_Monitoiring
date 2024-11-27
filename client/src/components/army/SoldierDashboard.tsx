// SoldierDashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import styles from './SoldierDashboard.module.css';

interface Message {
  user1: string;
  user2: string;
  text: string;
  timestamp: Date;
}

const SoldierDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    const socket = socketRef.current;
    const data  = localStorage.getItem('soldierDashboard')
  
    if(data){
      const mess: Message[] = JSON.parse(data)
      setMessages(mess)
    }

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinSoldier', "rifael");
    });

    socket.on('alertMessage', ({ user1, user2, text }: { user1?: string, user2?: string, text: string }) => {
      const newMessage: Message = {
        user1,
        user2,
        text,
        timestamp: new Date(),
      };
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
     
        const data = JSON.stringify(updatedMessages);

        localStorage.setItem('soldierDashboard', data);
        
        return updatedMessages;  
    });
      
     
      const audio = new Audio('/alert-sound.mp3'); 
      audio.play().catch(() => {}); 
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  function deleteMessage(messageText: string): void {
   
    const storedData = localStorage.getItem('soldierDashboard');
    
    if (storedData) {

      const messages: Message[] = JSON.parse(storedData);
      
     
      const updatedMessages = messages.filter(message => message.text !== messageText);
      
   
      localStorage.setItem('soldierDashboard', JSON.stringify(updatedMessages));
      const data  = localStorage.getItem('soldierDashboard')
  
      if(data){
        const mess: Message[] = JSON.parse(data)
        setMessages(mess)
      }
      
      console.log('Message deleted successfully!');
    } else {
      console.log('No data found in localStorage for soldierDashboard');
    }
  }
  function handleMessage(message: Message){
     socketRef.current.emit('urgentMessage',message)
     deleteMessage(message.text)
     
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Alert Messages Panel</h1>
        <span className={isConnected ? styles.statusOnline : styles.statusOffline}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </header>

      <div className={styles.alertsContainer}>
        {messages.map((message, index) => (
          <div key={index} className={styles.alertCard}>
            <div className={styles.alertHeader}>
              <span className={styles.alertTime}>
                {new Date(message.timestamp).toLocaleString()}
              </span>
              <div className={styles.alertBadge}>New Alert</div>
            </div>
            
            <div className={styles.alertContent}>
              <div className={styles.userInfo}>
                <div className={styles.user}>
                  <strong>Sender:</strong> {message.user1}
                </div>
                <div className={styles.user}>
                  <strong>Receiver:</strong> {message.user2}
                </div>
              </div>
              
              <div className={styles.messageText}>
                <strong>Message:</strong>
                <p>{message.text}</p>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button onClick={()=>handleMessage(message)}className={`${styles.button} ${styles.dangerButton}`}>
                Mark as Dangerous
              </button>
              <button onClick={()=>deleteMessage(message.text)}className={`${styles.button} ${styles.safeButton}`}>
                Mark as Safe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoldierDashboard;