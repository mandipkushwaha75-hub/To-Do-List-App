import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Type, AlertCircle, Save } from 'lucide-react';

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      // Format date to YYYY-MM-DD for <input type="date">
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        const formattedDate = d.toISOString().split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
      setIsCompleted(Boolean(task.isCompleted));
    }
  }, [task]);

  if (!isOpen || !task) return null;

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
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        isCompleted,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-heading"
      >
        <div className="modal-header">
          <h2 id="edit-task-heading" className="modal-title">Edit Task</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="form-error-inline margin-bottom-md">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <div className="label-with-counter">
              <label htmlFor="edit-title" className="form-label">
                <Type size={15} /> Title
              </label>
              <span className={`char-counter ${title.length >= 90 ? 'limit-warning' : ''}`}>
                {title.length}/100
              </span>
            </div>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="task-title-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              <AlignLeft size={15} /> Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="task-textarea"
              placeholder="Task details..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-duedate" className="form-label">
              <Calendar size={15} /> Due Date
            </label>
            <input
              id="edit-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="task-date-input"
            />
          </div>

          <div className="form-group checkbox-form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="checkbox-input"
              />
              <span>Mark as completed</span>
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="spinner-loader"></span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
