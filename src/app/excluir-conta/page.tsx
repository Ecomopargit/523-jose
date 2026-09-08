import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Exclusão de conta e dados | ECOMOPAR",
  description:
    "Como solicitar a exclusão da conta e dos dados pessoais no aplicativo e site ECOMOPAR.",
};

export default function ExcluirContaPage() {
  return (
    <main className="min-h-dvh bg-white safe-top safe-bottom">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Logo size="sm" href="/" showTagline={false} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand mb-2">
          Exclusão de conta e dados
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Aplicativo e serviços <strong className="text-gray-700">ECOMOPAR</strong> — Instituto
          de Apoio ao Motorista Autônomo.
        </p>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
          <p>
            Esta página explica como solicitar a exclusão da sua conta ECOMOPAR e dos dados
            pessoais associados, inclusive os dados usados no aplicativo publicado na Google
            Play e na Apple App Store.
          </p>

          <h2 className="text-lg font-bold text-brand">Como solicitar a exclusão</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Envie um e-mail para{" "}
              <a className="text-brand font-semibold underline" href="mailto:contato@ecomopar.org">
                contato@ecomopar.org
              </a>
              .
            </li>
            <li>
              Use o assunto: <strong>Exclusão de conta ECOMOPAR</strong>.
            </li>
            <li>
              Informe o <strong>e-mail cadastrado</strong> no app, o <strong>nome completo</strong>{" "}
              e, se possível, o telefone usado no cadastro.
            </li>
            <li>
              Confirme se deseja excluir a <strong>conta inteira</strong> ou apenas{" "}
              <strong>alguns dados</strong> (sem encerrar a conta).
            </li>
          </ol>
          <p>
            Após recebermos a solicitação, confirmaremos a identidade pelo e-mail cadastrado e
            processaremos o pedido em até <strong>30 dias</strong>.
          </p>

          <h2 className="text-lg font-bold text-brand">O que é excluído</h2>
          <p>Quando a exclusão da conta for concluída, removemos ou anonimizamos, conforme o caso:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dados de cadastro e perfil (nome, e-mail, telefone, documentos, endereço, veículo)</li>
            <li>Foto de perfil</li>
            <li>Credenciais de acesso (Firebase Authentication)</li>
            <li>Preferências do app e dados de indicação vinculados ao perfil</li>
            <li>Saldos e registros operacionais que não precisem ser mantidos por obrigação legal</li>
          </ul>

          <h2 className="text-lg font-bold text-brand">O que pode ser mantido e por quanto tempo</h2>
          <p>
            Podemos conservar, pelo prazo necessário e permitido pela legislação brasileira
            (incluindo LGPD e regras fiscais/contábeis), registros relacionados a:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pagamentos PIX, depósitos, saques e comprovantes financeiros</li>
            <li>Obrigações legais, fiscais, contábeis ou de prevenção a fraudes</li>
            <li>Registros mínimos necessários para defesa em eventuais disputas</li>
          </ul>
          <p>
            Esses dados retidos deixam de ficar disponíveis no aplicativo para uso cotidiano e
            são mantidos com acesso restrito. Em regra, o período adicional de retenção financeira
            pode chegar a até <strong>5 anos</strong>, ou outro prazo exigido por lei.
          </p>

          <h2 className="text-lg font-bold text-brand">
            Exclusão de dados sem excluir a conta
          </h2>
          <p>
            Você também pode solicitar a correção ou a exclusão de <strong>alguns ou todos</strong>{" "}
            os dados pessoais sem encerrar a conta, pelo mesmo e-mail{" "}
            <a className="text-brand font-semibold underline" href="mailto:contato@ecomopar.org">
              contato@ecomopar.org
            </a>
            , descrevendo quais informações deseja remover ou alterar. Avaliaremos o pedido
            conforme a LGPD e as necessidades operacionais da associação.
          </p>

          <h2 className="text-lg font-bold text-brand">Política de privacidade</h2>
          <p>
            Para mais detalhes sobre coleta e uso de dados, consulte a{" "}
            <Link href="/politica-de-privacidade" className="text-brand font-semibold underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <Link href="/" className="inline-block mt-10 text-brand font-bold hover:underline">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
