import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Edit3, Trash2, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const isOverdue = (dateStr, isCompleted) => {
    if (!dateStr || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    return due < today;
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await onToggleComplete(task._id, !task.isCompleted);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      try {
        // Drops item from local UI state array ONLY after receiving a successful deletion code response (HTTP 200)
        await onDelete(task._id);
      } catch (err) {
        console.error('Deletion failed on server:', err);
        setIsDeleting(false);
      }
    }
  };

  const overdue = isOverdue(task.dueDate, task.isCompleted);
  const formattedDueDate = formatDate(task.dueDate);

  return (
    <div
      className={`task-card ${task.isCompleted ? 'completed' : ''} ${
        overdue ? 'overdue-card' : ''
      } ${isDeleting ? 'deleting-state' : ''}`}
    >
      <div className="task-card-header">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`complete-toggle-btn ${task.isCompleted ? 'is-checked' : ''}`}
          aria-label={task.isCompleted ? 'Mark task incomplete' : 'Mark task complete'}
        >
          {isToggling ? (
            <span className="spinner-loader-small"></span>
          ) : task.isCompleted ? (
            <CheckCircle2 className="toggle-icon checked-icon" size={22} />
          ) : (
            <Circle className="toggle-icon unchecked-icon" size={22} />
          )}
        </button>

        <h3 className="task-title" title={task.title}>
          {task.title}
        </h3>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-due-badge-wrapper">
          {formattedDueDate ? (
            <div className={`due-badge ${overdue ? 'due-overdue' : 'due-normal'}`}>
              {overdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
              <span>{formattedDueDate}</span>
            </div>
          ) : (
            <span className="no-due-date">No due date</span>
          )}
        </div>

        <div className="task-card-actions">
          <button
            onClick={() => onEdit(task)}
            className="action-btn edit-btn"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="action-btn delete-btn"
            title="Delete Task"
            aria-label="Delete Task"
          >
            {isDeleting ? (
              <span className="spinner-loader-small"></span>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
