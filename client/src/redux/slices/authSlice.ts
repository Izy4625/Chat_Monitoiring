// authSlice.ts:
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';


interface AuthState {
  user: User | null; 
  token: string | null; 
  role: 'soldier' | 'commander' | null;
  users: User[] | null; 
  loading: boolean; 
  error: string | null; 
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  users: [] ,
  loading: false,
  error: null,
};
interface RegisterParams {
  name: string;
  password: string;
  imageBase64?: string;
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { name: string; password: string }) => {  
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterParams) => {
      const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify(data),
      });
      return response.json();
  }
);

// פעולה אסינכרונית להבאת רשימת המשתמשים
export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const response = await fetch('http://localhost:3000/api/users', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Response from server:', response);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  console.log('Users data:', data); 
  return data;
});

// יצירת ה-Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // רישום משתמש
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ 
        message: string;
        success: boolean;
        data: {
            user: User & { imageBase64?: string }; 
            token: string;
        }
      }>) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // התחברות משתמש
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.success) {
            const user = action.payload.user;
            state.loading = false;
            state.user = {
                ...user,
                name: user.username  
            };
            state.token = action.payload.token;
            state.error = null;
        }
    })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // הבאת רשימת משתמשים
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
