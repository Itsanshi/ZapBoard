import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from .models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = '__all__'


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()

    class Meta:
        model = Project
        fields = '__all__'

    def resolve_task_count(self, info):
        return self.task_set.count()

    def resolve_completed_tasks(self, info):
        return self.task_set.filter(status='DONE').count()


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = '__all__'


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = '__all__'


class Query(graphene.ObjectType):
    # Organization queries
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))

    # Project queries
    projects = graphene.List(ProjectType, organization_slug=graphene.String())
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))

    # Task queries
    tasks = graphene.List(TaskType, project_id=graphene.ID())
    task = graphene.Field(TaskType, id=graphene.ID(required=True))

    # Task comment queries
    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))

    # Project statistics
    project_statistics = graphene.Field(
        graphene.JSONString,
        organization_slug=graphene.String(required=True)
    )

    def resolve_organizations(self, info):
        return Organization.objects.all()

    def resolve_organization(self, info, slug):
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            return None

    def resolve_projects(self, info, organization_slug=None):
        queryset = Project.objects.all()
        if organization_slug:
            queryset = queryset.filter(organization__slug=organization_slug)
        return queryset

    def resolve_project(self, info, id):
        try:
            return Project.objects.get(pk=id)
        except Project.DoesNotExist:
            return None

    def resolve_tasks(self, info, project_id=None):
        queryset = Task.objects.all()
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def resolve_task(self, info, id):
        try:
            return Task.objects.get(pk=id)
        except Task.DoesNotExist:
            return None

    def resolve_task_comments(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)

    def resolve_project_statistics(self, info, organization_slug):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            projects = Project.objects.filter(organization=organization)
            
            total_projects = projects.count()
            active_projects = projects.filter(status='ACTIVE').count()
            completed_projects = projects.filter(status='COMPLETED').count()
            
            total_tasks = Task.objects.filter(project__organization=organization).count()
            completed_tasks = Task.objects.filter(
                project__organization=organization,
                status='DONE'
            ).count()
            
            completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            
            return {
                'total_projects': total_projects,
                'active_projects': active_projects,
                'completed_projects': completed_projects,
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'completion_rate': round(completion_rate, 2)
            }
        except Organization.DoesNotExist:
            return None


# Mutations
class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(OrganizationType)

    def mutate(self, info, name, contact_email):
        organization = Organization.objects.create(
            name=name,
            contact_email=contact_email
        )
        return CreateOrganization(organization=organization)


class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, organization_slug, name, description=None, status=None, due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description or '',
                status=status or 'ACTIVE',
                due_date=due_date
            )
            return CreateProject(project=project)
        except Organization.DoesNotExist:
            raise Exception("Organization not found")


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, id, name=None, description=None, status=None, due_date=None):
        try:
            project = Project.objects.get(pk=id)
            if name:
                project.name = name
            if description is not None:
                project.description = description
            if status:
                project.status = status
            if due_date is not None:
                project.due_date = due_date
            project.save()
            return UpdateProject(project=project)
        except Project.DoesNotExist:
            raise Exception("Project not found")


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, description=None, status=None, assignee_email=None, due_date=None):
        try:
            project = Project.objects.get(pk=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description or '',
                status=status or 'TODO',
                assignee_email=assignee_email or '',
                due_date=due_date
            )
            return CreateTask(task=task)
        except Project.DoesNotExist:
            raise Exception("Project not found")


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, id, title=None, description=None, status=None, assignee_email=None, due_date=None):
        try:
            task = Task.objects.get(pk=id)
            if title:
                task.title = title
            if description is not None:
                task.description = description
            if status:
                task.status = status
            if assignee_email is not None:
                task.assignee_email = assignee_email
            if due_date is not None:
                task.due_date = due_date
            task.save()
            return UpdateTask(task=task)
        except Task.DoesNotExist:
            raise Exception("Task not found")


class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(pk=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return AddTaskComment(comment=comment)
        except Task.DoesNotExist:
            raise Exception("Task not found")


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_task_comment = AddTaskComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
