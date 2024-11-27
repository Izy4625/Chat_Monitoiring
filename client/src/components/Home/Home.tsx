import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["home-container"]}>
      <div className={styles["button-container"]}>
        <button
          onClick={() => navigate('/HomePage')}
          className={`${styles.button} ${styles.terrorist}`}
        >
          Chat login
        </button>
        <button
          onClick={() => navigate('/HomeArmy')}
          className={`${styles.button} ${styles.army}`}
        >
          Enter as Army
        </button>
      </div>
    </div>
  );
};

export default Home;

