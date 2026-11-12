import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar.jsx'
import PageLoader from './components/PageLoader.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'

export default function App() {
  const { pathname } = useLocation()

  // 페이지를 옮기면 맨 위에서 시작합니다. (안 그러면 이전 페이지의 스크롤 위치가 그대로 남습니다.)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageLoader />
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        {/* 헤더가 화면 위에 고정되어 있으므로, 히어로가 없는 페이지는 헤더 높이만큼 비워 둡니다. */}
        {pathname !== '/' && <Box aria-hidden="true" sx={{ height: { xs: 56, md: 84 } }} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Box>
    </Box>
  )
}
