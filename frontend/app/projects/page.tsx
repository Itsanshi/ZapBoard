'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/lib/graphql';
import MainLayout from '@/components/MainLayout';
import ProjectCard from '@/components/ProjectCard';
import OrganizationSelector from '@/components/OrganizationSelector';
import { LoadingCard, LoadingPage } from '@/components/LoadingSpinner';
import { Project } from '@/types';
import { Plus, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>('');
  
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: selectedOrgSlug ? { organizationSlug: selectedOrgSlug } : {},
  });

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-red-600">Error loading projects: {error.message}</div>;

  const projects: Project[] = data?.projects || [];

  return (
    <MainLayout title="Projects">
      <div className="py-6">
        {/* Organization Selector */}
        <div className="max-w-xs mb-8 animate-fade-in-up">
          <OrganizationSelector 
            selectedOrg={selectedOrgSlug} 
            onOrgChange={setSelectedOrgSlug}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-effect p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="🔍 Search projects..."
                  className="search-input w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="glass-effect flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors border border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter Projects
              </button>
              <a
                href="/projects/new"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                🚀 New Project
              </a>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="glass-effect max-w-md mx-auto p-10">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ready to build something amazing? Create your first project and start bringing your ideas to life.
              </p>
              <a 
                href="/projects/new"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                🎯 Create Your First Project
              </a>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
