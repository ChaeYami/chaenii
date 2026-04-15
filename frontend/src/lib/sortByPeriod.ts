/**
 * "2024.01 - 2024.06" 형태의 period에서 종료 시점을 숫자로 추출.
 * 진행 중(끝 날짜 없음)이면 최댓값 반환 → 가장 앞에 정렬.
 */
export function periodEndValue(period?: string): number {
  if (!period) return 0;
  const parts = period.split(/[-~]/).map((s) => s.trim());
  const end = parts[parts.length - 1];
  if (!end) return Number.MAX_SAFE_INTEGER; // 진행 중
  const numeric = end.replace(/\./g, "").trim();
  return parseInt(numeric) || 0;
}

export function sortByPeriodDesc<T extends { period?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => periodEndValue(b.period) - periodEndValue(a.period));
}
