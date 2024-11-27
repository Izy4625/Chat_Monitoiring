// UserModel.ts:
import mongoose, { Document, Schema, Model } from "mongoose";

// Enum for Message Direction
export enum MessageDirection {
  Sent = 'sent',
  Received = 'received'
}

// Message Interface
export interface IMessage {
  content: string;           // The content of the message
  timestamp: Date;           // The time when the message was created
  direction?: MessageDirection; // Direction of the message (sent/received)
}

// Message Schema
export const MessageSchema = new mongoose.Schema<IMessage>({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  direction: { type: String, enum: [MessageDirection.Sent, MessageDirection.Received] }
});

// User Interface
export interface IUser extends Document {
  name: string;             // User's name
  password: string;         // User's password (hashed)
  address?: string;         // User's address (optional)
  alerts?: IMessage[];      // List of alerts (messages)
  createdAt: Date;          // Date when user was created
  lastActive?: Date;        // Last activity time (optional)
  imageBase64?: string;     // Image data for the user (optional)
  suspicious?: boolean
}

// User Model Interface
export interface IUserModel extends Model<IUser> {}

// User Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: '' },   // Set default value for optional address
  alerts: { type: [MessageSchema], default: [] },  // Array of messages for alerts
  createdAt: { type: Date, default: Date.now },
  imageBase64: { type: String, default: '' },
  suspicious: {type: Boolean, default: false}
});

// Indexes can be added as needed
userSchema.index({ name: 1 });

export default mongoose.model<IUser, IUserModel>("User", userSchema);
