/**
 * 4꼭지 별 장식. 현재 글자색(currentColor)을 따라갑니다.
 *
 * @param {number|string} size - 한 변 길이 [Optional, 기본값: 40]
 * @param {object} style - 위치·회전 등 추가 스타일 [Optional]
 *
 * Example usage:
 * <Sparkle size={ 48 } style={ { position: 'absolute', top: 100, left: 80 } } />
 */
export default function Sparkle({ size = 40, style }) {
  return (
    <svg width={ size } height={ size } viewBox="0 0 40 40" aria-hidden="true" focusable="false" style={ style }>
      <path d="M20 0 C21.5 12 28 18.5 40 20 C28 21.5 21.5 28 20 40 C18.5 28 12 21.5 0 20 C12 18.5 18.5 12 20 0Z" fill="currentColor" />
    </svg>
  )
}
