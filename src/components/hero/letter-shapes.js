/**
 * 3D 글자(H · A · M · I)의 평면 도형 데이터. three.js 없이도 읽을 수 있도록 순수 데이터로만 둡니다.
 * 좌표는 글자 높이를 1 로 본 단위이고 y 는 위쪽이 + 입니다.
 * (폰트 파일 없이 도형으로 직접 그려서 두껍고 둥근 "부풀린" 글자 모양을 만듭니다.)
 */

/** 모서리를 둥글게 깎는 반지름 */
export const CORNER_RADIUS = 0.07

/** 압출 옵션: bevel(모서리 둥글림)이 클수록 풍선처럼 부푼 느낌이 납니다. */
export const EXTRUDE = { depth: 0.12, bevelThickness: 0.15, bevelSize: 0.075, bevelSegments: 10, curveSegments: 10 }

const T = 0.2 // 획 두께

export const LETTERS = {
  H: {
    width: 0.78,
    outer: [[0, 0], [T, 0], [T, 0.39], [0.78 - T, 0.39], [0.78 - T, 0], [0.78, 0], [0.78, 1], [0.78 - T, 1], [0.78 - T, 0.61], [T, 0.61], [T, 1], [0, 1]],
    holes: [],
  },
  A: {
    width: 1,
    outer: [[0, 0], [0.27, 0], [0.32, 0.2], [0.68, 0.2], [0.73, 0], [1, 0], [0.7, 1], [0.3, 1]],
    holes: [[[0.4, 0.41], [0.6, 0.41], [0.5, 0.76]]],
  },
  M: {
    width: 1.02,
    outer: [[0, 0], [T, 0], [T, 0.6], [0.51, 0.17], [1.02 - T, 0.6], [1.02 - T, 0], [1.02, 0], [1.02, 1], [1.02 - T * 0.8, 1], [0.51, 0.5], [T * 0.8, 1], [0, 1]],
    holes: [],
  },
  I: {
    width: 0.22,
    outer: [[0, 0], [0.22, 0], [0.22, 1], [0, 1]],
    holes: [],
  },
}

/** 이름 HAMI 를 이루는 글자 순서 */
export const LETTER_ORDER = ['H', 'A', 'M', 'I']

/**
 * 압출·bevel 을 거친 뒤 글자의 가로/세로 비율. 글자 자리(DOM)를 미리 같은 비율로 비워 두는 데 씁니다.
 * (bevel 이 바깥쪽으로 bevelSize 만큼 커지므로 양쪽에 더해 줍니다.)
 *
 * @param {string} char - 'H' | 'A' | 'M' | 'I' [Required]
 * @returns {number} 폭 / 높이
 */
export const getLetterAspect = (char) => (LETTERS[char].width + 2 * EXTRUDE.bevelSize) / (1 + 2 * EXTRUDE.bevelSize)
