import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Page.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles['home-container']}>
      <div className={styles['button-container']}>
        <button onClick={() => navigate('/login')} className={styles.btn}>
          Login
        </button>
        <button onClick={() => navigate('/register')} className={styles.btn}>
          Register
        </button>
      </div>
    </div>
  );
};

export default HomePage;
