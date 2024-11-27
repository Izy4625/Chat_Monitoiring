// Message.ts:
export interface Message {
    id: string; // מזהה ייחודי של ההודעה
    senderId: string; // מזהה המשתמש ששלח את ההודעה
    receiverId: string; // מזהה המשתמש שמקבל את ההודעה
    content: string; // תוכן ההודעה
    timestamp: Date; // תאריך ושעה של שליחת ההודעה
    isFlagged?: boolean; // האם ההודעה סומנה כחשודה
    suspiciousWords?: string[]; // רשימת מילים חשודות שזוהו
    analyzedBy?: string; // מזהה החייל שניתח את ההודעה
  }
  