import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pl-64">
        <div className="py-6">
          {title && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
            </div>
          )}
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
