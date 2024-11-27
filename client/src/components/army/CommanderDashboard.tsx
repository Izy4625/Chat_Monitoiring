import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import styles from './CommanderDashboard.module.css';

interface User {
  _id: string;
  name: string;
  imageBase64?: string;
  alerts?: any[];
  lastActive?: Date;
  suspicious?: boolean;
}

interface DashboardStats {
  totalUsers: number;
  suspiciousUsers: number;
  totalMessages: number;
  suspiciousMessages: number;
}

const CommanderDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Initialize Socket.io
  useEffect(() => {
    const socket: Socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinCommander', '12345');
    });

    socket.on('highAlertMessage', (alert: any) => {
      console.log('Received new suspicious alert:', alert);
      if (Array.isArray(alert)) {
        setAlerts((prevAlerts) => [...prevAlerts, ...alert]);
      } else {
        setAlerts((prevAlerts) => [...prevAlerts, alert]);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect(); // Cleanup function to properly disconnect socket
    };
  }, []);

  // Fetch dashboard stats from the server
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/commander/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch all users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch user details for selected user
  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/alerts`);
      const userDetails = await response.json();
      setSelectedUser((prevUser) => prevUser ? { ...prevUser, alerts: userDetails } : { _id: userId, name: '', alerts: userDetails });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Commander Dashboard</h1>
        <span className={isConnected ? styles.statusOnline : styles.statusOffline}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p>{stats?.totalUsers ?? 'Loading...'}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Suspicious Users</h3>
          <p>{stats?.suspiciousUsers ?? 'Loading...'}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Messages</h3>
          <p>{stats?.totalMessages ?? 'Loading...'}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Suspicious Messages</h3>
          <p>{stats?.suspiciousMessages ?? 'Loading...'}</p>
        </div>
      </div>

      {/* Alerts Section */}
      <div className={styles.alertsSection}>
        <h2>Real-time Alerts</h2>
        <div className={styles.alertsGrid}>
          {alerts.map((alert, index) => (
            <div key={index} className={styles.alertItem}>
              <p>{alert.content || alert.name}</p>
              <span>{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Cards */}
      <div className={styles.usersSection}>
        <h2>Suspicious Users</h2>
        <div className={styles.usersGrid}>
          {users.map((user) => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.userHeader}>
                <img 
                  src={user.imageBase64 || '/default-avatar.png'} 
                  alt={user.name} 
                  className={styles.userAvatar}
                />
                <h3>{user.name}</h3>
              </div>
              <div className={styles.userStats}>
                <p>Last Active: {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}</p>
                <p>Alerts: {user.alerts?.length ?? 0}</p>
              </div>
              <div className={styles.userActions}>
                <button 
                  onClick={() => fetchUserDetails(user._id)}
                  className={styles.viewButton}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedUser.name}</h2>
            </div>
            <div className={styles.modalBody}>
              <h3>Alerts History</h3>
              {selectedUser.alerts?.map((alert, index) => (
                <div key={index} className={styles.alertItem}>
                  <p>{alert.content}</p>
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setSelectedUser(null)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommanderDashboard;
