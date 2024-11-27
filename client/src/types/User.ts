// User.ts:
export interface User {
  id: string;
  name: string;
  organization: string;     
  threatLevel: number;      
  createdAt: string;       
  lastActive?: string; 
  imageBase64?: string;   
}