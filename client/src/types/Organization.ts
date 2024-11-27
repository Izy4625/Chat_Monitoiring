export interface Organization {
    id: string; // מזהה ייחודי של הארגון
    name: string; // שם הארגון
    threatLevel: number; // רמת איום של הארגון
    keywords: string[]; // מילות מפתח המזוהות עם הארגון
    memberCount: number; // כמות המשתמשים המשויכים לארגון
  }
  