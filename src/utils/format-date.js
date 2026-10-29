/**
 * 작성 시각을 '오후 3:07' 처럼 카카오톡 스타일로 보여주고, 오늘이 아니면 날짜를 앞에 붙입니다.
 *
 * @param {string} isoString - ISO 8601 시각 문자열
 * @returns {string}
 */
export function formatChatTime(isoString) {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
  if (date.toDateString() === new Date().toDateString()) {
    return time;
  }
  const day = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  return `${day} ${time}`;
}
