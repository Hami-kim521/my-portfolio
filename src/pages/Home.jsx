import Section from '../components/Section.jsx'
import { colors } from '../theme.js'

export default function Home() {
  return (
    <>
      <Section id="hero" label="01 · HERO" title="Hero" dark>
        여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
      </Section>
      <Section id="about" label="02 · ABOUT ME" title="About Me" bg={colors.bgSecondary} buttonLabel="더 알아보기">
        여기는 About Me 섹션입니다. 간단한 자기소개와 '더 알아보기' 버튼이 들어갈 예정입니다.
      </Section>
      <Section id="skills" label="03 · SKILL TREE" title="Skill Tree">
        여기는 Skill Tree 섹션입니다. 기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
      </Section>
      <Section id="projects" label="04 · PROJECTS" title="Projects" bg={colors.bgSecondary} buttonLabel="더 보기">
        여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 '더 보기' 버튼이 들어갈 예정입니다.
      </Section>
      <Section id="contact" label="05 · CONTACT" title="Contact" dark>
        여기는 Contact 섹션입니다. 연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
      </Section>
    </>
  )
}
