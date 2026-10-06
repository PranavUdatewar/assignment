import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../redux/slices/dashboardSlice'

function Filters() {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.dashboard.filters)
  const assets = useSelector((state) => state.assets.list)
  const [form, setForm] = useState(filters)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.from > form.to) {
      setError('End date should be greater than start date.')
      return
    }

    setError('')
    dispatch(setFilters(form))
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="field">
        <label>From</label>
        <input type="date" name="from" value={form.from} onChange={handleChange} />
      </div>
      <div className="field">
        <label>To</label>
        <input type="date" name="to" value={form.to} onChange={handleChange} />
      </div>
      <div className="field">
        <label>Asset</label>
        <select name="asset_id" value={form.asset_id} onChange={handleChange}>
          <option value="">All assets</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Apply</button>
      {error && <span className="error">{error}</span>}
    </form>
  )
}

export default Filters
