import {
  ChartColumn,
  CircleCheck,
  Eye,
  FileText,
  Inbox,
  Lock,
  type LucideIcon,
  ShieldCheck,
  Users,
} from 'lucide-react-native';

export type TermsTabId = 'terms' | 'privacy';

export interface SegmentOption<T extends string> {
  readonly id: T;
  readonly label: string;
}

export interface DocumentSummary {
  readonly Icon: LucideIcon;
  readonly heading: string;
  readonly copy: string;
}

export interface TermsSection {
  readonly title: string;
  readonly body: string;
}

export interface PrivacySection {
  readonly Icon: LucideIcon;
  readonly title: string;
  readonly body: string;
}

export const TERMS_TABS: readonly SegmentOption<TermsTabId>[] = [
  { id: 'terms', label: 'Termos de uso' },
  { id: 'privacy', label: 'Privacidade' },
] as const;

export const LAST_UPDATED_LABEL = 'Atualizado em 24 de junho de 2026';

export const TERMS_SUMMARY: DocumentSummary = {
  Icon: FileText,
  heading: 'Resumo em uma frase',
  copy: 'O Check.it organiza suas listas e gastos; seus dados continuam seus e você pode sair quando quiser.',
};

export const PRIVACY_SUMMARY: DocumentSummary = {
  Icon: ShieldCheck,
  heading: 'O essencial sobre privacidade',
  copy: 'Não coletamos seus dados: tudo fica salvo no seu aparelho e você pode apagá-los quando quiser.',
};

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    title: 'Aceite dos termos',
    body: 'Ao baixar, instalar ou usar o Check.it, você concorda com estes Termos de Uso. Se não concorda, por favor não utilize o aplicativo.',
  },
  {
    title: 'Descrição do serviço',
    body: 'O Check.it é um aplicativo de organização de listas de compras que ajuda você a controlar gastos definindo limites por lista e acompanhando totais ao adicionar produtos.',
  },
  {
    title: 'Conta e acesso',
    body: 'Por enquanto, o Check.it funciona sem cadastro: tudo fica salvo apenas no seu aparelho. O login com conta Google está a caminho e, quando estiver disponível, você será responsável por manter a segurança da sua conta.',
  },
  {
    title: 'Conteúdo do usuário',
    body: 'As listas, produtos, preços e qualquer outra informação que você inserir são de sua responsabilidade. Não armazenamos cupons fiscais nem dados bancários.',
  },
  {
    title: 'Uso aceitável',
    body: 'Você concorda em não usar o app para fins ilegais, em não tentar acessar dados de outros usuários e em não interferir no funcionamento do serviço.',
  },
  {
    title: 'Limitações',
    body: 'O cálculo de gastos é apenas uma referência. Não nos responsabilizamos por decisões financeiras tomadas com base nos números exibidos no app.',
  },
  {
    title: 'Mudanças',
    body: 'Podemos atualizar estes termos a qualquer momento. Avisaremos sobre alterações importantes pelo próprio app.',
  },
  {
    title: 'Encerramento',
    body: 'Como seus dados ficam apenas no seu aparelho, você pode apagá-los quando quiser nas configurações do app ou desinstalando-o. Podemos restringir o uso de quem violar estes termos.',
  },
] as const;

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    Icon: Inbox,
    title: 'Dados que ficam no seu aparelho',
    body: 'O Check.it não envia seus dados para nenhum servidor. Suas listas, produtos, preços e categorias ficam salvos apenas no seu dispositivo.',
  },
  {
    Icon: ChartColumn,
    title: 'Como seus dados são usados',
    body: 'Seus dados são usados apenas dentro do app, no próprio aparelho, para organizar listas e gerar seus gráficos de gastos. Nada é transmitido para fora do dispositivo. Recursos de conta e sincronização entre dispositivos estão a caminho — quando chegarem, atualizaremos esta política antes de ativá-los.',
  },
  {
    Icon: Users,
    title: 'Compartilhamento',
    body: 'Não vendemos nem compartilhamos seus dados. Como nada sai do seu aparelho, não há transmissão para terceiros.',
  },
  {
    Icon: Lock,
    title: 'Armazenamento',
    body: 'Seus dados ficam armazenados localmente, apenas no seu dispositivo. Esta versão não usa servidores externos.',
  },
  {
    Icon: CircleCheck,
    title: 'Seus direitos',
    body: 'Você tem controle total: pode editar ou apagar seus dados a qualquer momento dentro do app, ou removê-los por completo desinstalando o aplicativo.',
  },
  {
    Icon: Eye,
    title: 'Cookies e identificadores',
    body: 'Não usamos cookies, rastreadores ou identificadores de publicidade, e não monitoramos como você usa o app.',
  },
] as const;
