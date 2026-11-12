import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'
import { CORNER_RADIUS, EXTRUDE, LETTER_ORDER, LETTERS } from './letter-shapes.js'

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const easeOutCubic = (t) => 1 - (1 - t) ** 3
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a, b, t) => a + (b - a) * t

// 글자별 비행 설정. start: 화면 크기 비율(x, y)과 카메라 쪽 거리(z) / spin: 날아오면서 도는 각도 / end: 자리 잡았을 때의 기울기
const FLIGHTS = [
  { start: { x: -0.62, y: 0.38, z: 760 }, spin: { x: 2.2, y: -4.6, z: 1.1 }, end: { x: 0.1, y: -0.3, z: 0.04 }, arc: 0.2, from: 0.0 },
  { start: { x: 0.66, y: 0.5, z: 900 }, spin: { x: -2.8, y: 4.2, z: -1.5 }, end: { x: -0.08, y: 0.32, z: -0.05 }, arc: -0.18, from: 0.1 },
  { start: { x: 0.28, y: -0.72, z: 700 }, spin: { x: 3.0, y: 3.6, z: 1.8 }, end: { x: 0.12, y: -0.2, z: 0.03 }, arc: 0.16, from: 0.2 },
  { start: { x: -0.5, y: -0.66, z: 820 }, spin: { x: -2.0, y: -4.0, z: -0.9 }, end: { x: -0.1, y: 0.26, z: 0.07 }, arc: -0.2, from: 0.3 },
]
const FLIGHT_SPAN = 0.46 // 한 글자가 날아오는 데 쓰는 진행도 길이 (마지막 글자는 0.76 에 안착, 이후 잠시 머무름)

/** 꼭짓점 목록을 모서리가 둥근 경로로 만듭니다. (각 꼭짓점에서 양쪽으로 r 만큼 물러나 2차 곡선으로 잇기) */
function addRoundedPath(path, points, radius) {
  const count = points.length
  points.forEach(([x, y], index) => {
    const [px, py] = points[(index - 1 + count) % count]
    const [nx, ny] = points[(index + 1) % count]
    const toPrev = new THREE.Vector2(px - x, py - y)
    const toNext = new THREE.Vector2(nx - x, ny - y)
    const r = Math.min(radius, toPrev.length() / 2, toNext.length() / 2)
    toPrev.normalize().multiplyScalar(r)
    toNext.normalize().multiplyScalar(r)
    if (index === 0) path.moveTo(x + toPrev.x, y + toPrev.y)
    else path.lineTo(x + toPrev.x, y + toPrev.y)
    path.quadraticCurveTo(x, y, x + toNext.x, y + toNext.y)
  })
  path.closePath()
}

/** 글자 도형 → 높이 1 로 정규화된 3D 지오메트리 (원점 중심, 부드러운 법선) */
function createLetterGeometry(char) {
  const { outer, holes } = LETTERS[char]
  const shape = new THREE.Shape()
  addRoundedPath(shape, outer, CORNER_RADIUS)
  holes.forEach((hole) => {
    const path = new THREE.Path()
    addRoundedPath(path, hole, CORNER_RADIUS * 0.6)
    shape.holes.push(path)
  })

  let geometry = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, bevelEnabled: true })
  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  const center = box.getCenter(new THREE.Vector3())
  geometry.translate(-center.x, -center.y, -center.z)
  geometry.scale(1 / (box.max.y - box.min.y), 1 / (box.max.y - box.min.y), 1 / (box.max.y - box.min.y))
  geometry = toCreasedNormals(geometry, 0.7) // 면 사이를 부드럽게 이어 풍선처럼 둥글게 보이게 함
  return geometry
}

/**
 * 히어로 무대 위에 3D 글자를 그립니다. 스크롤 진행도(--c)에 맞춰 글자들이 화면 밖에서 날아와
 * 소개 문장 속 [data-letter-slot] 자리에 하나씩 안착합니다. (좌표계: 화면 픽셀 = 월드 단위, z=0 면이 화면)
 *
 * @param {{ canvas: HTMLCanvasElement, stage: HTMLElement, maxPixelRatio?: number }} options - 그릴 캔버스, CSS 변수(--c, --mx, --my)를 가진 무대, 해상도 배율 상한
 * @returns {() => void} 정리(dispose) 함수. WebGL 을 쓸 수 없으면 예외를 던집니다.
 */
