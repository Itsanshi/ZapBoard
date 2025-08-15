export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  dueDate?: string;
  createdAt: string;
  taskCount: number;
  completedTasks: number;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
    organization: {
      name: string;
    };
  };
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
  task: {
    id: string;
    title: string;
  };
}

export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

// Form types
export interface CreateProjectForm {
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  dueDate?: string;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail?: string;
  dueDate?: string;
}

export interface CreateCommentForm {
  content: string;
  authorEmail: string;
}
