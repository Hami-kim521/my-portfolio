/**
 * About Me 페이지 초기 데이터.
 * 홈 탭의 About 섹션에서 보여줄 항목은 showInHome 이 true 인 섹션입니다.
 */
export const initialAboutMeData = {
  basicInfo: {
    name: '김하미',
    education: 'Northumbria University at Newcastle Upon Tyne, MA',
    major: 'Multidisciplinary Innovation',
    experience: '신입',
    photo: `${import.meta.env.BASE_URL}profile.svg`, // 여자 캐릭터 이미지 (정사각형, base 경로 포함)
  },
  sections: [
    {
      id: 'dev-story',
      title: '나의 개발 스토리',
      content:
        '디자인을 공부했고, 코드를 배우면서 디자인과 코드를 결합한 업무를 하게 되었습니다.\n그 과정에서 코드에 대해 더 깊이 알고 싶어졌습니다.',
      showInHome: true,
    },
    {
      id: 'philosophy',
      title: '개발 철학',
      content: '효율적이고 재사용이 가능한 코드를 짜는 것을 중요하게 생각합니다.',
      showInHome: true,
    },
    {
      id: 'goal',
      title: '성장 목표',
      content: '디자인과 개발을 동시에 할 수 있는 인재가 되고 싶습니다.',
      showInHome: true,
    },
    {
      id: 'personal',
      title: '개인적인 이야기',
      content:
        '크로스핏 덕분에 매일 나 자신의 한계를 시험하고 있습니다.\n새로운 분야에 도전하는 데 두려움이 없습니다.',
      showInHome: false,
    },
  ],
}
