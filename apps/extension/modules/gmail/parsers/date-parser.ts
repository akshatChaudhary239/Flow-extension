import * as chrono from 'chrono-node';

export function extractDeadline(text: string): Date | null {
  const results = chrono.parse(text);
  if (results.length > 0) {
    return results[0].start.date();
  }
  return null;
}
