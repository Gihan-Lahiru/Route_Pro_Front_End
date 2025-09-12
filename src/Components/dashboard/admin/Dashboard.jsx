import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Monthly Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">Rs. 125,000</div>
          <div className="stat-change positive">+12.5% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Trips</h3>
            <span className="stat-icon">📍</span>
          </div>
          <div className="stat-value">1247</div>
          <div className="stat-change">+8 new today</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Travelers</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">892</div>
          <div className="stat-change">+5 new this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Drivers & Guides</h3>
            <span className="stat-icon">🚗</span>
          </div>
          <div className="stat-value">77</div>
          <div className="stat-change">45 drivers, 32 guides</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="revenue-chart">
          <h3>Revenue Trend (Last 5 Months)</h3>
          <div className="chart-container">
            <div className="chart-item">
              <span className="month">Jan</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "68%" }}></div>
              </div>
              <span className="amount">Rs. 85K</span>
            </div>
            <div className="chart-item">
              <span className="month">Feb</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "74%" }}></div>
              </div>
              <span className="amount">Rs. 92K</span>
            </div>
            <div className="chart-item">
              <span className="month">Mar</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "84%" }}></div>
              </div>
              <span className="amount">Rs. 105K</span>
            </div>
            <div className="chart-item">
              <span className="month">Apr</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "94%" }}></div>
              </div>
              <span className="amount">Rs. 118K</span>
            </div>
            <div className="chart-item">
              <span className="month">May</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "100%" }}></div>
              </div>
              <span className="amount">Rs. 125K</span>
            </div>
          </div>
        </div>

        <div className="recent-trips">
          <h3>Recent Trips</h3>
          <div className="trip-item">
            <div className="trip-info">
              <div className="trip-id">
                <span className="trip-code">TR001</span>
                <span className="trip-status completed">completed</span>
              </div>
              <div className="trip-details">
                <div className="traveler">John Doe</div>
                <div className="route">Kandy - Sigiriya</div>
              </div>
            </div>
            <div className="trip-meta">
              <div className="trip-amount">Rs. 15,000</div>
              <div className="trip-staff">Driver: Kasun Silva, Guide: Nimal Perera</div>
            </div>
          </div>

          <div className="trip-item">
            <div className="trip-info">
              <div className="trip-id">
                <span className="trip-code">TR002</span>
                <span className="trip-status ongoing">ongoing</span>
              </div>
              <div className="trip-details">
                <div className="traveler">Jane Smith</div>
                <div className="route">Colombo - Galle</div>
              </div>
            </div>
            <div className="trip-meta">
              <div className="trip-amount">Rs. 12,000</div>
              <div className="trip-staff">Driver: Sunil Fernando</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
