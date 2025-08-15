'use client';

import Link from 'next/link';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Project } from '@/types';
import { formatDate, getStatusColor, calculateProgress, isDateOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = calculateProgress(project.completedTasks, project.taskCount);
  const isOverdue = isDateOverdue(project.dueDate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <Link 
              href={`/projects/${project.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {project.name}
            </Link>
          </h3>
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(project.status))}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>{project.completedTasks}/{project.taskCount} tasks</span>
            </div>

            {project.dueDate && (
              <div className={cn(
                'flex items-center text-sm',
                isOverdue ? 'text-red-600' : 'text-gray-500'
              )}>
                {isOverdue && <AlertCircle className="w-4 h-4 mr-1" />}
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {project.organization.name}
            </span>
            <Link 
              href={`/projects/${project.id}/tasks`}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Tasks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
