'use client';

import { useQuery } from '@apollo/client';
import { ChevronDown, Building2 } from 'lucide-react';
import { GET_ORGANIZATIONS } from '@/lib/graphql';
import { Organization } from '@/types';

interface OrganizationSelectorProps {
  selectedOrg: string | null;
  onOrgChange: (orgSlug: string) => void;
}

export default function OrganizationSelector({ selectedOrg, onOrgChange }: OrganizationSelectorProps) {
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS);

  if (loading) return (
    <div className="modern-card p-4">
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="modern-card p-4">
      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
        Error loading organizations
      </div>
    </div>
  );

  const organizations: Organization[] = data?.organizations || [];

  return (
    <div className="modern-card p-5" style={{ 
      background: 'var(--surface)', 
      borderColor: 'var(--text-accent)',
      backgroundImage: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-hover) 100%)'
    }}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Organization</span>
      </div>
      <div className="relative">
        <select
          value={selectedOrg || ''}
          onChange={(e) => onOrgChange(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 appearance-none cursor-pointer pr-12 font-medium shadow-sm"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="" style={{ color: 'var(--text-muted)' }}>✨ Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.slug} style={{ color: 'var(--text-primary)' }}>
              {org.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-accent)' }} />
      </div>
    </div>
  );
}
