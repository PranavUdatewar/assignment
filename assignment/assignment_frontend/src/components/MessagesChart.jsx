import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FaCommentDots } from 'react-icons/fa'
import Card from './Card'
import { longDate, shortDate, shortNumber } from '../utils/helpers'

function MessagesChart({ data, loading }) {
  return (
    <Card icon={<FaCommentDots className="card-icon" />} title="Messages received" loading={loading}>
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
          <YAxis
            tickFormatter={shortNumber}
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={longDate}
            formatter={(value) => value.toLocaleString()}
            cursor={{ fill: '#f5f5f5' }}
          />
          <Bar dataKey="count" name="Messages" fill="#cf6d21" barSize={28} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MessagesChart
