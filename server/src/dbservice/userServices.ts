import User,{IUser} from "../models/UserModel";
import { IMessage } from "../models/MessageModel";
import { MessageDirection } from "../models/MessageModel";
  

 async function getAllSuspiciosUsers(){
    return await User.find({suspicious:true})
}
export const addMessageToUSer = async(name1:string,name2: string, message: IMessage):Promise<IUser[] | null>=>{
    try {
        const newMessage1: IMessage = {
            content: message.content,
            timestamp: message.timestamp,
            direction: MessageDirection.Sent
        }
        const newMessage2: IMessage = {
            content: message.content,
            timestamp: message.timestamp,
            direction: MessageDirection.Received
        }
        
      
        const updatedUser1 = await User.findOneAndUpdate(
          { name: name1 },  
          { $push: { alerts: newMessage1 },suspicious:true },  
          { new: true }  
        )
        const updatedUser2 = await User.findOneAndUpdate(
            { name: name2 },  
            { $push: { alerts: newMessage2 } ,suspicious:true},  
            { new: true }  
          )
          if(!updatedUser1 || !updatedUser2) return null
            
            const users = getAllSuspiciosUsers()
            return users

        ;}
        catch(err){
          console.log("couldnt find user1");
          return null
          
        }
}
