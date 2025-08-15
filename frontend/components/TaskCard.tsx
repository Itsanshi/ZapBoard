'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK, GET_TASKS } from '@/lib/graphql';
import { Task } from '@/types';
import { formatDateTime, getStatusColor, isDateOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export default function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const isOverdue = isDateOverdue(task.dueDate);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateTask({
        variables: {
          id: task.id,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onTaskClick(task)}
          >
            {task.title}
          </h3>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer',
              getStatusColor(task.status),
              isUpdating && 'opacity-50 cursor-not-allowed'
            )}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          {task.assigneeEmail && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span>{task.assigneeEmail}</span>
            </div>
          )}

          {task.dueDate && (
            <div className={cn(
              'flex items-center text-sm',
              isOverdue ? 'text-red-600' : 'text-gray-500'
            )}>
              {isOverdue && <AlertCircle className="w-4 h-4 mr-1" />}
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDateTime(task.dueDate)}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {task.project.organization.name} • {task.project.name}
            </span>
            <button
              onClick={() => onTaskClick(task)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
