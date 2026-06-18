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

export const LAST_UPDATED_LABEL = 'Atualizado em 14 de maio de 2026';

export const TERMS_SUMMARY: DocumentSummary = {
  Icon: FileText,
  heading: 'Resumo em uma frase',
  copy: 'O Check.it organiza suas listas e gastos; seus dados continuam seus e você pode sair quando quiser.',
};

export const PRIVACY_SUMMARY: DocumentSummary = {
  Icon: ShieldCheck,
  heading: 'O essencial sobre privacidade',
  copy: 'Coletamos o mínimo, não vendemos seus dados e você pode apagá-los a qualquer momento.',
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
    title: 'Cadastro e conta',
    body: 'Algumas funcionalidades exigem login com conta Google. Você é responsável por manter a segurança dessa conta e por todas as atividades realizadas a partir dela.',
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
    body: 'Podemos atualizar estes termos a qualquer momento. Avisaremos sobre alterações importantes pelo app ou pelo e-mail cadastrado.',
  },
  {
    title: 'Encerramento',
    body: 'Você pode excluir sua conta a qualquer momento nas configurações. Podemos suspender contas que violem estes termos.',
  },
] as const;

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    Icon: Inbox,
    title: 'Dados que coletamos',
    body: 'Coletamos apenas o necessário para o app funcionar: e-mail vinculado à conta Google, listas que você cria, produtos adicionados, preços e categorias.',
  },
  {
    Icon: ChartColumn,
    title: 'Como usamos seus dados',
    body: 'Usamos seus dados para sincronizar listas entre dispositivos, gerar gráficos de gastos pessoais e mostrar comparações de preço entre suas próprias listas.',
  },
  {
    Icon: Users,
    title: 'Compartilhamento',
    body: 'Não vendemos seus dados. Compartilhamos informações apenas com prestadores de serviço técnicos necessários para a operação do app (armazenamento, autenticação).',
  },
  {
    Icon: Lock,
    title: 'Armazenamento',
    body: 'Seus dados ficam armazenados em servidores localizados no Brasil e são protegidos por criptografia em trânsito e em repouso.',
  },
  {
    Icon: CircleCheck,
    title: 'Seus direitos',
    body: 'Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento. Basta nos enviar uma mensagem pelo canal de suporte.',
  },
  {
    Icon: Eye,
    title: 'Cookies e identificadores',
    body: 'Usamos identificadores anônimos para entender como o app é usado e melhorar a experiência. Esses dados não são vinculados à sua identidade.',
  },
] as const;
