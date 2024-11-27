// BlackListModel.ts:
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBlackList extends Document {
  words: string[];
}

export interface IBlackListModel extends Model<IBlackList> { }

const blackListSchema = new Schema<IBlackList>({
  words: { type: [String], required: true, default: [] }, 
});

export default mongoose.model<IBlackList, IBlackListModel>("BlackList", blackListSchema);
