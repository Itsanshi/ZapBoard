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
        <div className="max-w-xs mb-6">
          <OrganizationSelector 
            selectedOrg={selectedOrgSlug} 
            onOrgChange={setSelectedOrgSlug}
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          
          <a
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </a>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
            <a 
              href="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