export function createLettersScene({ canvas, stage, maxPixelRatio = 1.75 }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = new RoomEnvironment()
  scene.environment = pmrem.fromScene(environment, 0.04).texture
  scene.environmentIntensity = 1.3

  const key = new THREE.DirectionalLight(0xffffff, 1.2)
  key.position.set(-500, 700, 900)
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.12))

  const camera = new THREE.PerspectiveCamera(30, 1, 10, 6000)

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xe4e8ee,
    roughness: 0.26,
    metalness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.7,
  })

  const letters = LETTER_ORDER.map((char, index) => {
    const mesh = new THREE.Mesh(createLetterGeometry(char), material)
    mesh.visible = false
    scene.add(mesh)
    return { mesh, flight: FLIGHTS[index], target: new THREE.Vector3(), size: 100 }
  })

  let width = 1
  let height = 1

  /** 무대 크기에 맞춰 캔버스·카메라를 맞춥니다. z=0 면이 화면 픽셀과 1:1 이 되도록 카메라 거리를 계산합니다. */
  const resize = () => {
    width = stage.clientWidth
    height = stage.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.z = height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    camera.updateProjectionMatrix()
    measureSlots()
  }

  /** 소개 문장 속 글자 자리(DOM)의 위치와 크기를 읽어 목표 지점으로 삼습니다. */
  function measureSlots() {
    const stageRect = stage.getBoundingClientRect()
    const slots = stage.querySelectorAll('[data-letter-slot]')
    letters.forEach((letter, index) => {
      const slot = slots[index]
      if (!slot) return
      const rect = slot.getBoundingClientRect()
      letter.size = rect.height
      letter.target.set(rect.left + rect.width / 2 - stageRect.left - width / 2, height / 2 - (rect.top + rect.height / 2 - stageRect.top), 0)
    })
  }

  const readVar = (name) => parseFloat(stage.style.getPropertyValue(name)) || 0

  let isVisible = true
  let frame = 0
  let wasIdle = false

  /** 지금 그려지고 있는 글자 수를 canvas 의 data-drawn 에 기록합니다. (값이 바뀔 때만 갱신, 동작 확인·디버깅용) */
  const reportDrawn = () => {
    const count = String(letters.filter(({ mesh }) => mesh.visible).length)
    if (canvas.dataset.drawn !== count) canvas.dataset.drawn = count
  }

  const update = (time) => {
    const progress = readVar('--c')
    const mouseX = readVar('--mx')
    const mouseY = readVar('--my')
    const seconds = time / 1000

    // 아직 날아오기 전이면 그리지 않고 한 번만 비웁니다.
    if (progress <= 0.001) {
      if (!wasIdle) {
        letters.forEach(({ mesh }) => { mesh.visible = false })
        renderer.render(scene, camera)
        reportDrawn()
        wasIdle = true
      }
      return
    }
    wasIdle = false

    letters.forEach((letter, index) => {
      const { mesh, flight, target, size } = letter
      const raw = clamp01((progress - flight.from) / FLIGHT_SPAN)
      mesh.visible = raw > 0
      if (!mesh.visible) return

      const move = easeInOutCubic(raw)
      const turn = easeOutCubic(raw)
      const startX = flight.start.x * width
      const startY = flight.start.y * height

      // 곡선 경로: 직선 이동 + 가운데에서 가장 크게 휘는 옆 방향 이동
      const bend = Math.sin(Math.PI * move) * flight.arc * height
      mesh.position.set(
        lerp(startX, target.x, move) + bend * 0.6,
        lerp(startY, target.y, move) + bend,
        lerp(flight.start.z, 0, move),
      )

      // 자리 잡은 뒤에는 마우스를 따라 살짝 기울고 천천히 떠 있습니다.
      const settled = raw >= 1 ? 1 : 0
      const idleRotY = Math.sin(seconds * 0.9 + index * 1.7) * 0.16 + mouseX * 0.32
      const idleRotX = Math.cos(seconds * 0.7 + index) * 0.07 - mouseY * 0.2
      mesh.rotation.set(
        lerp(flight.spin.x, flight.end.x, turn) + idleRotX * settled,
        lerp(flight.spin.y, flight.end.y, turn) + idleRotY * settled,
        lerp(flight.spin.z, flight.end.z, turn),
      )
      mesh.position.y += Math.sin(seconds * 1.1 + index * 2.1) * 3 * settled

      const scale = size * lerp(1.25, 1, turn)
      mesh.scale.setScalar(scale)
    })
    reportDrawn()
    renderer.render(scene, camera)
  }

  const loop = (time) => {
    frame = requestAnimationFrame(loop)
    if (isVisible) update(time)
  }

  // 화면에 보일 때만 그립니다.
  const visibility = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting }, { threshold: 0 })
  visibility.observe(stage)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(stage)
  document.fonts?.ready.then(measureSlots)

  const onContextLost = (event) => {
    event.preventDefault()
    delete stage.dataset.letters // 3D 가 멈추면 DOM 글자를 다시 보여줍니다.
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  resize()
  frame = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(frame)
    visibility.disconnect()
    resizeObserver.disconnect()
    canvas.removeEventListener('webglcontextlost', onContextLost)
    letters.forEach(({ mesh }) => mesh.geometry.dispose())
    material.dispose()
    environment.dispose?.()
    scene.environment?.dispose()
    pmrem.dispose()
    renderer.dispose()
  }
}
