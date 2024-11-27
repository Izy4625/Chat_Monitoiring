import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinkArmy.module.css'; 

const HomeArmy = () => {
  const navigate = useNavigate(); 

  return (
    <div className={styles['home-container']}>
      <div className={styles['button-container']}>
        <button onClick={() => navigate('/soldier')}className={styles.btn} >
          Soldier Dashboard
        </button>
        <button onClick={() => navigate('/commander')}className={styles.btn} >
          Commander Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomeArmy;
