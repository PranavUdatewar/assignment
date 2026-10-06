function Card({ icon, title, badge, action, loading, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          {icon}
          <h3>{title}</h3>
        </div>
        {badge}
        {action}
      </div>
      <div className="card-body">
        {loading ? <div className="loader">Loading...</div> : children}
      </div>
    </div>
  )
}

export default Card
