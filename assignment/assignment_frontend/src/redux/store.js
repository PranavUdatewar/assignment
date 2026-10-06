import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './slices/assetSlice'
import dashboardReducer from './slices/dashboardSlice'

const store = configureStore({
  reducer: {
    assets: assetReducer,
    dashboard: dashboardReducer,
  },
})

export default store
