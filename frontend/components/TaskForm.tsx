'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK, GET_TASKS } from '@/lib/graphql';
import { CreateTaskForm } from '@/types';
import { Save, X } from 'lucide-react';

interface TaskFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TaskForm({ projectId, onSuccess, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskForm>({
    title: '',
    description: '',
    status: 'TODO',
    assigneeEmail: '',
    dueDate: '',
  });

  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          projectId,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          assigneeEmail: formData.assigneeEmail,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        },
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        assigneeEmail: '',
        dueDate: '',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="modern-card animate-fade-in-up">
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Create New Task
        </h3>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Add a new task to keep your project moving forward</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium">{error.message}</p>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input w-full px-4 py-3 text-gray-900 placeholder-gray-500"
            placeholder="Enter an engaging task title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input w-full px-4 py-3 text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe what needs to be accomplished..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE' })}
              className="form-input w-full px-4 py-3 text-gray-900"
            >
              <option value="TODO">📋 To Do</option>
              <option value="IN_PROGRESS">⚡ In Progress</option>
              <option value="DONE">✅ Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="assigneeEmail" className="block text-sm font-bold text-gray-700 mb-2">
              Assignee Email
            </label>
            <input
              type="email"
              id="assigneeEmail"
              value={formData.assigneeEmail}
              onChange={(e) => setFormData({ ...formData, assigneeEmail: e.target.value })}
              className="form-input w-full px-4 py-3 text-gray-900 placeholder-gray-500"
              placeholder="assignee@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700 mb-2">
            ⏰ Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="form-input w-full px-4 py-3 text-gray-900"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.title}
            className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? '⚡ Creating...' : '🚀 Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
