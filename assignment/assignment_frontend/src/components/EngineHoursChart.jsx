import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PiEngineFill } from 'react-icons/pi'
import Card from './Card'
import { longDate, shortDate } from '../utils/helpers'

function EngineHoursChart({ data, loading }) {
  return (
    <Card icon={<PiEngineFill className="card-icon" />} title="Engine hours" loading={loading}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data || []} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
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
          <Tooltip labelFormatter={longDate} formatter={(value) => value + ' h'} cursor={{ fill: '#f5f5f5' }} />
          <Bar dataKey="ignition" name="Ignition" stackId="hours" fill="#00873e" barSize={24} />
          <Bar dataKey="idling" name="Idling" stackId="hours" fill="#f0973a" barSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default EngineHoursChart
