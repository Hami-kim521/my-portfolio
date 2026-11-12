/**
 * 홈 화면의 해당 id 섹션까지 부드럽게 스크롤합니다. (HashRouter 에서는 #id 링크를 쓸 수 없어서 직접 스크롤)
 *
 * @param {string} id - 섹션 id (예: 'projects') [Required]
 *
 * Example usage:
 * scrollToId('contact')
 */
export const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
