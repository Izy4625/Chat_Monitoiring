// authControllers.ts:
import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface DTO {
    message: string;
    data?: any;
    success: boolean;
  }

export const register = async (req: Request, res: Response): Promise<void> => {
    try {

        const { name, password, imageBase64 } = req.body;

        if (!name|| !password) {
            res.status(400).json({message: "Missing required fields", success: false});
            return;
        }

        const existingUser = await User.findOne({ name }); 

        if (existingUser) {
            res.status(400).json({ message: "User name already exists" , data: { name }, success: false});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            password: hashedPassword,
            imageBase64
           
        });

        const response: DTO = {
            message: "User created successfully",
            success: true,
            data: user,
          };
        console.log(response);
        
        

        res.status(201).json(response);
        return

    } catch (error) { 
        res.status(500).json({ message: "Failed to save user", success: false });
        return
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Login request body:', req.body);  
        const { name, password } = req.body;  

        if (!name || !password) {
            res.status(400).json({ message: "Missing required fields", success: false });
            return;
        }
        
        
        const user = await User.findOne({ name });

        if (!user) {
            res.status(401).json({ message: "Invalid username", success: false });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid username or password", success: false });
            return;
        }

        const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "5h" });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.name,
                createdAt: user.createdAt,
                imageBase64: user.imageBase64
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed", success: false });
    }
};
export const logout = (req: Request, res: Response): void => {
    try {
        res.clearCookie("auth_token");
        res.status(200).json({ message: "Logout successful", success: true });
        return
    } catch (error) {
        res.status(500).json({ message: "Failed to logout" , success: false});
        return
    }
  
};

