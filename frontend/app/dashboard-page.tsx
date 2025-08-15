'use client';

import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_PROJECT_STATISTICS } from '@/lib/graphql';
import MainLayout from '@/components/MainLayout';
import ProjectCard from '@/components/ProjectCard';
import { LoadingCard, LoadingPage } from '@/components/LoadingSpinner';
import { Project, ProjectStatistics } from '@/types';
import { BarChart3, FolderOpen, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS);
  
  // For now, we'll use the first organization's statistics
  // In a real app, this would be based on user's selected organization
  const organizationSlug = 'tech-innovators-inc';
  const { data: statsData, loading: statsLoading } = useQuery(GET_PROJECT_STATISTICS, {
    variables: { organizationSlug },
    skip: !organizationSlug,
  });

  if (projectsLoading) return <LoadingPage />;
  if (projectsError) return <div className="text-red-600">Error loading projects: {projectsError.message}</div>;

  const projects: Project[] = projectsData?.projects || [];
  const statistics: ProjectStatistics = statsData?.projectStatistics ? JSON.parse(statsData.projectStatistics) : null;

  const statsCards = [
    {
      title: 'Total Projects',
      value: statistics?.totalProjects || projects.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Projects',
      value: statistics?.activeProjects || projects.filter(p => p.status === 'ACTIVE').length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed Projects',
      value: statistics?.completedProjects || projects.filter(p => p.status === 'COMPLETED').length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Completion Rate',
      value: `${statistics?.completionRate || 0}%`,
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="py-6 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <a href="/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all projects →
            </a>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
              <a 
                href="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Project
              </a>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
