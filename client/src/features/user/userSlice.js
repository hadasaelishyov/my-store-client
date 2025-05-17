// User slice for Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../utils/api'

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.user.login(credentials)
      // Save user data in localStorage for persistent login
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.user.register(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.user.getProfile(userId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await apiService.user.updateProfile(userId, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Get stored user from localStorage
const storedUser = JSON.parse(localStorage.getItem('user')) || null

// Initial state
const initialState = {
  currentUser: storedUser,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  registrationStatus: 'idle',
  registrationError: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null
      state.status = 'idle'
      // Remove user from localStorage
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    clearRegistrationStatus: (state) => {
      state.registrationStatus = 'idle'
      state.registrationError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentUser = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
      })
      
      // Handle registerUser
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = 'loading'
        state.registrationError = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationStatus = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = 'failed'
        state.registrationError = action.payload || 'Registration failed'
      })
      
      // Handle getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to get user profile'
      })
      
      // Handle updateUserProfile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        }
      })
  },
})

// Export actions and reducer
export const { logout, clearError, clearRegistrationStatus } = userSlice.actions
export default userSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser
export const selectUserStatus = (state) => state.user.status
export const selectUserError = (state) => state.user.error
export const selectRegistrationStatus = (state) => state.user.registrationStatus
export const selectRegistrationError = (state) => state.user.registrationError