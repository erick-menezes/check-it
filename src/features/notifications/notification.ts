import {
  type LucideIcon,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Users,
} from 'lucide-react-native';

export type NotificationType =
  | 'budgetAlert'
  | 'priceChange'
  | 'goalAchieved'
  | 'collaboration';

export interface AppNotification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly read: boolean;
}

export interface NotificationTypeMeta {
  readonly tintClass: string;
  readonly color: string;
  readonly Icon: LucideIcon;
}

export const NOTIFICATION_TYPE_CATALOG: Readonly<
  Record<NotificationType, NotificationTypeMeta>
> = {
  budgetAlert: {
    tintClass: 'bg-checkit-danger/[0.18]',
    color: '#E13E3E',
    Icon: TriangleAlert,
  },
  priceChange: {
    tintClass: 'bg-checkit-accent/[0.18]',
    color: '#F2B807',
    Icon: TrendingUp,
  },
  goalAchieved: {
    tintClass: 'bg-checkit-primary/[0.18]',
    color: '#58AB6A',
    Icon: Trophy,
  },
  collaboration: {
    tintClass: 'bg-checkit-info/[0.18]',
    color: '#5180F9',
    Icon: Users,
  },
};
