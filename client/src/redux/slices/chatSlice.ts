// chatSlice.ts:
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types/Message';


interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

// פעולה אסינכרונית לשליחת הודעה
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { content: string; receiverId: string }) => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

// פעולה אסינכרונית לקבלת הודעות
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId: string ) => {
    const response = await fetch(`/api/messages/${userId}`);
    return response.json();
  }
);

// יצירת הסלייס
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{ message: Message }>) => {
        state.loading = false;
        state.messages.push(action.payload.message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Send message failed';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{ messages: Message[] }>) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch messages failed';
      });
  },
});

export default chatSlice.reducer;
