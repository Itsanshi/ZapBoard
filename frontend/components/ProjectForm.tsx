'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_PROJECT, GET_PROJECTS, GET_ORGANIZATIONS } from '@/lib/graphql';
import { CreateProjectForm } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';

interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectForm>({
    name: '',
    description: '',
    status: 'ACTIVE',
    dueDate: '',
  });

  const { data: orgsData } = useQuery(GET_ORGANIZATIONS);
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const organizations = orgsData?.organizations || [];
  const defaultOrgSlug = organizations[0]?.slug || 'tech-innovators-inc';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        variables: {
          organizationSlug: defaultOrgSlug,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          dueDate: formData.dueDate || null,
        },
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="modern-card animate-fade-in-up">
      <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create New Project
        </h2>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Start your next amazing project</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium">{error.message}</p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input w-full px-4 py-3 text-gray-900 placeholder-gray-500"
            placeholder="Enter an amazing project name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input w-full px-4 py-3 text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe your project vision..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' })}
              className="form-input w-full px-4 py-3 text-gray-900"
            >
              <option value="ACTIVE">🚀 Active</option>
              <option value="ON_HOLD">⏸️ On Hold</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="form-input w-full px-4 py-3 text-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || !formData.name}
            className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? '✨ Creating...' : '🎯 Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
