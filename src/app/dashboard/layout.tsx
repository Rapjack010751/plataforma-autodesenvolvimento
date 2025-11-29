"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Heart, 
  Wallet, 
  Bell, 
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                LifePath
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
                Dashboard
              </NavLink>
              <NavLink href="/dashboard/goals" icon={<Target className="w-4 h-4" />}>
                Objetivos
              </NavLink>
              <NavLink href="/dashboard/learning" icon={<BookOpen className="w-4 h-4" />}>
                Aprendizado
              </NavLink>
              <NavLink href="/dashboard/dreams" icon={<Heart className="w-4 h-4" />}>
                Sonhos
              </NavLink>
              <NavLink href="/dashboard/finances" icon={<Wallet className="w-4 h-4" />}>
                Finanças
              </NavLink>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <MobileNavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/dashboard/goals" icon={<Target className="w-5 h-5" />}>
                Objetivos
              </MobileNavLink>
              <MobileNavLink href="/dashboard/learning" icon={<BookOpen className="w-5 h-5" />}>
                Aprendizado
              </MobileNavLink>
              <MobileNavLink href="/dashboard/dreams" icon={<Heart className="w-5 h-5" />}>
                Sonhos
              </MobileNavLink>
              <MobileNavLink href="/dashboard/finances" icon={<Wallet className="w-5 h-5" />}>
                Finanças
              </MobileNavLink>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all font-medium"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
}
