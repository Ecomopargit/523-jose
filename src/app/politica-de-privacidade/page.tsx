import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Política de Privacidade",
};

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-dvh bg-white safe-top safe-bottom">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Logo size="sm" href="/" showTagline={false} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand mb-6">
          Política de Privacidade
        </h1>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
          <p>
            A ECOMOPAR — Instituto de Apoio ao Motorista Autônomo — respeita a privacidade dos
            associados e visitantes. Esta política descreve como coletamos, usamos e protegemos
            seus dados pessoais.
          </p>
          <h2 className="text-lg font-bold text-brand">Dados coletados</h2>
          <p>
            Coletamos informações fornecidas no cadastro (nome, e-mail, telefone, documentos e
            dados do veículo), registros de depósitos via PIX, histórico de saques e dados de
            uso do aplicativo.
          </p>
          <h2 className="text-lg font-bold text-brand">Uso dos dados</h2>
          <p>
            Utilizamos os dados para gestão da associação, processamento de pagamentos,
            liberação de benefícios, comunicação com o associado e cumprimento de obrigações
            legais.
          </p>
          <h2 className="text-lg font-bold text-brand">Compartilhamento</h2>
          <p>
            Não vendemos seus dados. Podemos compartilhar informações apenas com prestadores
            de serviços essenciais (pagamentos, hospedagem, suporte) e quando exigido por lei.
          </p>
          <h2 className="text-lg font-bold text-brand">Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato
            pelo e-mail contato@ecomopar.org.
          </p>
        </div>

        <Link href="/login" className="inline-block mt-10 text-brand font-bold hover:underline">
          Voltar
        </Link>
      </div>
    </main>
  );
}
