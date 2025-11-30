"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Finance {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const router = useRouter();

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setFinances(data || []);
    } catch (error) {
      console.error('Erro ao carregar finanças:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('finances').insert([
        {
          ...formData,
          amount: parseFloat(formData.amount),
          user_id: user.id
        }
      ]);

      if (error) throw error;

      setFormData({ 
        type: 'expense', 
        amount: '', 
        description: '', 
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      loadFinances();
    } catch (error) {
      console.error('Erro ao criar registro financeiro:', error);
    }
  };

  const calculateBalance = () => {
    return finances.reduce((acc, finance) => {
      if (finance.type === 'income') {
        return acc + parseFloat(finance.amount.toString());
      } else {
        return acc - parseFloat(finance.amount.toString());
      }
    }, 0);
  };

  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((acc, f) => acc + parseFloat(f.amount.toString()), 0);

  const totalExpense = finances
    .filter(f => f.type === 'expense')
    .reduce((acc, f) => acc + parseFloat(f.amount.toString()), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando finanças...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white rounded-lg transition-all">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Minhas Finanças</h1>
                <p className="text-gray-600">Controle seus gastos e receitas</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Receitas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Despesas</span>
              </div>
              <p className="text-2xl font-bold text-red-600">R$ {totalExpense.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Saldo</span>
              </div>
              <p className="text-2xl font-bold">R$ {calculateBalance().toFixed(2)}</p>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Transação</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Salário, Almoço, Transporte..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="food">Alimentação</option>
                      <option value="transport">Transporte</option>
                      <option value="housing">Moradia</option>
                      <option value="health">Saúde</option>
                      <option value="education">Educação</option>
                      <option value="entertainment">Lazer</option>
                      <option value="salary">Salário</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Adicionar Transação
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Transações Recentes</h2>
            <div className="space-y-3">
              {finances.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma transação</h3>
                  <p className="text-gray-600 mb-6">Comece registrando suas receitas e despesas</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Adicionar Primeira Transação
                  </button>
                </div>
              ) : (
                finances.map((finance) => (
                  <div key={finance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${finance.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {finance.type === 'income' ? (
                          <TrendingUp className={`w-5 h-5 ${finance.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <TrendingDown className={`w-5 h-5 ${finance.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{finance.description || 'Sem descrição'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{finance.category}</span>
                          <span>{new Date(finance.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-lg font-bold ${finance.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {finance.type === 'income' ? '+' : '-'} R$ {parseFloat(finance.amount.toString()).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
