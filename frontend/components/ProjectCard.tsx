'use client';

import Link from 'next/link';
import { Calendar, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Project } from '@/types';
import { formatDate, calculateProgress, isDateOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = calculateProgress(project.completedTasks, project.taskCount);
  const isOverdue = isDateOverdue(project.dueDate);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'PENDING':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return isOverdue ? 'status-overdue' : 'status-pending';
    }
  };

  return (
    <div className="modern-card group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
              <Link 
                href={`/projects/${project.id}`}
                className="flex items-center space-x-2"
              >
                <span>{project.name}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn('status-badge', getStatusStyle(project.status))}>
              {project.status.replace('_', ' ')}
            </span>
            {progress === 100 && (
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Progress</span>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{progress}%</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
              <span className="font-medium">{project.completedTasks}/{project.taskCount} tasks</span>
            </div>

            {project.dueDate && (
              <div className={cn(
                'flex items-center text-sm font-medium',
                isOverdue 
                  ? 'text-red-500' 
                  : ''
              )} style={{ color: isOverdue ? '#f87171' : 'var(--text-secondary)' }}>
                {isOverdue && <AlertCircle className="w-4 h-4 mr-1.5" />}
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {project.organization.name}
              </span>
            </div>
            <Link 
              href={`/projects/${project.id}/tasks`}
              className="btn-view-tasks inline-flex items-center space-x-1.5 group"
            >
              <span>View Tasks</span>
              <ArrowRight className="w-3 h-3 transform transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
