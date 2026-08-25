import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './services/api';

import AuthModal from './components/Auth/AuthModal';
import Header from './components/Dashboard/Header';
import Stats from './components/Dashboard/Stats';
import TaskForm from './components/Tasks/TaskForm';
import TaskCard from './components/Tasks/TaskCard';
import EditTaskModal from './components/Tasks/EditTaskModal';
import SkeletonLoader from './components/UI/SkeletonLoader';
import NotificationBar from './components/UI/NotificationBar';
import { CheckSquare, RefreshCw } from 'lucide-react';

const DashboardContent = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/tasks';
      if (activeFilter === 'completed') endpoint = '/tasks?completed=true';
      if (activeFilter === 'pending') endpoint = '/tasks?completed=false';

      const res = await api.get(endpoint);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      showNotification('error', err.response?.data?.message || 'Could not load tasks from server');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (newTaskData) => {
    try {
      const res = await api.post('/tasks', newTaskData);
      setTasks((prev) => [res.data, ...prev]);
      showNotification('success', 'Task created successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      showNotification('error', msg);
      throw new Error(msg);
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      const res = await api.patch(`/tasks/${taskId}`, { isCompleted });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
      showNotification(
        'success',
        isCompleted ? 'Task marked as completed' : 'Task marked as active'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task status';
      showNotification('error', msg);
      throw err;
    }
  };

  const handleSaveEdit = async (taskId, updatedData) => {
    try {
      const res = await api.patch(`/tasks/${taskId}`, updatedData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
      showNotification('success', 'Task updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task updates';
      showNotification('error', msg);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      // Drop item from local UI state array ONLY AFTER receiving a successful 200 response
      if (res.status === 200) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        showNotification('success', res.data.message || 'Task deleted successfully');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task from server database';
      showNotification('error', msg);
      throw err;
    }
  };

  // Client-side search filtering
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = t.title.toLowerCase().includes(query);
    const descMatch = t.description ? t.description.toLowerCase().includes(query) : false;
    return titleMatch || descMatch;
  });

  return (
    <div className="dashboard-layout">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="main-content-container">
        <NotificationBar
          notification={notification}
          onClose={() => setNotification(null)}
        />

        <Stats
          tasks={tasks}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <TaskForm onAddTask={handleAddTask} />

        <section className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">
              {activeFilter === 'all' && 'All Tasks'}
              {activeFilter === 'pending' && 'Pending Tasks'}
              {activeFilter === 'completed' && 'Completed Tasks'}
              <span className="task-count-pill">{filteredTasks.length}</span>
            </h2>

            <button
              onClick={fetchTasks}
              className="btn-icon-secondary"
              title="Refresh Tasks"
              aria-label="Refresh Tasks"
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            </button>
          </div>

          {loading ? (
            <SkeletonLoader count={6} />
          ) : filteredTasks.length === 0 ? (
            <div className="empty-tasks-card">
              <CheckSquare size={48} className="empty-icon" />
              <h3>No tasks found</h3>
              <p>
                {searchQuery
                  ? `No tasks match "${searchQuery}"`
                  : activeFilter !== 'all'
                  ? `No ${activeFilter} tasks in your list.`
                  : "You haven't created any tasks yet. Add one above to get started!"}
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Initializing TaskManager Secure Session...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Initializing TaskManager Secure Session...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const MainRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthModal initialMode="login" />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthModal initialMode="signup" />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
