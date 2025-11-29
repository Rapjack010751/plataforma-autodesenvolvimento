"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Target,
  TrendingUp,
  Heart,
  BookOpen,
  Wallet,
  Users,
  Zap
} from 'lucide-react';

interface QuizAnswer {
  question: string;
  answer: string | string[];
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está autenticado
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const questions = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao LifePath! 🎉',
      subtitle: 'Vamos conhecer você melhor para personalizar sua experiência',
      type: 'intro',
    },
    {
      id: 'main_goals',
      title: 'Quais são suas principais áreas de interesse?',
      subtitle: 'Selecione todas que se aplicam',
      type: 'multiple',
      options: [
        { value: 'professional', label: 'Desenvolvimento Profissional', icon: <TrendingUp className="w-5 h-5" /> },
        { value: 'financial', label: 'Controle Financeiro', icon: <Wallet className="w-5 h-5" /> },
        { value: 'health', label: 'Saúde e Bem-estar', icon: <Heart className="w-5 h-5" /> },
        { value: 'learning', label: 'Aprendizado e Habilidades', icon: <BookOpen className="w-5 h-5" /> },
        { value: 'relationships', label: 'Relacionamentos', icon: <Users className="w-5 h-5" /> },
        { value: 'spiritual', label: 'Desenvolvimento Espiritual', icon: <Sparkles className="w-5 h-5" /> },
      ],
    },
    {
      id: 'current_situation',
      title: 'Como você descreveria sua situação atual?',
      subtitle: 'Seja honesto, isso nos ajudará a personalizar suas sugestões',
      type: 'single',
      options: [
        { value: 'starting', label: 'Estou começando minha jornada de desenvolvimento' },
        { value: 'some_progress', label: 'Já tenho alguns objetivos, mas preciso de organização' },
        { value: 'advanced', label: 'Tenho objetivos claros, busco otimização' },
        { value: 'lost', label: 'Me sinto perdido e preciso de direção' },
      ],
    },
    {
      id: 'time_availability',
      title: 'Quanto tempo você pode dedicar ao seu desenvolvimento?',
      subtitle: 'Isso nos ajudará a sugerir atividades adequadas',
      type: 'single',
      options: [
        { value: '15min', label: '15-30 minutos por dia' },
        { value: '1hour', label: '1 hora por dia' },
        { value: '2hours', label: '2+ horas por dia' },
        { value: 'weekends', label: 'Principalmente nos finais de semana' },
      ],
    },
    {
      id: 'biggest_challenge',
      title: 'Qual é seu maior desafio atualmente?',
      subtitle: 'Vamos focar em ajudá-lo com isso',
      type: 'single',
      options: [
        { value: 'organization', label: 'Organização e planejamento' },
        { value: 'motivation', label: 'Manter a motivação e consistência' },
        { value: 'finances', label: 'Controle financeiro' },
        { value: 'time', label: 'Gestão de tempo' },
        { value: 'direction', label: 'Saber por onde começar' },
      ],
    },
    {
      id: 'dream_goal',
      title: 'Qual é um sonho que você gostaria de realizar?',
      subtitle: 'Pode ser qualquer coisa! Vamos te ajudar a traçar o caminho',
      type: 'text',
      placeholder: 'Ex: Viajar para o Japão, Aprender a tocar violão, Comprar minha casa...',
    },
    {
      id: 'notifications',
      title: 'Como você prefere receber sugestões?',
      subtitle: 'Podemos te ajudar a manter o foco',
      type: 'single',
      options: [
        { value: 'daily', label: 'Notificações diárias com sugestões' },
        { value: 'weekly', label: 'Resumo semanal' },
        { value: 'manual', label: 'Prefiro consultar quando quiser' },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleAnswer = (value: string | string[]) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.question === currentQuestion.id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { question: currentQuestion.id, answer: value };
    } else {
      newAnswers.push({ question: currentQuestion.id, answer: value });
    }
    
    setAnswers(newAnswers);
  };

  const handleMultipleSelect = (value: string) => {
    const currentAnswer = answers.find(a => a.question === currentQuestion.id);
    const currentValues = (currentAnswer?.answer as string[]) || [];
    
    let newValues: string[];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    handleAnswer(newValues);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Salvar respostas do quiz no perfil do usuário
        const { error } = await supabase.auth.updateUser({
          data: {
            quiz_completed: true,
            quiz_answers: answers,
            onboarding_completed_at: new Date().toISOString(),
          }
        });

        if (error) throw error;
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.question === currentQuestion.id)?.answer;
  };

  const isAnswered = () => {
    const answer = getCurrentAnswer();
    if (currentQuestion.type === 'intro') return true;
    if (currentQuestion.type === 'multiple') return Array.isArray(answer) && answer.length > 0;
    if (currentQuestion.type === 'text') return typeof answer === 'string' && answer.trim().length > 0;
    return answer !== undefined;
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {currentQuestion.title}
            </h2>
            <p className="text-lg text-gray-600">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            {currentQuestion.type === 'intro' && (
              <div className="text-center py-8">
                <p className="text-lg text-gray-700 mb-6">
                  Responda algumas perguntas rápidas para que possamos personalizar sua experiência e oferecer as melhores sugestões para seu desenvolvimento pessoal.
                </p>
                <div className="flex justify-center">
                  <Zap className="w-16 h-16 text-purple-500" />
                </div>
              </div>
            )}

            {currentQuestion.type === 'single' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      getCurrentAnswer() === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {getCurrentAnswer() === option.value && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiple' && currentQuestion.options && (
              <div className="grid sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = (getCurrentAnswer() as string[] || []).includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultipleSelect(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.icon}
                        </div>
                        <span className="font-medium text-gray-900 text-left flex-1">
                          {option.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <textarea
                value={(getCurrentAnswer() as string) || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px] resize-none"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered() || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : currentStep === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Pular por enquanto
          </button>
        </div>
      </div>
    </div>
  );
}
