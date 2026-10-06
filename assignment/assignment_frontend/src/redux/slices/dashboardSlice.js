import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { daysAgo, toDateString } from '../../utils/helpers'

export const fetchSummary = createAsyncThunk('dashboard/fetchSummary', async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get('/dashboard/summary', { params: filters })
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to load dashboard')
  }
})

export const fetchDayOverview = createAsyncThunk('dashboard/fetchDayOverview', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/dashboard/day-overview', { params })
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to load day overview')
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    filters: {
      from: daysAgo(13),
      to: toDateString(new Date()),
      asset_id: '',
    },
    summary: null,
    summaryLoading: false,
    summaryError: null,
    dayOverview: null,
    dayLoading: false,
    dayError: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.summaryLoading = true
        state.summaryError = null
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summaryLoading = false
        state.summary = action.payload
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summaryLoading = false
        state.summaryError = action.payload
      })
      .addCase(fetchDayOverview.pending, (state) => {
        state.dayLoading = true
        state.dayError = null
      })
      .addCase(fetchDayOverview.fulfilled, (state, action) => {
        state.dayLoading = false
        state.dayOverview = action.payload
      })
      .addCase(fetchDayOverview.rejected, (state, action) => {
        state.dayLoading = false
        state.dayError = action.payload
      })
  },
})

export const { setFilters } = dashboardSlice.actions

export default dashboardSlice.reducer
