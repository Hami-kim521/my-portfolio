import { useContext } from 'react'
import { PortfolioContext } from './portfolio-context.js'

/**
 * 포트폴리오 데이터에 접근하는 훅. PortfolioProvider 안에서만 사용할 수 있습니다.
 *
 * Example usage:
 * const { aboutMeData, homeData, updateSection, updateSkillLevel } = usePortfolio()
 */
export function usePortfolio() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio 는 <PortfolioProvider> 안에서만 사용할 수 있습니다.')
  return value
}
