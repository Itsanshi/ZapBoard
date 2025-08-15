#!/usr/bin/env python
"""Management command to populate sample data for development."""

import os
import sys
import django
from datetime import date, datetime, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zapboard_backend.settings')
os.environ.setdefault('USE_SQLITE', '1')
django.setup()

from projects.models import Organization, Project, Task, TaskComment

def populate_sample_data():
    """Populate database with sample data for development and testing."""
    
    # Create organizations
    org1 = Organization.objects.create(
        name="Tech Innovators Inc",
        contact_email="contact@techinnovators.com"
    )
    
    org2 = Organization.objects.create(
        name="Digital Solutions Ltd",
        contact_email="info@digitalsolutions.com"
    )
    
    # Create projects for org1
    project1 = Project.objects.create(
        organization=org1,
        name="Website Redesign",
        description="Complete overhaul of company website with modern design",
        status="ACTIVE",
        due_date=date.today() + timedelta(days=30)
    )
    
    project2 = Project.objects.create(
        organization=org1,
        name="Mobile App Development",
        description="Native mobile application for iOS and Android",
        status="ACTIVE",
        due_date=date.today() + timedelta(days=60)
    )
    
    project3 = Project.objects.create(
        organization=org1,
        name="Data Migration",
        description="Migrate legacy data to new system",
        status="COMPLETED",
        due_date=date.today() - timedelta(days=10)
    )
    
    # Create projects for org2
    project4 = Project.objects.create(
        organization=org2,
        name="E-commerce Platform",
        description="Build modern e-commerce solution",
        status="ACTIVE",
        due_date=date.today() + timedelta(days=45)
    )
    
    project5 = Project.objects.create(
        organization=org2,
        name="API Integration",
        description="Integrate with third-party APIs",
        status="ON_HOLD",
        due_date=date.today() + timedelta(days=20)
    )
    
    # Create tasks for Website Redesign
    task1 = Task.objects.create(
        project=project1,
        title="Design mockups",
        description="Create wireframes and visual designs",
        status="DONE",
        assignee_email="designer@techinnovators.com",
        due_date=datetime.now() - timedelta(days=5)
    )
    
    task2 = Task.objects.create(
        project=project1,
        title="Frontend development",
        description="Implement responsive frontend",
        status="IN_PROGRESS",
        assignee_email="frontend@techinnovators.com",
        due_date=datetime.now() + timedelta(days=15)
    )
    
    task3 = Task.objects.create(
        project=project1,
        title="Content migration",
        description="Migrate existing content to new site",
        status="TODO",
        assignee_email="content@techinnovators.com",
        due_date=datetime.now() + timedelta(days=20)
    )
    
    # Create tasks for Mobile App Development
    task4 = Task.objects.create(
        project=project2,
        title="UI/UX Design",
        description="Design mobile app interface",
        status="IN_PROGRESS",
        assignee_email="designer@techinnovators.com",
        due_date=datetime.now() + timedelta(days=10)
    )
    
    task5 = Task.objects.create(
        project=project2,
        title="Backend API",
        description="Develop REST API for mobile app",
        status="TODO",
        assignee_email="backend@techinnovators.com",
        due_date=datetime.now() + timedelta(days=25)
    )
    
    # Create tasks for E-commerce Platform
    task6 = Task.objects.create(
        project=project4,
        title="Database design",
        description="Design database schema for e-commerce",
        status="DONE",
        assignee_email="dba@digitalsolutions.com",
        due_date=datetime.now() - timedelta(days=3)
    )
    
    task7 = Task.objects.create(
        project=project4,
        title="Product catalog",
        description="Build product management system",
        status="IN_PROGRESS",
        assignee_email="dev@digitalsolutions.com",
        due_date=datetime.now() + timedelta(days=12)
    )
    
    # Create some task comments
    TaskComment.objects.create(
        task=task1,
        content="Mockups look great! Moving to development phase.",
        author_email="pm@techinnovators.com"
    )
    
    TaskComment.objects.create(
        task=task1,
        content="Thanks! I've addressed all the feedback points.",
        author_email="designer@techinnovators.com"
    )
    
    TaskComment.objects.create(
        task=task2,
        content="Frontend is 70% complete. Should be ready by next week.",
        author_email="frontend@techinnovators.com"
    )
    
    TaskComment.objects.create(
        task=task6,
        content="Database schema is complete and tested.",
        author_email="dba@digitalsolutions.com"
    )
    
    print("Sample data created successfully!")
    print(f"Created {Organization.objects.count()} organizations")
    print(f"Created {Project.objects.count()} projects")
    print(f"Created {Task.objects.count()} tasks")
    print(f"Created {TaskComment.objects.count()} comments")

if __name__ == "__main__":
    populate_sample_data()
