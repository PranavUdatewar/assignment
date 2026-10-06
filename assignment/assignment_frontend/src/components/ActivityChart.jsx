import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { FaCar } from 'react-icons/fa'
import Card from './Card'

const colors = {
  ignition_off: '#981b25',
  ignition: '#008f45',
  idling: '#ee9433',
}

function ActivityChart({ data, loading }) {
  const items = data?.items || []
  const total = data?.total || 0

  return (
    <Card icon={<FaCar className="card-icon" />} title="Activity breakdown (Hours)" loading={loading}>
      <div className="activity">
        <div className="activity-chart">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={items}
                dataKey="hours"
                nameKey="label"
                innerRadius={78}
                outerRadius={125}
                startAngle={90}
                endAngle={-270}
                stroke="#f3d6e6"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {items.map((item) => (
                  <Cell key={item.status} fill={colors[item.status]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value + ' h'} />
            </PieChart>
          </ResponsiveContainer>
          <div className="activity-total">
            <h2>{total.toLocaleString()}</h2>
            <span>Hours</span>
          </div>
        </div>
        <ul className="legend">
          {items.map((item) => (
            <li key={item.status}>
              <span className="legend-dot" style={{ background: colors[item.status] }}></span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export default ActivityChart
