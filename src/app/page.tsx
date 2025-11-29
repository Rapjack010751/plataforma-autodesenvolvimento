"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signIn, signUp } from '@/lib/supabase';
import { Sparkles, Target, TrendingUp, Heart, BookOpen, Wallet, Calendar } from 'lucide-react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { data, error } = await signUp(email, password, fullName);
        if (error) throw error;
        
        // Redirecionar para o quiz após cadastro bem-sucedido
        if (data.user) {
          router.push('/quiz');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Branding */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LifePath
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 font-medium">
                Seu guia completo para uma vida plena e realizada
              </p>
              <p className="text-gray-600 text-lg">
                Organize seus objetivos, desenvolva novas habilidades, controle suas finanças e conquiste seus sonhos.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-8">
              <FeatureCard 
                icon={<Target className="w-6 h-6" />}
                title="Objetivos"
                description="Defina e acompanhe metas em todas as áreas da vida"
              />
              <FeatureCard 
                icon={<TrendingUp className="w-6 h-6" />}
                title="Desenvolvimento"
                description="Receba sugestões personalizadas de crescimento"
              />
              <FeatureCard 
                icon={<BookOpen className="w-6 h-6" />}
                title="Aprendizado"
                description="Crie planos para aprender novas habilidades"
              />
              <FeatureCard 
                icon={<Heart className="w-6 h-6" />}
                title="Sonhos"
                description="Transforme seus sonhos em conquistas reais"
              />
              <FeatureCard 
                icon={<Wallet className="w-6 h-6" />}
                title="Finanças"
                description="Controle gastos e economize para seus objetivos"
              />
              <FeatureCard 
                icon={<Calendar className="w-6 h-6" />}
                title="Agenda Inteligente"
                description="Integre sua rotina e receba sugestões"
              />
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isLogin ? 'Bem-vindo de volta!' : 'Comece sua jornada'}
                  </h2>
                  <p className="text-gray-600">
                    {isLogin ? 'Entre para continuar seu desenvolvimento' : 'Crie sua conta gratuitamente'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Seu nome"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
                  </button>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg text-purple-600">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
