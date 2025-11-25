import React, { useState, useEffect } from 'react';
import { Search, Plus, LogOut, Mail, CheckCircle, Circle, Trash2, Edit2, Save, AlertCircle } from 'lucide-react';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Login Component
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    sessionStorage.setItem('userSession', JSON.stringify({ email, loggedIn: true }));
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Please login to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo: Use any email & password
        </p>
      </div>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ onAddTask, onCancel, editTask, onUpdateTask }) => {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [priority, setPriority] = useState(editTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(editTask?.dueDate || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: editTask?.completed || false,
    };

    if (editTask) {
      onUpdateTask({ ...taskData, id: editTask.id, createdAt: editTask.createdAt });
    } else {
      onAddTask(taskData);
    }

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {editTask ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task title..."
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows="3"
            placeholder="Describe your task..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {editTask ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editTask ? 'Update Task' : 'Add Task'}
          </button>
          {(editTask || onCancel) && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className={`bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition border-l-4 ${
      task.completed ? 'border-green-500 opacity-75' : 'border-purple-500'
    }`}>
      <div className="flex items-start gap-4">
        <button onClick={() => onToggle(task.id)} className="mt-1 flex-shrink-0">
          {task.completed ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-purple-500 transition" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className={`text-sm mb-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full font-semibold border ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
            <span className="text-gray-500">
              📅 {new Date(task.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-3 font-semibold">Delete this task permanently?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onDelete(task.id); setShowConfirm(false); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [emailLog, setEmailLog] = useState([]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) setIsLoggedIn(true);
    const savedTasks = sessionStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    if (tasks.length > 0) sessionStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const checkPendingTasks = () => {
      const pending = tasks.filter(t => !t.completed);
      if (pending.length > 0) {
        const msg = `[${new Date().toLocaleTimeString()}] 📧 Email: ${pending.length} pending - "${pending[0].title}"${pending.length > 1 ? ` +${pending.length - 1} more` : ''}`;
        setEmailLog(prev => [...prev, msg]);
        console.log(msg);
      }
    };
    checkPendingTasks();
    const interval = setInterval(checkPendingTasks, 1200000);
    return () => clearInterval(interval);
  }, [tasks, isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setTasks([]);
  };

  const addTask = (taskData) => {
    setTasks(prev => [{ ...taskData, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
    setShowForm(false);
  };

  const updateTask = (updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTask(null);
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const handleEdit = (task) => { setEditingTask(task); setShowForm(false); };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
    }
    return true;
  });

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-sm text-gray-600">Stay organized, stay productive</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 font-semibold">Total</div>
            <div className="text-3xl font-bold text-purple-600">{tasks.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
            <div className="text-sm text-gray-600 font-semibold">Completed</div>
            <div className="text-3xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 font-semibold">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{tasks.filter(t => !t.completed).length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
            <div className="text-sm text-gray-600 font-semibold">High Priority</div>
            <div className="text-3xl font-bold text-red-600">{tasks.filter(t => t.priority === 'high').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 transition font-semibold"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 transition font-semibold"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={() => { setShowForm(!showForm); setEditingTask(null); }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </div>
        </div>

        {(showForm || editingTask) && (
          <div className="mb-8">
            <TaskForm
              onAddTask={addTask}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
              editTask={editingTask}
              onUpdateTask={updateTask}
            />
          </div>
        )}

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-purple-100">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {tasks.length === 0 ? "Create your first task!" : "Try different filters"}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEdit} />
            ))
          )}
        </div>

        {emailLog.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg">Email Notification Log</h3>
            </div>
            <div className="space-y-2">
              {emailLog.slice(-5).reverse().map((log, i) => (
                <div key={i} className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg font-mono">{log}</div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;