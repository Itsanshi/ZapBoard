'use client';

import MainLayout from '@/components/MainLayout';
import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <MainLayout title="New Project">
      <div className="py-6">
        <div className="max-w-2xl">
          <ProjectForm />
        </div>
      </div>
    </MainLayout>
  );
}
