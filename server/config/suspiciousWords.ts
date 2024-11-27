export const suspiciousWords = [
    'bomb',
    'attack',
    'weapon',
   
];
  
export const terrorOrganizations = [
    'Hamas',
    'ISIS',
   
  ];
  
  export interface AlertData {
    messageId: string;
    senderId: string;
    senderName: string;
    senderOrganization: string;
    receiverId: string;
    receiverName: string;
    content: string;
    suspiciousWords: string[];
    timestamp: Date;
    threatLevel: number;
  }