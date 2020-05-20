const TRIM_CONSTANT = 25;

export function trimString(data: string): string {
  if (!data) {
    return '-';
  }
  return data.toString().substr(0, TRIM_CONSTANT) + (data.toString().length > TRIM_CONSTANT ? '...' : '');
}
