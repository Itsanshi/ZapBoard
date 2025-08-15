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
  const { data: statsData } = useQuery(GET_PROJECT_STATISTICS, {
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
      gradient: 'bg-gradient-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Active Projects',
      value: statistics?.activeProjects || projects.filter(p => p.status === 'ACTIVE').length,
      icon: Clock,
      gradient: 'bg-gradient-secondary',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed Projects',
      value: statistics?.completedProjects || projects.filter(p => p.status === 'COMPLETED').length,
      icon: CheckCircle,
      gradient: 'bg-gradient-accent',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Completion Rate',
      value: `${statistics?.completionRate || 0}%`,
      icon: BarChart3,
      gradient: 'bg-gradient-primary',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="py-6 space-y-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="glass-effect card-hover animate-fade-in-up">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.gradient} pulse-glow`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                Recent Projects
              </h2>
              <p className="text-gray-600">Stay up to date with your latest work</p>
            </div>
            <a 
              href="/projects" 
              className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-purple font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              View all projects →
            </a>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="glass-effect max-w-md mx-auto p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first amazing project.</p>
                <a 
                  href="/projects/new"
                  className="btn-primary inline-flex items-center"
                >
                  🚀 Create Your First Project
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
