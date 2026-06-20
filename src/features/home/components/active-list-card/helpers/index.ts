export function formatItemCount(count: number): string {
  const unit = count === 1 ? 'item' : 'itens';
  return `${count} ${unit}`;
}

function isSameDay(date: Date, reference: Date): boolean {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  if (isSameDay(date, new Date())) return 'Iniciada hoje';
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}
