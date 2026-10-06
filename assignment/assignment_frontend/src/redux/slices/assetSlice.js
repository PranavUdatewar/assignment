import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/assets')
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to load assets')
  }
})

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default assetSlice.reducer
