interface Greeting {
  greeting: string;
  subtitle: string;
}

export function useGreeting(now: Date = new Date()): Greeting {
  const hour = now.getHours();
  const NOON = 12;
  const EVENING = 18;
  const SUBTITLE = 'Pronto pra próxima compra?';
  if (hour < NOON) return { greeting: 'Bom dia', subtitle: SUBTITLE };
  if (hour < EVENING) return { greeting: 'Boa tarde', subtitle: SUBTITLE };
  return { greeting: 'Boa noite', subtitle: SUBTITLE };
}
