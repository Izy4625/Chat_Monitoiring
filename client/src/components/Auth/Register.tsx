// Register.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import styles from './Register.module.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {  error } = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser({ name: name, password, imageBase64: imageFile  })).unwrap();
      if (result) {
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Register</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
        <label className={styles.label}>Profile Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.input}
        />
      </div>
      {imageFile && (
        <img 
          src={imageFile} 
          alt="Preview" 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
        />
      )}
          
          <button 
            type="submit" 
            className={styles.button}
            
          >
           Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;