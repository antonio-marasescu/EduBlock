export function trimString(data: string): string {
  return data.toString().substr(0, 20) + (data.toString().length > 20 ? '...' : '');
}
