---
tags:
  - React
  - RTL
  - ReactTestingLibrary
created: 2023-06-18T00:00:00.000Z
published: true
title: React Testing Library에서 마크업 직접 확인하기
---

# React Testing Library에서 마크업 직접 확인하기
---

`screen.logTestingPlaygroundURL()`는 Testing Library가 제공하는 함수로써 테스트에서 이 함수가 호출되는 시점에 문서 내에 어떤 요소를 그리고 있는지 직접 확인할 수 있도록 페이지 URL을 제공한다.
(스크린샷 1) 원하는 지점에다가 코드를 넣고 테스트를 실행하면 URL이 뜬다.
(스크린샷 2) URL에 들어가보면 화면이 어떻게 렌더링 되있는지 볼 수 있다. CSS는 Testing Playground에서 사용하는 디자인이 기본으로 적용되있다.
[jest-preview](https://github.com/nvh95/jest-preview) 만큼의 재현력은 아니지만 간단하게 화면 확인하는 용도로 좋은거 같다.

![](https://i.imgur.com/BLWe9X4.png)

![](https://i.imgur.com/dKIQnrK.png)
