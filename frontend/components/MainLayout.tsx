import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />
      <ThemeToggle />
      <main className="pl-64">
        <div className="page-container">
          {title && (
            <div className="page-header">
              <h1 className="page-title" style={{ color: 'var(--text-primary)' }}>{title}</h1>
              <div className="h-0.5 w-16 rounded-full" style={{ background: 'var(--primary-gradient)' }}></div>
            </div>
          )}
          <div className="animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
