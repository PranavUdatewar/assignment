import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCalendarAlt, FaFilter, FaTractor } from 'react-icons/fa'
import Card from './Card'
import { fetchDayOverview } from '../redux/slices/dashboardSlice'
import { statusColors, statusLabels, toDateString } from '../utils/helpers'

function DayOverview() {
  const dispatch = useDispatch()
  const { dayOverview, dayLoading, dayError } = useSelector((state) => state.dashboard)
  const assets = useSelector((state) => state.assets.list)

  const [date, setDate] = useState(toDateString(new Date()))
  const [assetId, setAssetId] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    dispatch(fetchDayOverview({ date, asset_id: assetId }))
  }, [dispatch, date, assetId])

  const startHour = dayOverview?.start_hour || 0
  const endHour = dayOverview?.end_hour || 24
  const totalMinutes = (endHour - startHour) * 60

  const hours = []
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push(hour)
  }

  const position = (minute) => ((minute - startHour * 60) / totalMinutes) * 100

  const filterButton = (
    <div className="day-filter">
      <button type="button" className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
        <FaFilter />
      </button>
      {showFilter && (
        <div className="filter-popup">
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Asset</label>
            <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              <option value="">All assets</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Card
      icon={<FaCalendarAlt className="card-icon" />}
      title="Day overview"
      action={filterButton}
      loading={dayLoading && !dayOverview}
    >
      {dayError && <p className="error">{dayError}</p>}

      <div className="day-overview">
        <div className="day-head">
          <div className="day-assets">Assets ({dayOverview?.assets.length || 0})</div>
          <div className="day-hours">
            {hours.map((hour) => (
              <span key={hour} style={{ left: position(hour * 60) + '%' }}>
                {String(hour).padStart(2, '0')}:00
              </span>
            ))}
          </div>
        </div>

        {dayOverview?.assets.map((asset) => (
          <div className="day-row" key={asset.id}>
            <div className="day-asset">
              <div className="asset-name">
                <FaTractor className="asset-icon" />
                <span>{asset.name}</span>
              </div>
              <div className="asset-percentages">
                {asset.percentages.map((item) => (
                  <span key={item.status} title={statusLabels[item.status]}>
                    <i style={{ background: statusColors[item.status] }}></i>
                    {item.value}%
                  </span>
                ))}
              </div>
            </div>
            <div className="day-track">
              {hours.map((hour) => (
                <div key={hour} className="grid-line" style={{ left: position(hour * 60) + '%' }}></div>
              ))}
              {asset.timeline.map((item, index) => (
                <div
                  key={index}
                  className="segment"
                  title={`${statusLabels[item.status]}: ${item.from} - ${item.to}`}
                  style={{
                    left: position(item.start) + '%',
                    width: ((item.end - item.start) / totalMinutes) * 100 + '%',
                    background: statusColors[item.status],
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}

        {dayOverview && dayOverview.assets.every((asset) => asset.timeline.length === 0) && (
          <p className="empty">No activity found for this day.</p>
        )}
      </div>

      <div className="day-legend">
        {Object.keys(statusLabels).map((status) => (
          <span key={status}>
            <i style={{ background: statusColors[status] }}></i>
            {statusLabels[status]}
          </span>
        ))}
      </div>
    </Card>
  )
}

export default DayOverview
