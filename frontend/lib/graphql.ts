import { gql } from '@apollo/client';

// Queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String) {
    projects(organizationSlug: $organizationSlug) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasks
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTasks
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          name
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
      project {
        id
        name
        organization {
          name
        }
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      timestamp
      task {
        id
        title
      }
    }
  }
`;

export const GET_PROJECT_STATISTICS = gql`
  query GetProjectStatistics($organizationSlug: String!) {
    projectStatistics(organizationSlug: $organizationSlug)
  }
`;

// Mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!) {
    createOrganization(name: $name, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
        createdAt
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        createdAt
        taskCount
        completedTasks
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        createdAt
        taskCount
        completedTasks
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        createdAt
        project {
          id
          name
          organization {
            name
          }
        }
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        createdAt
        project {
          id
          name
          organization {
            name
          }
        }
      }
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        timestamp
        task {
          id
          title
        }
      }
    }
  }
`;
