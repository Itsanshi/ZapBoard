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

  if (loading) return <div className="animate-pulse h-10 bg-gray-200 rounded-md w-64"></div>;
  if (error) return <div className="text-red-600 text-sm">Error loading organizations</div>;

  const organizations: Organization[] = data?.organizations || [];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-1">
        <Building2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Organization</span>
      </div>
      <select
        value={selectedOrg || ''}
        onChange={(e) => onOrgChange(e.target.value)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
      >
        <option value="">Select Organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.slug}>
            {org.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
