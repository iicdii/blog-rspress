---
source: https://react.dev/blog/2025/02/14/sunsetting-create-react-app
published: true
created: 2025-03-26T00:00:00.000Z
tags:
  - clippings
  - React
title: (번역) Create React App 지원 종료
---

# (번역) Create React App 지원 종료

📅 2025. 03. 26

이 글은 React 공식 블로그의 [Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)을 한국어로 번역한 글입니다.

> 2025년 2월 14일, [Matt Carroll](https://twitter.com/mattcarrollcode)과 [Ricky Hanlon](https://bsky.app/profile/ricky.fm) 작성

---

오늘, 우리는 새로운 앱을 위한 [Create React App](https://create-react-app.dev/)을 지원 중단하고, 기존 앱들은 [[(번역) Create React App 지원 종료#프레임워크로 마이그레이션하는 방법|프레임워크로 마이그레이션]]로 마이그레이션하거나 Vite, Parcel, RSBuild와 같은 [[(번역) Create React App 지원 종료#프레임워크로 마이그레이션하는 방법|빌드 도구로 마이그레이션]]할 것을 권장합니다.

또한 프레임워크가 프로젝트에 적합하지 않거나, 자신만의 프레임워크를 구축하고 싶거나, [처음부터 React 앱을 구축](https://react.dev/learn/build-a-react-app-from-scratch)하여 React가 어떻게 작동하는지 배우고 싶은 경우를 위한 문서도 제공합니다.

---

2016년에 Create React App을 출시했을 때, 새 React 앱을 만들 수 있는 명확한 방법이 없었습니다.

React 앱을 만들기 위해서는 많은 도구를 설치하고 JSX, 린팅, 핫 리로딩과 같은 기본 기능을 지원하도록 직접 연결해야 했습니다. 이는 올바르게 수행하기 매우 까다로워서 [커뮤니티](https://github.com/react-boilerplate/react-boilerplate)에서 [일반적인](https://github.com/kriasoft/react-starter-kit) [설정](https://github.com/petehunt/react-boilerplate)을 위한 [보일러플레이트](https://github.com/gaearon/react-hot-boilerplate)를 [만들었습니다](https://github.com/erikras/react-redux-universal-hot-example). 그러나 보일러플레이트는 업데이트하기 어려웠고, 이러한 분열로 인해 React가 새로운 기능을 출시하기 어려웠습니다.

Create React App은 여러 도구를 하나의 권장 구성으로 결합함으로써 이러한 문제를 해결했습니다. 이를 통해 앱은 새로운 도구 기능으로 쉽게 업그레이드할 수 있었고, React 팀은 상당히 복잡한 도구 변경사항(Fast Refresh 지원, React Hooks 린트 규칙)을 가능한 많은 사용자에게 배포할 수 있었습니다.

이 모델은 너무 유명해서 오늘날 이런 방식으로 작동하는 도구들을 분류하는 카테고리가 있습니다.

## Create React App 지원 중단

Create React App은 시작하기 쉽지만, 고성능 프로덕션 앱을 구축하기 어렵게 만드는 [[(번역) Create React App 지원 종료#빌드 도구의 한계|여러 제한 사항]]이 있습니다. 원칙적으로, 우리는 이를 본질적으로 [[(번역) Create React App 지원 종료#프레임워크 사용을 권장하는 이유|프레임워크]]로 발전시켜 이러한 문제를 해결할 수 있습니다.

그러나 현재 Create React App을 더 이상 유지보수 하는 사람이 없고, 이미 이러한 문제를 해결하는 많은 기존 프레임워크가 있기 때문에 Create React App을 지원 중단하기로 결정했습니다.

오늘부터 새 앱을 설치하면 지원 중단 경고가 표시됩니다:

```
create-react-app은 지원 중단되었습니다. react.dev에서 최신 React 프레임워크 목록을 찾을 수 있습니다. 자세한 정보는 react.dev/link/cra를 참조하세요. 이 오류 메시지는 설치당 한 번만 표시됩니다.
```

Create React App [웹사이트](https://create-react-app.dev/)와 GitHub [저장소](https://github.com/facebook/create-react-app)에도 지원 중단 공지를 추가했습니다. Create React App은 유지보수 모드로 계속 작동할 것이며, React 19와 함께 작동하도록 Create React App의 새 버전을 게시했습니다.

## 프레임워크로 마이그레이션하는 방법

[새로운 React 앱](https://react.dev/learn/creating-a-react-app)은 프레임워크로 만드는 것을 권장합니다. 우리가 권장하는 모든 프레임워크는 클라이언트 측 렌더링([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))과 단일 페이지 앱([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))을 지원하며, 서버 없이 CDN이나 정적 호스팅 서비스에 배포할 수 있습니다.

기존 앱의 경우, 다음 가이드가 클라이언트 전용 SPA로 마이그레이션하는 데 도움이 될 것입니다:

- [Next.js의 Create React App 마이그레이션 가이드](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
- [React Router의 프레임워크 도입 가이드](https://reactrouter.com/upgrading/component-routes)
- [Expo webpack에서 Expo Router로의 마이그레이션 가이드](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## 빌드 도구로 마이그레이션하는 방법

앱에 특별한 제약이 있거나, 자신만의 프레임워크를 구축하여 이러한 문제를 해결하는 것을 선호하거나, 처음부터 React 작동 방식을 배우고 싶다면 Vite, Parcel 또는 Rsbuild를 사용하여 React로 자신만의 사용자 정의 설정을 구축할 수 있습니다.

기존 앱의 경우, 다음 가이드가 빌드 도구로 마이그레이션하는 데 도움이 될 것입니다:

- [Vite Create React App 마이그레이션 가이드](https://www.robinwieruch.de/vite-create-react-app/)
- [Parcel Create React App 마이그레이션 가이드](https://parceljs.org/migration/cra/)
- [Rsbuild Create React App 마이그레이션 가이드](https://rsbuild.dev/guide/migration/cra)

Vite, Parcel 또는 Rsbuild를 시작하는 데 도움이 되도록 [처음부터 React 앱 구축하기](https://react.dev/learn/build-a-react-app-from-scratch)에 대한 새로운 문서를 추가했습니다.

##### 심층 분석

#### 프레임워크가 필요한가요?

대부분의 앱은 프레임워크를 사용하면 이점을 얻을 수 있지만, 처음부터 React 앱을 구축해야 하는 타당한 경우도 있습니다. 좋은 경험 법칙은 앱에 라우팅이 필요하다면 프레임워크를 사용하는 것이 좋다는 것입니다.

Svelte에 Sveltekit, Vue에 Nuxt, Solid에 SolidStart가 있는 것처럼, [[(번역) Create React App 지원 종료#프레임워크 사용을 권장하는 이유|React는 라우팅을 데이터 가져오기 및 코드 분할과 같은 기능과 완전히 통합하는 프레임워크 사용을 권장합니다.]] 이렇게 하면 복잡한 구성을 직접 작성하고 본질적으로 자신만의 프레임워크를 구축해야 하는 어려움을 피할 수 있습니다.

그러나 항상 Vite, Parcel 또는 Rsbuild와 같은 빌드 도구를 사용하여 [처음부터 React 앱을 구축](https://react.dev/learn/build-a-react-app-from-scratch)할 수 있습니다.

계속 읽으면 [[(번역) Create React App 지원 종료#빌드 도구의 한계|빌드 도구의 한계]]와 [[(번역) Create React App 지원 종료#프레임워크 사용을 권장하는 이유|프레임워크를 권장하는 이유]]에 대해 자세히 알 수 있습니다.

## 빌드 도구의 한계

Create React App과 같은 빌드 도구는 React 앱 구축을 쉽게 시작할 수 있게 해줍니다. `npx create-react-app my-app`을 실행하면 개발 서버, 린팅, 프로덕션 빌드가 포함된 완전히 구성된 React 앱이 생성됩니다.

예를 들어, 내부 관리 도구를 구축하는 경우 랜딩 페이지부터 시작할 수 있습니다:

```jsx
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

이를 통해 JSX, 기본 린팅 규칙, 개발 및 프로덕션 환경에서 실행할 수 있는 번들러와 같은 기능을 사용하여 즉시 React로 코딩을 시작할 수 있습니다. 그러나 이 설정에는 실제 프로덕션 앱을 구축하는 데 필요한 도구가 누락되어 있습니다.

대부분의 프로덕션 앱은 라우팅, 데이터 가져오기, 코드 분할과 같은 문제에 대한 솔루션이 필요합니다.

### 라우팅

Create React App에는 특정 라우팅 솔루션이 포함되어 있지 않습니다. 처음 시작할 때는 `useState`를 사용하여 경로 간 전환하는 방법이 있습니다. 하지만 이렇게 하면 앱 링크를 공유할 수 없게 됩니다 - 모든 링크가 같은 페이지로 이동하고, 시간이 지남에 따라 앱 구조화가 어려워집니다:

```jsx
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

이것이 Create React App을 사용하는 대부분의 앱이 [React Router](https://reactrouter.com/) 또는 [Tanstack Router](https://tanstack.com/router/latest)와 같은 라우팅 라이브러리로 라우팅을 추가하는 이유입니다. 라우팅 라이브러리를 사용하면 앱에 추가 경로를 추가할 수 있어 앱 구조에 대한 의견을 제공하고 경로에 대한 링크를 공유할 수 있습니다. 예를 들어, React Router로 경로를 정의할 수 있습니다:

```jsx
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ 각 경로는 고유의 URL을 가집니다
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

이렇게 수정하고 `/dashboard` 링크로 접속하면 앱이 대시보드 페이지로 이동합니다. 라우팅 라이브러리를 사용하면 중첩 경로, 경로 가드, 경로 전환과 같은 추가 기능을 구현할 수 있으며, 이는 라우팅 라이브러리 없이 구현하기 어렵습니다.

여기서 트레이드오프가 발생합니다: 라우팅 라이브러리는 앱에 복잡성을 추가하지만, 라이브러리 없이 구현하기 어려운 기능도 추가합니다.

### 데이터 가져오기

Create React App에서 또 다른 일반적인 문제는 데이터 가져오기입니다. Create React App에는 특정 데이터 가져오기 솔루션이 포함되어 있지 않습니다. 처음 시작할 때, 일반적인 방법은 데이터를 로드하기 위해 effect에서 `fetch`를 사용하는 것입니다.

하지만 이렇게 하면 컴포넌트가 렌더링된 후에 데이터가 가져와지기 때문에 네트워크 워터폴이 발생할 수 있습니다. 네트워크 워터폴은 코드가 다운로드되는 동안 병렬로 데이터를 가져오는 대신 앱이 렌더링될 때 데이터를 가져오기 때문에 발생합니다:

```jsx
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

effect에서 데이터를 가져오면 데이터를 더 일찍 가져올 수 있음에도 불구하고 사용자가 콘텐츠를 보기 위해 더 오래 기다려야 합니다. 이를 해결하기 위해 [React Query](https://react-query.tanstack.com/), [SWR](https://swr.vercel.app/), [Apollo](https://www.apollographql.com/docs/react), 또는 [Relay](https://relay.dev/)와 같은 데이터 가져오기 라이브러리를 사용할 수 있으며, 이들은 컴포넌트가 렌더링되기 전에 요청을 시작할 수 있도록 데이터를 미리 가져오는 옵션을 제공합니다.

이러한 라이브러리는 라우팅 "로더" 패턴과 통합하여 라우트 수준에서 데이터 종속성을 지정할 때 가장 잘 작동하며, 이를 통해 라우터가 데이터 가져오기를 최적화할 수 있습니다:

```jsx
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

초기 로드 시, 라우터는 경로가 렌더링되기 전에 즉시 데이터를 가져올 수 있습니다. 사용자가 앱을 탐색할 때, 라우터는 데이터와 경로를 동시에 가져와 가져오기를 병렬화할 수 있습니다. 이는 화면에서 콘텐츠를 보는 데 걸리는 시간을 줄이고 사용자 경험을 향상시킬 수 있습니다.

그러나 이를 위해서는 앱에서 로더를 올바르게 구성해야 하며, 성능을 위해 복잡성을 감수해야 합니다.

### 코드 분할

Create React App의 또 다른 일반적인 문제는 [코드 분할](https://www.patterns.dev/vanilla/bundle-splitting)입니다. Create React App에는 특정 코드 분할 솔루션이 포함되어 있지 않습니다. 처음 시작할 때는 코드 분할을 전혀 고려하지 않을 수도 있습니다.

이는 앱이 단일 번들로 제공된다는 것을 의미합니다:

```
- bundle.js    75kb
```

하지만 이상적인 성능을 위해서는 코드를 별도의 번들로 "분할"하여 사용자가 필요한 것만 다운로드하도록 해야 합니다. 이는 사용자가 보고 있는 페이지에 필요한 코드만 다운로드함으로써 앱을 로드하기 위해 기다려야 하는 시간을 줄입니다.

```
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

코드 분할을 하는 한 가지 방법은 `React.lazy`를 사용하는 것입니다. 그러나 이는 컴포넌트가 렌더링될 때까지 코드가 가져와지지 않아 네트워크 워터폴이 발생할 수 있습니다. 더 최적화된 솔루션은 코드가 다운로드되는 동안 병렬로 코드를 가져오는 라우터 기능을 사용하는 것입니다. 예를 들어, React Router는 경로를 코드 분할하고 언제 로드할지 최적화하는 `lazy` 옵션을 제공합니다:

```jsx
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

최적화된 코드 분할은 구현하기 어렵고, 사용자가 필요 이상의 코드를 다운로드하게 만드는 실수를 하기 쉽습니다. 캐싱을 최대화하고, 가져오기를 병렬화하고, ["인터랙션 시 임포트"](https://www.patterns.dev/vanilla/import-on-interaction) 패턴을 지원하기 위해 라우터 및 데이터 로딩 솔루션과 통합될 때 가장 잘 작동합니다.

### 그리고 더 많은 것들...

이것들은 Create React App의 한계에 대한 몇 가지 예시일 뿐입니다.

라우팅, 데이터 가져오기, 코드 분할을 통합한 후에는 이제 보류 상태, 네비게이션 중단, 사용자에게 오류 메시지 표시, 데이터 재검증과 같은 문제도 고려해야 합니다. 다음과 같은 문제를 해결해야 하는 전체 카테고리가 있습니다:

- 접근성
- 에셋 로딩
- 인증
- 캐싱
- 오류 처리
- 데이터 변경
- 네비게이션
- 낙관적 업데이트
- 점진적 향상(Progressive Enhancement)
- 서버 사이드 렌더링
- 정적 사이트 생성
- 스트리밍

이 모든 것이 함께 작동하여 가장 최적의 [로딩 시퀀스](https://www.patterns.dev/vanilla/loading-sequence)를 만듭니다.

Create React App에서 이러한 문제를 개별적으로 해결하는 것은 각 문제가 서로 연결되어 있고 사용자가 익숙하지 않은 문제 영역에 대한 깊은 전문 지식이 필요할 수 있기 때문에 어려울 수 있습니다. 이러한 문제를 해결하기 위해 사용자는 Create React App 위에 자신만의 맞춤형 솔루션을 구축하게 되는데, 이는 Create React App이 원래 해결하려고 했던 문제입니다.

## 프레임워크 사용을 권장하는 이유

Create React App, Vite 또는 Parcel과 같은 빌드 도구에서 이러한 모든 부분을 직접 해결할 수는 있지만, 잘 하기는 어렵습니다. Create React App 자체가 여러 빌드 도구를 통합했던 것처럼, 최상의 사용자 경험을 제공하기 위해 이러한 모든 기능을 함께 통합하는 도구가 필요합니다.

빌드 도구, 렌더링, 라우팅, 데이터 가져오기, 코드 분할을 통합하는 이러한 도구 카테고리는 "프레임워크"로 알려져 있습니다 - 또는 React 자체를 프레임워크로 부르기 원한다면 "메타프레임워크"라고 부를 수도 있습니다.

프레임워크는 빌드 도구가 도구링을 쉽게 만들기 위해 몇 가지 의견을 부과하는 것과 같은 방식으로, 훨씬 더 나은 사용자 경험을 제공하기 위해 앱 구조에 대한 몇 가지 의견을 부과합니다. 이것이 우리가 새로운 프로젝트에 대해 [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/), [Expo](https://expo.dev/)와 같은 프레임워크를 추천하기 시작한 이유입니다.

프레임워크는 Create React App과 동일한 시작 경험을 제공하지만, 실제 프로덕션 앱에서 사용자가 어차피 해결해야 하는 문제에 대한 솔루션도 제공합니다.

##### 심층 분석

#### 서버 렌더링은 선택 사항입니다

우리가 추천하는 프레임워크는 모두 [클라이언트 사이드 렌더링(CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) 앱을 만드는 옵션을 제공합니다.

일부 경우에는 CSR이 페이지에 적합한 선택일 수 있지만, 많은 경우에는 그렇지 않습니다. 앱의 대부분이 클라이언트 사이드여도, 종종 [정적 사이트 생성(SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG)이나 [서버 사이드 렌더링(SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR)과 같은 서버 렌더링 기능의 혜택을 받을 수 있는 개별 페이지가 있습니다. 예를 들어 서비스 이용 약관 페이지나 문서 페이지가 있습니다.

서버 렌더링은 일반적으로 클라이언트에 더 적은 JavaScript를 보내고, 전체 HTML 문서를 제공하여 [총 차단 시간(TBD)](https://web.dev/articles/tbt)을 줄임으로써 더 빠른 [첫 콘텐츠 페인트(FCP)](https://web.dev/articles/fcp)를 생성하며, 이는 [다음 페인트까지의 상호작용(INP)](https://web.dev/articles/inp)도 낮출 수 있습니다. 이것이 [Chrome 팀이 권장한](https://web.dev/articles/rendering-on-the-web) 가능한 최상의 성능을 달성하기 위해 전체 클라이언트 사이드 접근 방식보다 정적 또는 서버 사이드 렌더링을 고려하도록 권장하는 이유입니다.

서버 사용에는 트레이드오프가 있으며, 모든 페이지에 항상 최선의 선택은 아닙니다. 서버에서 페이지를 생성하면 추가 비용이 발생하고 생성에 시간이 걸려 [첫 바이트까지의 시간(TTFB)](https://web.dev/articles/ttfb)이 증가할 수 있습니다. 최고 성능의 앱은 각 전략의 트레이드오프를 기반으로 페이지별로 적절한 렌더링 전략을 선택할 수 있습니다.

프레임워크는 원하는 경우 어떤 페이지에서든 서버를 사용할 수 있는 옵션을 제공하지만, 서버 사용을 강제하지는 않습니다. 이를 통해 앱의 각 페이지에 맞는 렌더링 전략을 선택할 수 있습니다.

#### Server Components는 어떤가요?

우리가 추천하는 프레임워크는 또한 React Server Components를 지원합니다.

Server Components는 라우팅과 데이터 가져오기를 서버로 이동하고, 렌더링된 경로 대신 렌더링하는 데이터를 기반으로 클라이언트 컴포넌트에 대한 코드 분할을 가능하게 하며, 최상의 [로딩 시퀀스](https://www.patterns.dev/vanilla/loading-sequence)를 위해 배송되는 JavaScript 양을 줄임으로써 이러한 문제를 해결하는 데 도움을 줍니다.

Server Components는 서버를 필요로 하지 않습니다. 정적 사이트 생성(SSG) 앱을 위해 CI 서버에서 빌드 시에 실행하거나, 서버 사이드 렌더링(SSR) 앱을 위해 웹 서버에서 런타임에 실행할 수 있습니다.

자세한 정보는 [제로 번들 크기 React Server Components 소개](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components)와 [문서](https://react.dev/reference/rsc/server-components)를 참조하세요.

### 참고

#### 서버 렌더링은 SEO만을 위한 것이 아닙니다

서버 렌더링은 [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO)만을 위한 것이라는 일반적인 오해가 있습니다.

서버 렌더링은 SEO를 개선할 수 있지만, 사용자가 화면에서 콘텐츠를 보기 전에 다운로드하고 파싱해야 하는 JavaScript 양을 줄여 성능도 향상시킵니다.

이것이 Chrome 팀이 최상의 성능을 달성하기 위해 전체 클라이언트 사이드 접근 방식보다 정적 또는 서버 사이드 렌더링을 [고려하도록 권장한](https://web.dev/articles/rendering-on-the-web) 이유입니다.

---

*Create React App을 만든 [Dan Abramov](https://bsky.app/profile/danabra.mov)와 Create React App을 수년간 유지 관리한 [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb) 및 [많은 다른 분들](https://github.com/facebook/create-react-app/graphs/contributors)에게 감사드립니다. 이 글을 검토하고 피드백을 제공해 준 [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com) 및 [Theo Browne](https://x.com/theo)에게 감사드립니다.*