# ZapBoard - Multi-Tenant Project Management System

A modern, full-stack project management system built with Django + GraphQL backend and React + TypeScript + Apollo Client frontend. Features organization-based multi-tenancy, project/task management, and real-time collaboration.

## 🚀 Features

### Backend (Django + GraphQL)
- **Multi-tenant Architecture**: Organization-based data isolation
- **GraphQL API**: Complete schema with queries, mutations, and subscriptions
- **Data Models**: Organizations, Projects, Tasks, and Comments with proper relationships
- **Authentication**: Django-based user management
- **Admin Interface**: Django admin for data management

### Frontend (React + TypeScript)
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Apollo Client**: GraphQL integration with caching and optimistic updates
- **Organization Selection**: Dynamic filtering by organization
- **Project Management**: Create, view, and manage projects
- **Task Management**: Complete task workflow with status updates
- **Comment System**: Real-time commenting on tasks
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

- **Backend**: Django 4.x, Graphene-Django, PostgreSQL/SQLite
- **Frontend**: Next.js 14, React 18, TypeScript, Apollo Client, TailwindCSS
- **Database**: PostgreSQL (production) / SQLite (development)
- **Tools**: Python virtual environment, npm/yarn

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+ 
- Node.js 18+
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)


### Setup (Windows)

If you prefer to set up manually:

1. **Create virtual environment and install backend dependencies**
   ```bash
    cd backend
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    set USE_SQLITE=1
    python manage.py migrate
    python populate_sample_data.py
    python manage.py runserver
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Setup (Linux)

### Setup & Installation (Linux)
- `npm run setup` - Complete setup (create venv, install dependencies)
- `npm run install:all` - Install npm dependencies for frontend and root

### Development (Linux)
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only Django backend
- `npm run dev:frontend` - Start only Next.js frontend

### Database
- `npm run migrate` - Run Django migrations
- `npm run makemigrations` - Create new Django migrations
- `npm run populate-data` - Populate database with sample data

### Production
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start production servers

### Utilities
- `npm run lint` - Run ESLint on frontend code
- `npm run createsuperuser` - Create Django superuser

## 🗃 Database Configuration

### Development (SQLite)
By default, the application uses SQLite for development. No additional setup required.

### Production (PostgreSQL)
Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/zapboard
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
```

## 📱 Usage

1. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend GraphQL Playground: http://localhost:8000/graphql/
   - Django Admin: http://localhost:8000/admin/

2. **Organization Selection**
   - Use the organization dropdown to switch between different organizations
   - All data (projects, tasks) is filtered by the selected organization

3. **Project Management**
   - Create new projects from the projects page
   - View project details and statistics on the dashboard
   - Access project tasks by clicking on a project card

4. **Task Management**
   - Create tasks within projects
   - Update task status (TODO, IN_PROGRESS, DONE)
   - Add comments to tasks for collaboration
   - Filter tasks by status

## 🏗 Project Structure

```
zapboard/
├── backend/                 # Django backend
│   ├── zapboard/           # Main Django project
│   ├── projects/           # Projects app
│   ├── manage.py
│   ├── requirements.txt
│   └── populate_sample_data.py
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities and configurations
│   ├── types/            # TypeScript type definitions
│   └── package.json
├── package.json           # Root package.json with scripts
└── README.md
```

## 🔧 Development

### Adding New Features

1. **Backend**: Add new models, GraphQL schema, and queries/mutations
2. **Frontend**: Create components, add GraphQL operations, and integrate UI

### Code Quality
- **Linting**: Run `npm run lint` to check frontend code
- **Type Safety**: Full TypeScript coverage on frontend
- **Best Practices**: Follow Django and React best practices

## 🚀 Deployment

### Environment Variables
Set up the following environment variables:

**Backend (.env)**:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Django secret key  
- `DEBUG` - Set to False in production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts

### Build for Production
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 API Documentation

The GraphQL schema includes:

### Queries
- `organizations` - List all organizations
- `projects(organizationId)` - List projects for an organization
- `project(id)` - Get single project with details
- `tasks(projectId)` - List tasks for a project
- `task(id)` - Get single task with comments

### Mutations
- `createProject` - Create new project
- `updateProject` - Update project details
- `createTask` - Create new task
- `updateTask` - Update task details
- `createTaskComment` - Add comment to task

Visit http://localhost:8000/graphql/ for interactive API exploration.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in scripts or kill existing processes
2. **Database connection**: Ensure PostgreSQL is running or use SQLite mode
3. **Permission errors**: Make sure virtual environment is activated
4. **Module not found**: Run `npm run setup` to install all dependencies

### Getting Help
- Check the console for error messages
- Verify all dependencies are installed
- Ensure database migrations are up to date
- Check that both backend and frontend are running

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Django, React, and GraphQL
