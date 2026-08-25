import React from 'react';
import { ListTodo, CheckCircle2, Clock, Calendar } from 'lucide-react';

const Stats = ({ tasks, activeFilter, setActiveFilter }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-section">
      <div className="stats-cards-grid">
        <div
          className={`stat-card ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <div className="stat-icon-wrapper stat-all">
            <ListTodo size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div
          className={`stat-card ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          <div className="stat-icon-wrapper stat-pending">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div
          className={`stat-card ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          <div className="stat-icon-wrapper stat-completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card stat-card-progress">
          <div className="stat-icon-wrapper stat-progress">
            <Calendar size={22} />
          </div>
          <div className="stat-details flex-1">
            <div className="progress-header">
              <span className="stat-label">Progress</span>
              <span className="progress-percentage">{completionPercentage}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
