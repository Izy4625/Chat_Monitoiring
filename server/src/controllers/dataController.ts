import { Request, Response } from "express";
import User from "../models/UserModel";

// פונקציה לקבלת כל המשתמשים
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, 'name imageBase64 lastActive alerts'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// פונקציה לקבלת כל ההודעות החשודות למשתמש מסוים
export const getUserSuspiciousMessages = async (req: any, res: any): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, 'name alerts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suspicious messages' });
  }
};

// פונקציה לקבלת כל ההודעות
export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, 'alerts');
    const allMessages = users.flatMap(user => user.alerts || []);
    res.json(allMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all messages' });
  }
};

// פונקציה לקבלת סטטיסטיקות כלליות
export const getCommanderStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const suspiciousUsers = await User.countDocuments({ suspicious: true });
    const totalMessages = (await User.find({}, 'alerts')).reduce((sum, user) => sum + (user.alerts?.length || 0), 0);
    const suspiciousMessages = (await User.find({}, 'alerts')).reduce((sum, user) => sum + (user.alerts?.filter(alert => alert.direction === 'received').length || 0), 0);

    const stats = {
      totalUsers,
      suspiciousUsers,
      totalMessages,
      suspiciousMessages
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
