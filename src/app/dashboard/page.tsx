"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Wallet, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Trophy,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  goalsCount: number;
  learningsCount: number;
  dreamsCount: number;
  totalSavings: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    goalsCount: 0,
    learningsCount: 0,
    dreamsCount: 0,
    totalSavings: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }

        setUser(user);

        // Buscar estatísticas do usuário
        const [goalsRes, learningsRes, dreamsRes, financesRes] = await Promise.all([
          supabase.from('goals').select('*', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('learnings').select('*', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('dreams').select('*', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('finances').select('amount, type').eq('user_id', user.id)
        ]);

        // Calcular economia total
        let totalSavings = 0;
        if (financesRes.data) {
          financesRes.data.forEach((finance: any) => {
            if (finance.type === 'income') {
              totalSavings += parseFloat(finance.amount);
            } else if (finance.type === 'expense') {
              totalSavings -= parseFloat(finance.amount);
            }
          });
        }

        setStats({
          goalsCount: goalsRes.count || 0,
          learningsCount: learningsRes.count || 0,
          dreamsCount: dreamsRes.count || 0,
          totalSavings
        });
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Olá, {userName}! 👋
                </h1>
                <p className="text-purple-100 text-lg">
                  Bem-vindo ao seu painel de desenvolvimento pessoal
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Nível Iniciante</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Sair</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Target className="w-6 h-6" />}
              title="Objetivos Ativos"
              value={stats.goalsCount.toString()}
              subtitle={stats.goalsCount === 0 ? "Comece definindo suas metas" : `${stats.goalsCount} objetivo${stats.goalsCount > 1 ? 's' : ''} em andamento`}
              color="purple"
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Aprendizados"
              value={stats.learningsCount.toString()}
              subtitle={stats.learningsCount === 0 ? "Nenhuma habilidade em progresso" : `${stats.learningsCount} habilidade${stats.learningsCount > 1 ? 's' : ''} em progresso`}
              color="blue"
            />
            <StatCard
              icon={<Heart className="w-6 h-6" />}
              title="Sonhos"
              value={stats.dreamsCount.toString()}
              subtitle={stats.dreamsCount === 0 ? "Cadastre seus sonhos" : `${stats.dreamsCount} sonho${stats.dreamsCount > 1 ? 's' : ''} cadastrado${stats.dreamsCount > 1 ? 's' : ''}`}
              color="pink"
            />
            <StatCard
              icon={<Wallet className="w-6 h-6" />}
              title="Saldo"
              value={`R$ ${stats.totalSavings.toFixed(2)}`}
              subtitle={stats.totalSavings >= 0 ? "Controle suas finanças" : "Atenção aos gastos"}
              color="green"
            />
          </div>

          {/* Suggestions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sugestões Personalizadas</h2>
                  <p className="text-sm text-gray-600">Recomendações para seu desenvolvimento</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {stats.goalsCount === 0 && (
                <SuggestionCard
                  title="Defina seu primeiro objetivo"
                  description="Comece sua jornada definindo um objetivo claro em qualquer área da sua vida"
                  action="Criar Objetivo"
                  href="/dashboard/goals"
                  icon={<Target className="w-5 h-5" />}
                  color="purple"
                />
              )}
              {stats.learningsCount === 0 && (
                <SuggestionCard
                  title="Aprenda algo novo"
                  description="Escolha uma habilidade que você sempre quis aprender e crie um plano de estudos"
                  action="Explorar"
                  href="/dashboard/learning"
                  icon={<BookOpen className="w-5 h-5" />}
                  color="blue"
                />
              )}
              {stats.dreamsCount === 0 && (
                <SuggestionCard
                  title="Cadastre seus sonhos"
                  description="Liste seus sonhos e receba sugestões de como alcançá-los passo a passo"
                  action="Adicionar Sonho"
                  href="/dashboard/dreams"
                  icon={<Heart className="w-5 h-5" />}
                  color="pink"
                />
              )}
              <SuggestionCard
                title="Organize suas finanças"
                description="Controle seus gastos e receba dicas para economizar e realizar seus objetivos"
                action="Começar"
                href="/dashboard/finances"
                icon={<Wallet className="w-5 h-5" />}
                color="green"
              />
            </div>
          </div>

          {/* Areas de Desenvolvimento */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Áreas de Desenvolvimento</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AreaCard
                title="Profissional"
                description="Carreira, habilidades e networking"
                icon="💼"
                progress={0}
              />
              <AreaCard
                title="Financeiro"
                description="Controle, economia e investimentos"
                icon="💰"
                progress={0}
              />
              <AreaCard
                title="Físico"
                description="Saúde, exercícios e bem-estar"
                icon="💪"
                progress={0}
              />
              <AreaCard
                title="Espiritual"
                description="Propósito, meditação e fé"
                icon="🙏"
                progress={0}
              />
              <AreaCard
                title="Relacionamentos"
                description="Família, amigos e conexões"
                icon="❤️"
                progress={0}
              />
              <AreaCard
                title="Aprendizado"
                description="Conhecimento e novas habilidades"
                icon="📚"
                progress={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: string;
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
  }[color];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function SuggestionCard({
  title,
  description,
  action,
  href,
  icon,
  color
}: {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
  }[color];

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
      <div className="flex items-start gap-4 flex-1">
        <div className={`p-2 ${colorClasses} rounded-lg transition-colors`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <Link
        href={href}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all font-medium text-sm text-gray-700 hover:text-purple-600 whitespace-nowrap ml-4"
      >
        {action}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function AreaCard({
  title,
  description,
  icon,
  progress
}: {
  title: string;
  description: string;
  icon: string;
  progress: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progresso</span>
          <span className="font-semibold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
