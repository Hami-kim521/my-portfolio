/**
 * 히어로 반응형 공통 기준값. Navbar·HomeHero·CTA·정보 박스가 같은 값을 쓰게 해서 좌우 선과 간격이 어긋나지 않게 합니다.
 *
 * 화면 구간 (theme.js 의 breakpoints 와 같은 기준)
 *  - 모바일  : xs      ≤ 767px   세로형 레이아웃
 *  - 태블릿  : tablet  768~1199px
 *  - 데스크톱: lg      ≥ 1200px  여유로운 레이아웃
 */

/** 좌우 여백 (theme.spacing 단위: 16 / 32 / 48px). 헤더와 히어로가 같은 값을 씁니다. */
export const HERO_PX = { xs: 2, tablet: 4, lg: 6 }

/** 세로가 짧은 화면(가로 모드 휴대폰 등). 이때는 정보 박스를 숨기고 제목을 세로 기준으로 줄입니다. */
export const SHORT_SCREEN = '(max-height: 520px)'

/** 세로가 다소 낮은 화면(작은 휴대폰 등). 이때는 정보 박스를 작게 줄이고 보조 링크를 숨깁니다. */
export const COMPACT_SCREEN = '(max-height: 700px)'

/** 모바일(768px 미만)과 세로가 낮은 화면이 겹치는 경우 */
export const MOBILE_COMPACT = '(max-width: 767.95px) and (max-height: 700px)'

/**
 * 히어로 제목 글자 크기. 가로(vw)와 세로(svh) 중 작은 쪽을 따라서 어떤 화면에서도 아래쪽 버튼·정보 박스와 겹치지 않습니다.
 *  - 데스크톱: h1(6rem) 이상으로 크게
 *  - 태블릿  : 중간
 *  - 모바일  : h2(3.75rem) 이하
 */
export const HEADLINE_FONT_SIZE = {
  xs: 'clamp(3.2rem, min(15.2vw, 13svh), 3.75rem)',
  tablet: 'clamp(4.5rem, min(11.5vw, calc(36svh - 190px)), 8rem)',
  lg: 'clamp(6rem, min(10.2vw, calc(36svh - 190px)), 11rem)',
}

/** 가로 모드처럼 세로가 짧을 때의 제목 크기 (HEADLINE_FONT_SIZE 뒤에 덮어씌웁니다) */
export const HEADLINE_FONT_SIZE_SHORT = 'clamp(2.4rem, min(9vw, 24svh), 6rem)'

/** 소개 문구(서브 타이틀) 글자 크기: 제목에 비례해서 줄어듭니다 */
export const SUBTITLE_FONT_SIZE = { xs: 16, tablet: 19, lg: 21 }
export const SUBTITLE_CAPTION_FONT_SIZE = { xs: 12, tablet: 12, lg: 13 }
