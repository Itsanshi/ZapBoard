'use client';

import { Task } from '@/types';
import { formatDateTime, isDateOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Calendar, User, MessageSquare, AlertCircle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '@/lib/graphql';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onTaskUpdate?: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'DONE', label: 'Done', color: 'bg-green-100 text-green-700' },
];

export default function TaskCard({ task, onTaskClick, onTaskUpdate }: TaskCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOverdue = isDateOverdue(task.dueDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

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

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status) {
      setIsDropdownOpen(false);
      return;
    }

    try {
      await updateTask({
        variables: {
          id: task.id,
          status: newStatus,
        },
      });
      
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error updating task status:', error);
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                disabled={updating}
                className={cn(
                  'status-badge flex items-center space-x-1 cursor-pointer transition-all duration-200 hover:shadow-md',
                  getStatusStyle(task.status),
                  updating && 'opacity-50 cursor-not-allowed'
                )}
              >
                {getStatusIcon(task.status)}
                <span>{statusOptions.find(opt => opt.value === task.status)?.label}</span>
                <ChevronDown className={cn(
                  'w-3 h-3 transition-transform duration-200',
                  isDropdownOpen && 'rotate-180'
                )} />
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-50 min-w-[120px] border animate-fade-in-up"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(option.value);
                      }}
                      className={cn(
                        'status-dropdown-item w-full text-left px-3 py-2 text-sm transition-colors duration-150 flex items-center space-x-2',
                        task.status === option.value && 'font-medium'
                      )}
                      style={{
                        color: task.status === option.value 
                          ? 'var(--text-accent)' 
                          : 'var(--text-primary)',
                        backgroundColor: task.status === option.value 
                          ? 'var(--surface-secondary)' 
                          : 'transparent'
                      }}
                    >
                      {getStatusIcon(option.value)}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
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
