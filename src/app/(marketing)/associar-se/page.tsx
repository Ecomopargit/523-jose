"use client";

import { useState } from "react";
import { 
  User, 
  Car, 
  CreditCard, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function AssociarSePage() {
  const [step, setStep] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    tipoVeiculo: "",
    carroProprio: "",
    locadora: "",
    placa: "",
    chavePix: "",
    aderiuIndicacao: false,
    codigoIndicacao: "",
    aceitaTermos: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#0E3A5D] mb-4">
              Cadastro Enviado com Sucesso!
            </h1>
            <p className="text-gray-600 mb-8">
              Obrigado por se candidatar à associação ECOMOPAR. Nossa equipe 
              analisará seu cadastro e entrará em contato em até 48 horas úteis.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#0E3A5D] to-[#1FA35B] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Voltar para o Início</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0E3A5D] to-[#1a5a3d] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Associe-se à ECOMOPAR</h1>
          <p className="text-gray-300">
            Preencha o formulário abaixo para iniciar seu processo de associação.
          </p>
        </div>
      </div>

      {/* Progresso */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#0E3A5D]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#0E3A5D] text-white' : 'bg-gray-200'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Dados Pessoais</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#0E3A5D]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#0E3A5D] text-white' : 'bg-gray-200'}`}>
                <Car className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Dados do Veículo</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#0E3A5D]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#0E3A5D] text-white' : 'bg-gray-200'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Financeiro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm">
            {/* Step 1: Dados Pessoais */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-[#0E3A5D] mb-6">Dados Pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.cpf}
                        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                      <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 00000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rua, número, bairro"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.cidade}
                        onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.estado}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="SP">SP</option>
                        <option value="RJ">RJ</option>
                        <option value="MG">MG</option>
                        <option value="RS">RS</option>
                        <option value="PR">PR</option>
                        <option value="SC">SC</option>
                        <option value="BA">BA</option>
                        <option value="PE">PE</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                      <input
                        type="text"
                        required
                        placeholder="00000-000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.cep}
                        onChange={(e) => setFormData({...formData, cep: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-[#0E3A5D] to-[#1FA35B] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dados do Veículo */}
            {step === 2 && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-[#0E3A5D] mb-6">Dados do Veículo</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Veículo *</label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                      value={formData.tipoVeiculo}
                      onChange={(e) => setFormData({...formData, tipoVeiculo: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      <option value="carro">Carro</option>
                      <option value="moto">Moto</option>
                      <option value="van">Van</option>
                      <option value="caminhao">Caminhão</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Veículo é próprio? *</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="carroProprio"
                          value="sim"
                          required
                          className="w-4 h-4 text-[#0E3A5D]"
                          onChange={() => setFormData({...formData, carroProprio: "sim"})}
                        />
                        <span>Sim</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="carroProprio"
                          value="nao"
                          required
                          className="w-4 h-4 text-[#0E3A5D]"
                          onChange={() => setFormData({...formData, carroProprio: "nao"})}
                        />
                        <span>Não, é alugado</span>
                      </label>
                    </div>
                  </div>
                  {formData.carroProprio === "nao" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Locadora</label>
                      <input
                        type="text"
                        placeholder="Nome da locadora"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.locadora}
                        onChange={(e) => setFormData({...formData, locadora: e.target.value})}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo *</label>
                    <input
                      type="text"
                      required
                      placeholder="ABC-1234 ou ABC1D23"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                      value={formData.placa}
                      onChange={(e) => setFormData({...formData, placa: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-[#0E3A5D] to-[#1FA35B] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Dados Financeiros e Finalização */}
            {step === 3 && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-[#0E3A5D] mb-6">Dados Financeiros</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX *</label>
                    <input
                      type="text"
                      required
                      placeholder="CPF, e-mail, telefone ou chave aleatória"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                      value={formData.chavePix}
                      onChange={(e) => setFormData({...formData, chavePix: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Esta chave será usada para seus saques</p>
                  </div>

                  <div className="border-t pt-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-[#0E3A5D] rounded mt-0.5"
                        checked={formData.aderiuIndicacao}
                        onChange={(e) => setFormData({...formData, aderiuIndicacao: e.target.checked})}
                      />
                      <div>
                        <span className="font-medium text-[#0E3A5D]">Quero aderir ao plano de indicação</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Ganhe R$ 150,00 a cada 3 indicações válidas. 
                          <span className="text-yellow-600 font-medium"> Obs: Saque bloqueado por 90 dias.</span>
                        </p>
                      </div>
                    </label>
                  </div>

                  {formData.aderiuIndicacao && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código de Indicação (opcional)</label>
                      <input
                        type="text"
                        placeholder="Se foi indicado por alguém, digite o código"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none"
                        value={formData.codigoIndicacao}
                        onChange={(e) => setFormData({...formData, codigoIndicacao: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        className="w-5 h-5 text-[#0E3A5D] rounded mt-0.5"
                        checked={formData.aceitaTermos}
                        onChange={(e) => setFormData({...formData, aceitaTermos: e.target.checked})}
                      />
                      <span className="text-gray-700">
                        Li e aceito os <a href="#" className="text-[#0E3A5D] underline">Termos de Uso</a> e a <a href="#" className="text-[#0E3A5D] underline">Política de Privacidade</a> da ECOMOPAR *
                      </span>
                    </label>
                  </div>

                  {formData.aderiuIndicacao && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold">Atenção ao plano de indicação:</p>
                        <p>Ao aderir, você terá seu saque bloqueado por 90 dias após a ativação da campanha.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0E3A5D] to-[#1FA35B] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
                  >
                    <span>Enviar Cadastro</span>
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
