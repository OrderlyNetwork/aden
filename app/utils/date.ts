export function formatDate(date: string | Date): string {
  const inputDate = new Date(date);
  const today = new Date();
  
  // Reset time part for date comparison
  const isToday = inputDate.getDate() === today.getDate() &&
                  inputDate.getMonth() === today.getMonth() &&
                  inputDate.getFullYear() === today.getFullYear();

  if (isToday) {
    // Format time as HH:mm
    return inputDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } else {
    // Format date as YYYY-MM-DD
    return inputDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
} 