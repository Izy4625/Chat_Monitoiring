import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import styles from './SelectUserChat.module.css';
import { fetchUsers } from '../../redux/slices/authSlice';
interface ChatUser  {
  id: string;
  name: string;
  imageBase64?: string 
}

const SelectUserChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.auth.users);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = useSelector((state: RootState) => {
    console.log('Full auth state:', state.auth);
    console.log('Current user:', state.auth.user);
    return state.auth.user;
  });
  

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user.id !== currentUser?.id && 
    typeof user.name === 'string' &&
    user.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  ) : [];

  const handleUserSelect = (selectedUser: ChatUser ) => {
    const roomId = [currentUser?.name, selectedUser.name].sort().join('_');
    
    navigate(`/ChatRoom/${roomId}`, { 
      state: { 
        userName: currentUser?.name,  
        name: selectedUser.name, 
        imageBase64: selectedUser.imageBase64     
      } 
    });
  };
  console.log(filteredUsers);

  return (
    <div className={styles.container}>
   
      <h2 className={styles.title}>Select User to Chat</h2>
      
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.userList}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div 
              key={user.id}
              className={styles.userItem}
            >
                <img 
                  src={user.imageBase64 ? user.imageBase64 : ''} 
                  alt={user.name}
                  className={styles.userAvatar} 
                />
              
              <span className={styles.userName}>{user.name}</span> 
              <button
                onClick={() => handleUserSelect(user)}  
                className={styles.chatButton}
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <div className={styles.emptyMessage}>
            {searchTerm ? 'No users found' : 'Loading users...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectUserChat;