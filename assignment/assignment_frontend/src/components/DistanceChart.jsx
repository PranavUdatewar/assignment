import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaRoute } from 'react-icons/fa'
import Card from './Card'
import { longDate, shortDate } from '../utils/helpers'

function DistanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const current = payload.find((item) => item.dataKey === 'current')
  const previous = payload.find((item) => item.dataKey === 'previous')

  return (
    <div className="chart-tooltip">
      <p className="tooltip-date">{longDate(label)}</p>
      <p>
        <span className="dot" style={{ background: '#c9671c' }}></span>
        Current Period: <b>{current?.value} Km</b>
      </p>
      <p>
        <span className="dot" style={{ background: '#dfa47a' }}></span>
        Previous Period: <b>{previous?.value} Km</b>
      </p>
    </div>
  )
}

function DistanceChart({ data, loading }) {
  const change = data?.change || 0

  const badge = data && (
    <span className={change >= 0 ? 'badge badge-up' : 'badge badge-down'}>
      {change >= 0 ? '+' : ''}
      {change}%
    </span>
  )

  return (
    <Card
      icon={<FaRoute className="card-icon" />}
      title={`Traveled distance (${data?.total ?? 0}km)`}
      badge={badge}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data?.items || []} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="6 4" vertical={false} stroke="#e6e6e6" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            angle={-45}
            textAnchor="end"
            height={50}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
          <Tooltip content={<DistanceTooltip />} />
          <Area
            type="monotone"
            dataKey="previous"
            stroke="#e5c2a6"
            strokeDasharray="5 5"
            strokeWidth={2}
            fill="#f7eee8"
            fillOpacity={0.7}
            dot={{ r: 3, fill: '#e5c2a6', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="current"
            stroke="#c9671c"
            strokeWidth={3}
            fill="#dfa47a"
            fillOpacity={0.8}
            dot={{ r: 4, fill: '#c9671c', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default DistanceChart
