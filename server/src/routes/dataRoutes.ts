import { Router } from "express";
import { getAllUsers, getUserSuspiciousMessages, getAllMessages, getCommanderStats } from "../controllers/dataController";

const dataRoutes = Router();

// נתיב לקבלת כל המשתמשים
dataRoutes.get("/users", getAllUsers);

// נתיב לקבלת כל ההודעות החשודות למשתמש מסוים
dataRoutes.get("/users/:userId/alerts", getUserSuspiciousMessages);

// נתיב לקבלת כל ההודעות
dataRoutes.get("/messages", getAllMessages);
// נתיב לקבלת סטטיסטיקות כלליות
dataRoutes.get("/commander/stats", getCommanderStats);

export default dataRoutes;
