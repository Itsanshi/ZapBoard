'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_TASKS, GET_PROJECT } from '@/lib/graphql';
import MainLayout from '@/components/MainLayout';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import TaskModal from '@/components/TaskModal';
import { LoadingCard, LoadingPage } from '@/components/LoadingSpinner';
import { Task, Project } from '@/types';
import { Plus, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const { data: tasksData, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useQuery(GET_TASKS, {
    variables: { projectId },
  });

  if (projectLoading || tasksLoading) return <LoadingPage />;
  if (tasksError) return <div className="text-red-600">Error loading tasks: {tasksError.message}</div>;

  const project: Project = projectData?.project;
  const allTasks: Task[] = tasksData?.tasks || [];
  
  const filteredTasks = filterStatus 
    ? allTasks.filter(task => task.status === filterStatus)
    : allTasks;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
  };

  const tasksByStatus = {
    TODO: filteredTasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: filteredTasks.filter(t => t.status === 'DONE'),
  };

  return (
    <MainLayout title={project ? `${project.name} - Tasks` : 'Tasks'}>
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/projects"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </Link>
            
            {project && (
              <div className="text-sm text-gray-500">
                <span>{project.organization.name}</span>
                <span className="mx-2">•</span>
                <span className="font-medium">{project.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input px-3 py-2 text-sm rounded-lg min-w-[130px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">All Tasks</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="btn-primary inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </button>
          </div>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="mb-6">
            <TaskForm
              projectId={projectId}
              onSuccess={handleTaskFormSuccess}
              onCancel={() => setShowTaskForm(false)}
            />
          </div>
        )}

        {/* Tasks Content */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus ? `No ${filterStatus.replace('_', ' ').toLowerCase()} tasks` : 'No tasks found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filterStatus 
                ? 'Try changing the filter or create a new task.' 
                : 'Get started by creating your first task.'
              }
            </p>
            {!filterStatus && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="modern-card p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-gray-500">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>To Do</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasksByStatus.TODO.length}</p>
                  </div>
                </div>
              </div>

              <div className="modern-card p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-blue-500">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>In Progress</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasksByStatus.IN_PROGRESS.length}</p>
                  </div>
                </div>
              </div>

              <div className="modern-card p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-green-500">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Done</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasksByStatus.DONE.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onTaskClick={handleTaskClick} 
                  onTaskUpdate={() => refetchTasks()}
                />
              ))}
            </div>
          </>
        )}

        {/* Task Modal */}
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}
