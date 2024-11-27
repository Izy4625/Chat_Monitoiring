import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { Organization } from '../../types/Organization';


interface AnalyticsState {
  suspiciousUsers: User[];
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  suspiciousUsers: [],
  organizations: [],
  loading: false,
  error: null,
};

// פעולה אסינכרונית לקבלת משתמשים חשודים
export const fetchSuspiciousUsers = createAsyncThunk(
  'analytics/fetchSuspiciousUsers',
  async () => {
    const response = await fetch('/api/analytics/suspicious-users');
    return response.json();
  }
);

// פעולה אסינכרונית לקבלת נתוני ארגונים
export const fetchOrganizations = createAsyncThunk(
  'analytics/fetchOrganizations',
  async () => {
    const response = await fetch('/api/analytics/organizations');
    return response.json();
  }
);

// יצירת הסלייס
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuspiciousUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuspiciousUsers.fulfilled, (state, action: PayloadAction<{ users: User[] }>) => {
        state.loading = false;
        state.suspiciousUsers = action.payload.users;
      })
      .addCase(fetchSuspiciousUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch suspicious users failed';
      })
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action: PayloadAction<{ organizations: Organization[] }>) => {
        state.loading = false;
        state.organizations = action.payload.organizations;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch organizations failed';
      });
  },
});

export default analyticsSlice.reducer;
