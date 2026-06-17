const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export function formatRelativeTime(createdAt: string, now: Date): string {
  const elapsedMs = now.getTime() - new Date(createdAt).getTime();
  const seconds = Math.floor(elapsedMs / MS_PER_SECOND);
  if (seconds < SECONDS_PER_MINUTE) return 'agora';
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  if (minutes < MINUTES_PER_HOUR) return `${minutes}min`;
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) return `${hours}h`;
  const days = Math.floor(hours / HOURS_PER_DAY);
  if (days < DAYS_PER_WEEK) return days === 1 ? 'há 1 dia' : `há ${days} dias`;
  const weeks = Math.floor(days / DAYS_PER_WEEK);
  return `há ${weeks} sem`;
}
