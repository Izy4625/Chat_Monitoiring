// socket.io.ts:
import { Socket } from "socket.io";
import {io} from "../app"
import { messageCheck } from "../services/messagesService";
import { addMessageToUSer } from "../dbservice/userServices";
import { IMessage } from "../models/MessageModel";
interface User {
    id: string;
    name: string;
    room: string;
}
interface Message {
    user1: string;
    user2: string;
    text: string;
    timestamp: Date;
  }
const users: User[] = [];
export const handleSocket = (socket: Socket) => {
   
    
    
    console.log('משתמש התחבר' + socket.id);
    socket.emit('mess', "you have connected to the server congrants")

    socket.on('click', (count: number) => {
       
    })
    socket.on('join', ({ userName, name}: { userName: string; name: string;}) => {
        const roomName = [userName, name].sort().join("_");
        console.log(roomName)
        const user1: User = {id: socket.id, name: userName, room: roomName}
        if(!users.some(user => user.name === user1.name)) {
            users.push(user1);
        }

      
        
        
        const user2: User = {id: socket.id, name, room: roomName}
        if(!users.some(user => user.name === user2.name)) {
            users.push(user2)
        }
    
        
        socket.join(roomName);
        const user3 = users.find(u=>u.name===userName);
    
        
        const user4 = users.find(u=>u.name === name)
        if(!user3|| !user4) return
        
    }); 
    socket.on('sendMessage', ({userName,roomid, message}: {userName: string, roomid:string,message: string}) => {
       
       const redFlag: boolean = messageCheck(message)
     
        const user = users.find(user => user.name === userName);
    
        
        if (user) {
            io.to(roomid).emit('message', { user: user.name, text: message });
        }
        if(redFlag && user){
        
            
            const Users = users.filter((u)=>u.room === user.room) 
            io.to('controlRoom').emit('alertMessage', {user1: Users[0].name, user2: Users[1].name,text: message})
           }
    });
    socket.on('joinSoldier',( name:string )=>{
        const soldier: User = {name,id:socket.id,room: "controlRoom"}
        console.log(soldier);
        
        socket.join('controlRoom')
       
        if(!users.some(user => user.name === soldier.name)) {
            users.push(soldier);
        }
        const soldier1 = users.find((u)=> u.name === name)
        if(!soldier1) return
        socket.emit('classifiedMessage', { user: 'מערכת', text: ` ${soldier1.name} joined the control Room ${soldier1.room}!` });
        socket.broadcast.to(soldier1.room).emit('classifiedMessage', { user: 'מערכת', text: `${soldier1.name} joined the room` });
    
        
    })
    socket.on('joinCommander',(id: string)=>{
        if(id === "12345"){
            console.log(id);
            
        socket.join('commanderRoom')}
    })
    socket.on('urgentMessage',async(message: Message)=>{
        console.log(message);
        
              const mess: IMessage = {
                content: message.text,
                timestamp: message.timestamp
              }
               const users = await addMessageToUSer(message.user1,message.user2,mess)
              console.log(users);
              
              io.to('commanderRoom').emit('highAlertMessage',users)
    })


   
    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            const user = users.splice(index, 1)[0];

            io.to(user.room).emit('roomData', { room: user.room, users: users.filter(u => u.room === user.room) });



        }})
    
}