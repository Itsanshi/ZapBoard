'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_PROJECT_STATISTICS } from '@/lib/graphql';
import MainLayout from '@/components/MainLayout';
import ProjectCard from '@/components/ProjectCard';
import OrganizationSelector from '@/components/OrganizationSelector';
import { LoadingCard, LoadingPage } from '@/components/LoadingSpinner';
import { Project, ProjectStatistics } from '@/types';
import { BarChart3, FolderOpen, CheckCircle, Clock, Building2 } from 'lucide-react';

export default function Dashboard() {
  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>('tech-innovators-inc');
  
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug: selectedOrgSlug },
    skip: !selectedOrgSlug,
  });
  
  const { data: statsData, loading: statsLoading } = useQuery(GET_PROJECT_STATISTICS, {
    variables: { organizationSlug: selectedOrgSlug },
    skip: !selectedOrgSlug,
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
      <div className="space-y-6">
        {/* Organization Selector */}
        <div className="max-w-xs">
          <OrganizationSelector 
            selectedOrg={selectedOrgSlug} 
            onOrgChange={setSelectedOrgSlug}
          />
        </div>

        {!selectedOrgSlug ? (
          <div className="text-center py-16">
            <div className="modern-card max-w-md mx-auto p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Organization</h3>
              <p className="text-gray-600 text-sm">Choose an organization to view its projects and statistics.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="stats-card p-6 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Recent Projects</h2>
                  <p className="text-gray-600">Stay up to date with your latest work</p>
                </div>
                <a 
                  href="/projects" 
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                >
                  <span>View All Projects</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
                <div className="text-center py-16">
                  <div className="modern-card max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FolderOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">No projects found</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">Get started by creating your first project and begin organizing your work efficiently.</p>
                    <a 
                      href="/projects/new"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create Your First Project</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
