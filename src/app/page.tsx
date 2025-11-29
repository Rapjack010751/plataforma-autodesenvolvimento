"use client";

import { useRouter } from 'next/navigation';
import { Sparkles, Target, TrendingUp, Heart, BookOpen, Wallet, Calendar } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/quiz');
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

          {/* Right Side - CTA */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Comece sua jornada
                  </h2>
                  <p className="text-gray-600">
                    Responda algumas perguntas para personalizarmos sua experiência
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Começar Agora
                  </button>
                  
                  <div className="text-center text-sm text-gray-500">
                    Sem cadastro necessário • Totalmente gratuito
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Personalize sua experiência</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Receba sugestões inteligentes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Acompanhe seu progresso</span>
                    </div>
                  </div>
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
