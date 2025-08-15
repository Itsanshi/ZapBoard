'use client';

import { Task } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { X, Calendar, User, Building2, FolderOpen, Clock, CheckCircle2 } from 'lucide-react';
import TaskComments from './TaskComments';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  if (!isOpen) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'status-completed';
      case 'IN_PROGRESS':
        return 'status-active';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="modern-card max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {task.title}
            </h1>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center px-3 py-2 rounded-lg" style={{ 
                color: 'var(--text-secondary)', 
                backgroundColor: 'var(--surface-secondary)' 
              }}>
                <Building2 className="w-4 h-4 mr-2 text-indigo-500" />
                {task.project.organization.name}
              </span>
              <span className="flex items-center px-3 py-2 rounded-lg" style={{ 
                color: 'var(--text-secondary)', 
                backgroundColor: 'var(--surface-secondary)' 
              }}>
                <FolderOpen className="w-4 h-4 mr-2 text-indigo-500" />
                {task.project.name}
              </span>
              <div className={cn('px-4 py-2 rounded-lg font-bold flex items-center space-x-2 status-badge', getStatusStyle(task.status))}>
                {getStatusIcon(task.status)}
                <span>{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-110"
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--text-muted)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex max-h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {/* Description */}
            {task.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center">
                  📝 Description
                </h3>
                <div className="modern-card p-6">
                  <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                </div>
              </div>
            )}

            {/* Task Details */}
            <div className="mb-8">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center">
                ℹ️ Details
              </h3>
              <div className="modern-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {task.assigneeEmail && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border" style={{ 
                      backgroundColor: 'var(--surface-secondary)', 
                      borderColor: 'var(--border)' 
                    }}>
                      <User className="w-5 h-5 text-indigo-500" />
                      <div>
                        <span className="text-sm block" style={{ color: 'var(--text-muted)' }}>Assignee</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{task.assigneeEmail}</span>
                      </div>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border" style={{ 
                      backgroundColor: 'var(--surface-secondary)', 
                      borderColor: 'var(--border)' 
                    }}>
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <div>
                        <span className="text-sm block" style={{ color: 'var(--text-muted)' }}>Due Date</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatDateTime(task.dueDate)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 p-3 rounded-lg border" style={{ 
                    backgroundColor: 'var(--surface-secondary)', 
                    borderColor: 'var(--border)' 
                  }}>
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <div>
                      <span className="text-sm block" style={{ color: 'var(--text-muted)' }}>Created</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatDateTime(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <TaskComments taskId={task.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
