"use client";

import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  CheckCircle
} from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio
    setEnviado(true);
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0E3A5D] to-[#1a5a3d] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Estamos aqui para ajudar. Entre em contato conosco para tirar dúvidas, 
              fazer sugestões ou obter mais informações.
            </p>
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F5F7FA] rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-[#0E3A5D] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0E3A5D] mb-2">Telefone</h3>
              <p className="text-gray-600 text-sm">(11) 4000-0000</p>
            </div>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-[#1FA35B] rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0E3A5D] mb-2">WhatsApp</h3>
              <p className="text-gray-600 text-sm">(11) 90000-0000</p>
            </div>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-[#0E3A5D] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0E3A5D] mb-2">E-mail</h3>
              <p className="text-gray-600 text-sm">contato@ecomopar.org</p>
            </div>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-[#1FA35B] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0E3A5D] mb-2">Atendimento</h3>
              <p className="text-gray-600 text-sm">Seg-Sex: 9h às 18h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário e Endereço */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0E3A5D] mb-6">
                Envie uma Mensagem
              </h2>

              {enviado ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Mensagem Enviada!</h3>
                  <p className="text-green-700">Em breve entraremos em contato com você.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none transition-all"
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none transition-all"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none transition-all"
                        placeholder="(11) 00000-0000"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none transition-all"
                      value={formData.assunto}
                      onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida sobre associação</option>
                      <option value="beneficio">Dúvida sobre benefícios</option>
                      <option value="cadastro">Problema com cadastro</option>
                      <option value="pagamento">Dúvida sobre pagamentos</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E3A5D] focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Descreva sua mensagem..."
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0E3A5D] to-[#1FA35B] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              )}
            </div>

            {/* Endereço e Mapa */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#0E3A5D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#0E3A5D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0E3A5D] mb-2">Nosso Endereço</h3>
                    <p className="text-gray-600">
                      Av. Paulista, 1000 - 10º Andar<br />
                      Bela Vista, São Paulo - SP<br />
                      CEP: 01310-100
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa placeholder */}
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                <div className="bg-[#F5F7FA] rounded-xl h-80 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#0E3A5D] mx-auto mb-4" />
                    <p className="text-gray-500">Mapa da localização</p>
                    <p className="text-sm text-gray-400 mt-1">Av. Paulista, 1000 - São Paulo/SP</p>
                  </div>
                </div>
              </div>

              {/* Horário de Atendimento */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-[#0E3A5D] mb-4">Horário de Atendimento</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Segunda a Sexta</span>
                    <span className="font-medium text-[#0E3A5D]">9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sábado</span>
                    <span className="font-medium text-[#0E3A5D]">9h às 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domingo</span>
                    <span className="font-medium text-gray-400">Fechado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
