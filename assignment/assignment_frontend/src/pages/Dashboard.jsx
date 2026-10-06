import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Filters from '../components/Filters'
import DistanceChart from '../components/DistanceChart'
import EngineHoursChart from '../components/EngineHoursChart'
import ActivityChart from '../components/ActivityChart'
import MessagesChart from '../components/MessagesChart'
import DayOverview from '../components/DayOverview'
import { fetchAssets } from '../redux/slices/assetSlice'
import { fetchSummary } from '../redux/slices/dashboardSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const { filters, summary, summaryLoading, summaryError } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchAssets())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchSummary(filters))
  }, [dispatch, filters])

  return (
    <div className="container">
      <div className="page-header">
        <h1>Fleet Dashboard</h1>
        <Filters />
      </div>

      {summaryError && <p className="error">{summaryError}</p>}

      <div className="grid">
        <DistanceChart data={summary?.distance} loading={summaryLoading} />
        <EngineHoursChart data={summary?.engine_hours} loading={summaryLoading} />
        <ActivityChart data={summary?.activity} loading={summaryLoading} />
        <MessagesChart data={summary?.messages} loading={summaryLoading} />
      </div>

      <DayOverview />
    </div>
  )
}

export default Dashboard
