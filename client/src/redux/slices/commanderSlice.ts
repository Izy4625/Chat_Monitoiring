// redux/slices/commanderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  organization: string;
  threatLevel: number;
  suspiciousMessages: number;
  lastActive: string;
}

interface OrganizationStats {
  name: string;
  userCount: number;
  suspiciousCount: number;
}

interface Stats {
  totalMessages: number;
  suspiciousMessages: number;
  activeUsers: number;
  organizationsStats: OrganizationStats[];
}

interface CommanderState {
  users: User[];
  stats: Stats | null;
  loadingUsers: boolean;
  loadingStats: boolean;
  errorUsers: string | null;
  errorStats: string | null;
  selectedUser: User | null;
}

const initialState: CommanderState = {
  users: [],
  stats: null,
  loadingUsers: false,
  loadingStats: false,
  errorUsers: null,
  errorStats: null,
  selectedUser: null
};

// Thunk לטעינת משתמשים
export const fetchUsers = createAsyncThunk(
  'commander/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'role': 'commander'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat users');
      }

      const data = await response.json();
      return data.filter((user: User) => user.organization !== 'commander');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk לטעינת סטטיסטיקות
export const fetchStats = createAsyncThunk(
  'commander/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/commander/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk לעדכון רמת איום של משתמש
export const updateUserThreatLevel = createAsyncThunk(
  'commander/updateThreatLevel',
  async ({ userId, threatLevel }: { userId: string; threatLevel: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/commander/users/${userId}/threat-level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ threatLevel })
      });

      if (!response.ok) {
        throw new Error('Failed to update threat level');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const commanderSlice = createSlice({
  name: 'commander',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    // טיפול בטעינת משתמשים
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload as string;
      });

    // טיפול בטעינת סטטיסטיקות
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loadingStats = true;
        state.errorStats = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.errorStats = action.payload as string;
      });

    // טיפול בעדכון רמת איום
    builder
      .addCase(updateUserThreatLevel.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  }
});

export const { setSelectedUser, clearSelectedUser } = commanderSlice.actions;

// Selectors
export const selectAllUsers = (state: { commander: CommanderState }) => state.commander.users;
export const selectStats = (state: { commander: CommanderState }) => state.commander.stats;
export const selectLoadingUsers = (state: { commander: CommanderState }) => state.commander.loadingUsers;
export const selectLoadingStats = (state: { commander: CommanderState }) => state.commander.loadingStats;
export const selectErrorUsers = (state: { commander: CommanderState }) => state.commander.errorUsers;
export const selectErrorStats = (state: { commander: CommanderState }) => state.commander.errorStats;
export const selectSelectedUser = (state: { commander: CommanderState }) => state.commander.selectedUser;

export default commanderSlice.reducer;
