import React, { useState } from 'react';
import { PlusCircle, Calendar, AlignLeft, Type, AlertCircle } from 'lucide-react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }

    if (title.trim().length > 100) {
      setErrorMsg('Title cannot be more than 100 characters');
      return;
    }

    setSubmitting(true);
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        isCompleted: false,
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      setIsExpanded(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-title-row">
          <div className="input-with-icon flex-1">
            <Type className="input-icon" size={18} />
            <input
              type="text"
              placeholder="What needs to be done? (Required, max 100 chars)"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value && !isExpanded) setIsExpanded(true);
              }}
              onFocus={() => setIsExpanded(true)}
              maxLength={100}
              className="task-title-input"
              required
            />
          </div>
          <span className={`char-counter ${title.length >= 90 ? 'limit-warning' : ''}`}>
            {title.length}/100
          </span>
        </div>

        {errorMsg && (
          <div className="form-error-inline">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {isExpanded && (
          <div className="form-expanded-fields animate-fade-down">
            <div className="form-group margin-top-sm">
              <label className="form-label">
                <AlignLeft size={15} /> Description (Optional)
              </label>
              <textarea
                placeholder="Add optional notes, links, or context details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="task-textarea"
              />
            </div>

            <div className="form-meta-row">
              <div className="form-group flex-1">
                <label className="form-label">
                  <Calendar size={15} /> Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="task-date-input"
                />
              </div>

              <div className="form-actions-right">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || !title.trim()}
                >
                  {submitting ? (
                    <span className="spinner-loader"></span>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      <span>Add Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
