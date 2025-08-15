'use client';

import { Task } from '@/types';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { X, Calendar, User, Building2, FolderOpen } from 'lucide-react';
import TaskComments from './TaskComments';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {task.project.organization.name}
              </span>
              <span className="flex items-center">
                <FolderOpen className="w-4 h-4 mr-1" />
                {task.project.name}
              </span>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(task.status))}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Description */}
            {task.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Task Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.assigneeEmail && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Assignee:</span>
                    <span className="text-sm font-medium">{task.assigneeEmail}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm font-medium">{formatDateTime(task.dueDate)}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm font-medium">{formatDateTime(task.createdAt)}</span>
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
