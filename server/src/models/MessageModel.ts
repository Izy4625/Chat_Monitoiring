// MessageModel.ts:
import mongoose, { Document } from 'mongoose';
export enum MessageDirection {
  Sent = 'sent',
  Received = 'received'
}
export interface IMessage  {
  
    content: string;
    timestamp: Date;
    direction?: MessageDirection
    
  
  }

export const MessageSchema = new mongoose.Schema({

    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    direction: {type: String}

 });
  
  MessageSchema.index({ isFlagged: 1, timestamp: -1 });
