'use client';

import { Task } from '@/types';
import { formatDateTime, isDateOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Calendar, User, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'DONE', label: 'Done', color: 'bg-green-100 text-green-700' },
];

export default function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const isOverdue = isDateOverdue(task.dueDate);

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

  return (
    <div className="modern-card group cursor-pointer transition-all duration-300 hover:shadow-lg animate-slide-in-right">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 
            className="text-lg font-bold cursor-pointer group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex-1 pr-3"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => onTaskClick(task)}
          >
            {task.title}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={cn('status-badge flex items-center space-x-1', getStatusStyle(task.status))}>
              {getStatusIcon(task.status)}
              <span>{statusOptions.find(opt => opt.value === task.status)?.label}</span>
            </div>
          </div>
        </div>

        {task.description && (
          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {task.description}
          </p>
        )}

        <div className="space-y-3">
          {task.assigneeEmail && (
            <div className="flex items-center text-sm px-3 py-2 rounded-lg border" style={{ 
              backgroundColor: 'var(--surface-secondary)', 
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}>
              <User className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="font-medium">{task.assigneeEmail}</span>
            </div>
          )}

          {task.dueDate && (
            <div className={cn(
              'flex items-center text-sm px-3 py-2 rounded-lg border',
              isOverdue 
                ? 'date-overdue' 
                : ''
            )} style={!isOverdue ? { 
              backgroundColor: 'var(--surface-secondary)', 
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            } : {}}>
              {isOverdue && <AlertCircle className="w-4 h-4 mr-2" />}
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">{formatDateTime(task.dueDate)}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {task.project.organization.name} • {task.project.name}
              </span>
            </div>
            <button
              onClick={() => onTaskClick(task)}
              className="btn-view-tasks inline-flex items-center text-sm"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
