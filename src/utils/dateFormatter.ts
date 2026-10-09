export function formatOutreachDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatOutreachTime(startIso: string, endIso?: string): string {
  try {
    const startDate = new Date(startIso);
    const startStr = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (!endIso) {
      return `${startStr} onwards`;
    }

    const endDate = new Date(endIso);
    const endStr = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${startStr} – ${endStr}`;
  } catch {
    return 'Time not specified';
  }
}

export function isEventToday(isoString: string): boolean {
  try {
    const eventDate = new Date(isoString);
    const today = new Date();
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

export function isEventTomorrow(isoString: string): boolean {
  try {
    const eventDate = new Date(isoString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      eventDate.getDate() === tomorrow.getDate() &&
      eventDate.getMonth() === tomorrow.getMonth() &&
      eventDate.getFullYear() === tomorrow.getFullYear()
    );
  } catch {
    return false;
  }
}
