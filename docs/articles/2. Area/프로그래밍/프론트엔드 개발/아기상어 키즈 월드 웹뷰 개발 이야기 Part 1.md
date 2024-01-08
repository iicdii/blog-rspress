---
tags:
  - HTML
  - JavaScript
  - NextJS
  - React
created: 2022-02-08T00:00:00.000Z
published: true
title: 아기상어 키즈 월드 웹뷰 개발 이야기 Part 1
---

# 아기상어 키즈 월드 웹뷰 개발 이야기 Part 1

📅 2022. 02. 08

# 서론
[아기상어 키즈 월드](https://apps.apple.com/kr/app/%EC%95%84%EA%B8%B0%EC%83%81%EC%96%B4-%ED%82%A4%EC%A6%88-%EC%9B%94%EB%93%9C/id1596897739 "아기상어 키즈 월드") 앱 기획팀에서 웹뷰에 띄울 페이지를 개발해달라는 요청을 받았습니다.

웹뷰: 모바일 앱에서 웹페이지를 임베드하는 기능

![](https://i.imgur.com/vemwwi2.png)

<p style="text-align:center">이벤트 웹뷰 페이지의 UX Flow</p>

웹개발팀은 주로 사내 백오피스 개발 업무를 담당하고 있지만 종종 대외용 페이지 개발 업무를 맡기도 합니다. 주변 분들이 핑크퐁 개발자라고 하면 핑크퐁에서 무슨일 하세요? 혹시 핑크퐁 만드신 분은 아니시죠? 라는 질문을 종종 받는데 사실이 아닙니다. 😅 저희 팀 대부분은 사내 부서들의 업무 효율성 향상에 기여하는 일들을 주로 하고 있답니다.

웹뷰 페이지를 개발할 때는 일반 페이지와는 다르게 네이티브 앱과의 연동을 고려하면서 개발해야 합니다. 뒤로 가기를 눌렀을 때 다시 네이티브 앱으로 돌아가는 기능을 예로 들 수 있겠습니다. 첫번째 파트에서는 웹뷰 페이지 개발환경을 어떻게 구성했는지 설명드리고 두번째 파트에서는 배포 과정과 모바일과의 연동성을 위해 어떤 부분을 신경썼는지, 그리고 개발하면서 발생한 문제점과 해결 과정을 소개드릴 예정입니다.

# 개발환경 구성
## Next.js
Next.js는 React를 위한 Meta-Framework(하나 이상의 다른 프레임워크에 기반을 둔 프레임워크)입니다. 최근에는 Next.js 12 버전에서 러스트 컴파일러 swc를 도입하면서 빌드 속도를 기존에 비해 5배 향상시켜 화제가 되었었죠.

![](https://i.imgur.com/vMyIGAI.png)

<p style="text-align:center">Next.js 12 버전 출시 당시 레딧 반응</p>

처음엔 React에서 SSR/SSG를 쉽게 할 수 있도록 만들어진 프레임워크였지만 다양한 기능들이 추가되면서 2022년 1월 기준 현재는 CRA의 npm 다운로드 숫자를 10배나 넘었습니다.

![](https://i.imgur.com/oRuViSu.png)

<p style="text-align:center">npm 다운로드 추이 비교 (CRA vs Next)</p>

아기상어 키즈 월드 웹뷰 프로젝트도 Next.js를 사용해서 개발이 완료되었습니다. Next.js의 [Static Html Export](https://nextjs.org/docs/advanced-features/static-html-export "Static HTML Export") 기능을 이용해서 정적 페이지를 생성하고, AWS S3 정적 웹사이트 호스팅을 이용해 서비스를 구성했으며, Github Actions로 배포 과정을 자동화하여 버튼 하나로 쉽게 서비스를 업데이트 할 수 있는 환경을 구성했습니다.

이번 프로젝트 뿐만 아니라 사내 프로젝트의 대부분도 Next.js로 프론트엔드로 구현이 되어있는데요. Next.js를 계속 사용하게 되는 이유 중 하나는 생산성을 높여주고 유지보수에 도움을 주기 때문입니다. 특히 React-router같은 외부 라이브러리에 대한 의존없이 라우팅이 가능하다는 점이 큰 강점으로 느껴졌습니다. 요즘에는 `eslint`와 같이 국룰처럼 사용되는 도구들도 `create-next-app`으로 프로젝트를 생성해보면 자동으로 설정이 되있어서 완벽한 Zero Config에 점점 더 가까워지는 느낌이 들었습니다.

## 서버가 필요할까?
프로젝트를 구성할 때 서버를 두어야 할지 고민이 들어서 서버를 두었을 때의 장점과 단점을 한 번 정리해보았습니다.

|                                                                                                     | **서버 O** | **서버 X (SSG)**  |
|-----------------------------------------------------------------------------------------------------|--------|---------|
| [Built-in i18n routing](https://nextjs.org/docs/advanced-features/i18n-routing)                     | O      | X       |
| 비용                                                                                                | 서버 비용 | S3 비용 |
| [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) 지원 | O      | X       |

위에서부터 차례대로 살펴보도록 하겠습니다.

**Built-in i18n routing**은 지원하는 언어 목록을 지정하고, 기본 언어를 설정하면 자동으로 사용자의 언어 설정을 감지해서 라우팅을 처리하는 기능입니다. [공식 문서](https://nextjs.org/docs/advanced-features/i18n-routing#how-does-this-work-with-static-generation "how-does-the-i18n-routing-work-with-static-generation")를 살펴보면 SSG로 생성한 사이트는 현재 빌트인 다국어 라우팅을 지원하지 않는다고 나와있습니다. 아마 서버쪽에 로직이 있기 때문에 SSG에선 지원이 되지 않는거 같습니다. 하지만 빌트인 기능을 이용하지 않아도 이를 구현하는 방법이 있습니다. 이에 대한 내용은 아래에서 따로 설명하겠습니다.

**비용**에 대한 부분도 무시할 수가 없지요. 상시 서버를 두는 경우와 SSG로 생성된 파일을 S3 정적 웹호스팅으로 서비스하는 경우를 비교해봤을 때 당연히 상시 서버의 비용히 월등히 높습니다. 다만, 서버를 서버리스로 구성하는 경우 요청 수가 엄청나게 많지 않은 이상 상시 서버에 비해 비용을 현저히 줄일 수 있습니다. 서버리스로 구성하는 경우[ Vercel로 호스팅](https://vercel.com/solutions/nextjs "nextjs-on-vercel")을 하거나 [serverless-next.js](https://github.com/serverless-nextjs/serverless-next.js "serverless-next.js")로 배포하는 방법이 있겠습니다. 

**ISR(Incremental Static Regeneration)은 전체 빌드없이 해당 정적 페이지만 빌드하는 기술**입니다. 예를 들어 `revalidate: 60`을 설정해두면 해당 페이지에 요청이 들어온 시점에서 60초 뒤에 서버에서 해당 페이지만 다시 빌드 후 새로 빌드된 페이지를 내려줍니다. 서버가 있어야만 사용할 수 있습니다.

이 외에도 서버가 있으면 이미지 최적화같은 기능을 사용할 수 있습니다. (SSG를 사용했을 때 사용할 수 없는 기능들을 더 보려면 [공식문서](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features "static-html-export-unsupported-features")를 참조해주세요.) 하지만 요구사항을 검토해봤을 때 서버 없이도 충분히 구현이 가능했기 때문에 저는 서버를 따로 두지 않았습니다. 상세한 이유를 정리해보면 다음과 같습니다.

- 요구사항에 의하면 필요한 페이지는 목록 페이지 3개 + 상세 페이지 3개 = 총 6개 입니다. 여기에 서버는 약간 오버스펙이라는 생각이 들었습니다.
- i18n 라우팅은 Built-in i18n routing 없이도 구현이 가능합니다.
- ISR 역시 탐나는 기능이지만 필수사항은 아닙니다.

따라서 웹뷰는 서버없이 정적 페이지로만 구성된 서비스로 호스팅하기로 결정하게 되었습니다. 정적 페이지만으로도 요구사항을 충분히 만족할 수 있었고 S3 기반 정적 웹 사이트에 대한 쿼리는 모두 무료이기 때문에 서버 비용도 절감하는 효과를 보게 되었습니다.

## i18n routing 구현하기
SSG를 사용하면 Next.js의 Built-in i18n routing을 사용할 수 없습니다. 하지만 [getStaticPaths](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths "get-static-paths")을 사용하면 같은 페이지를 언어별로 다르게 생성할 수 있습니다. 먼저 pages에 `[locale]` 폴더를 만든 뒤 하위 폴더에 페이지를 생성합니다. 페이지 안에 아래와 같은 함수를 작성해줍니다.

```js
// path: pages/[locale]/pagename.js
const SUPPORT_LANGUAGES = ['ko', 'en'];

export function getStaticPaths() {
  return {
    paths: SUPPORT_LANGUAGES.map((locale) => ({
      params: {
        locale,
      },
    })),
    fallback: false,
  };
}
```

이렇게 함수를 작성하면 빌드시 다음과 같은 경로로 페이지가 생성됩니다.

```
out
└── ko
│   └──pagename.js
└── en
│   └──pagename.js
```

i18n routing을 만들어놓으면 클라이언트에서 별도의 자바스크립트 로직을 구현하지 않아도 되는 이점이 있습니다. 예를 들어 `/about?langauge=ko`와 같이 쿼리 파라메터로 언어를 식별하는 경우 클라이언트에서 해당 언어를 렌더링하는 시간이 필요합니다. i18n routing의 경우 미리 언어별로 페이지가 렌더링 되있기 때문에 렌더링 속도가 더 빠르다는 장점이 있습니다. 

## next-intl로 다국어 구현하기
다국어 기능을 구현하기 위해 Next.js에서 주로 사용하는 다국어 라이브러리 4종을 비교해봤습니다.

| **패키지**      | **깃허브 스타** | **용량 (minified + gzipped)** | **Example** |
|----------------|-----------------|------------------------------|-------------|
| next-i18next   | 2,886           | 21.4kb                       | O           |
| next-intl      | 176             | 12kb                         | O           |
| next-translate | 1,430           | 1.8kb                        | O           |
| rosetta        | 622             | 425b                         | O           |

웹뷰 프로젝트는 next-intl을 써서 구현했습니다. 단순하게 공식 문서에서 소개해 주길래 썼는데, 지금 보니 다른 라이브러리에 비해서 용량적으로 큰 이점이 있거나 스타가 높은 것도 아니라서 아쉬움이 들었습니다. 하지만 직접 사용해본 결과 사용법 만큼은 정말 직관적이고 단순해서 좋았습니다.

먼저 다국어 정보를 json에 입력해야 합니다. 저는 아래 경로처럼 폴더를 구성했습니다.

```
messages
└── campaign // 이벤트 페이지에 사용될 다국어
│   │  ko.json
│   └──en.json
└── faq // FAQ 페이지에 사용될 다국어
│   │  ko.json
│   └──en.json
└── notice // 공지사항 페이지에 사용될 다국어
│   │  ko.json
│   └──en.json
└── shared // 공용 다국어
│   │  ko.json
│   └──en.json
```

JSON 파일은 먼저 네임스페이스로 사용될 키를 지정하고 값에 다국어 데이터들을 넣으면 됩니다. 아래는 공용으로 사용될 `shared/en.json`의 예시입니다.

```json
// path: messages/shared/en.json

{
  "Common": {
    "button": {
      "readMore": "Read More",
      "ok": "OK",
      "cancel": "Cancel"
    },
    "empty": "No data available.",
  },
  "Error": {
    "network": "Check your network connection and try again.",
    "status": {
      "404": "The requested data could not be found.",
      "500": "An error has occurred in the server."
    },
  }
}
```

JSON 파일을 만들었으면 `_app.js`에서 `NextIntlProvider`를 불러옵니다. `NextIntlProvider`는 HOC 컴포넌트이며 해당 페이지에서 사용될 다국어 데이터를 갖고 있습니다. 나중에 호출할 `useTranslations` hook을 호출하면 이 Provider에서 데이터를 가져오게 됩니다.

```js
import { NextIntlProvider } from 'next-intl';

export default function App({ Component, pageProps }) {
  const locale = pageProps.locale;

  return (
    <>
      <Head>
        <title>Baby Shark World</title>
      </Head>
      <NextIntlProvider
        locale={locale}
        messages={pageProps.messages}
        now={new Date()}
      >
        <Component {...pageProps} />
      </NextIntlProvider>
    </>
  );
}
```

그리고 다국어를 적용할 페이지에 `getStaticProps` 함수를 통해 페이지에 다국어 데이터를 불러와줍니다. 여기서 불러온 다국어 데이터들은 위에서 정의한 `NextIntlProvider`에게 넘겨집니다.

```js
// path: pages/[locale]/campaign.js

export function getStaticProps({ params }) {
  const locale = params.locale;
  return {
    props: {
      locale,
      messages: {
        ...require(`messages/shared/${locale}.json`),
        ...require(`messages/campaign/${locale}.json`),
      },
    },
  };
}
```

`useTranslations` 함수에 네임스페이스를 넣어서 호출하면 `NextIntlProvider`로부터 다국어 오브젝트를 받아서 접근할 수 있습니다. 접근 방식은 `a.b.c`와 같이 상위 키 -> 하위 키로 접근하면 됩니다.

```js
import { useTranslations } from 'next-intl';

export default function Campaign() {
  const t = useTranslations('Common');
  return (
    <button>{t('button.ok')}</button>  
  );
}
```

next-intl 라이브러리를 사용하면서 아쉬웠던 점은 `defaultLocale`이 없어서 해당 다국어 데이터가 없을 때 기본 언어로 대체해서 보여줄 수 없다는 점(fallback 설정 불가)이 아쉬웠습니다. 하지만 세팅과 사용법이 단순해서 빠르게 개발을 진행할 수 있다는 점이 좋았습니다.

만약에 해당 다국어 키가 없는 경우 기본적으로 설정된 에러가 뜨게 되는데, 에러 메세지 또는 에러 메세지 처리 로직 자체를 변경하고 싶다면 [공식 문서](https://next-intl-docs.vercel.app/docs/usage/error-handling "error-handling")를 참조하셔서 작업하시면 됩니다.

## antd-mobile로 UI 구현하기
웹개발팀에서 만드는 프로젝트는 주로 [Ant design](https://ant.design/ "ant design")을 써서 어드민 페이지를 개발하고 있는데, 컴포넌트도 다양하고 디자인 퀄리티도 프로덕션 레벨에서 쓸 수 있을만큼 괜찮습니다. [Ant Design Mobile](https://mobile.ant.design/ "ant design mobile") 라이브러리도 같은 ant-design에서 개발한 모바일 UI용 라이브러리입니다. 상단 네비게이션 바 라던지 모바일에서 자주 쓰는 UI들이 컴포넌트로 쉽게 쓸 수 있도록 구현되있기 때문에 쉽게 모바일용 페이지를 구현할 수 있습니다.

antd-mobile의 한 가지 단점을 꼽자면 이슈가 대부분 중국어로 작성되어 있다는 점입니다. 물론 번역기를 사용하면 되지만 번거롭기도 하고 무언가 찾고싶을 때 허들이 생긴다는 점이 좀 아쉬웠습니다.

Next.js에서 antd-mobile을 쓸 때는 [next-transpile-modules](https://github.com/martpie/next-transpile-modules "next-transpile-modules") 패키지를 반드시 함께 설치해서 사용해야 합니다. 만약 해당 패키지 없이 컴포넌트를 import해서 사용할 경우 다음과 같은 에러가 발생합니다.

> Global CSS cannot be imported from within node_modules.

antd-mobile은 컴포넌트 파일 안에 css를 함께 동봉해서 별도의 글로벌 css import없이 사용하도록 설계되있는데, Next.js는 노드 모듈에서 CSS 모듈이 아닌 `.css` 파일을 트랜스파일링하지 않기 때문에 해당 오류가 발생하는 것입니다. 이에 대한 내용은 [Antd mobile 공식 문서](https://mobile.ant.design/guide/ssr "antd-mobile-with-nextjs")에서도 확인할 수 있습니다. 현재 Next.js에서 이 문제에 대해서 [토론](https://github.com/vercel/next.js/discussions/27953 "RFC: Global CSS Imports")이 이루어지고 있으니 관심있으신 분은 한번 확인해보세요.

만약 `jest`를 사용해서 테스트 환경을 구성하는 경우 `jest.config.js` 파일에 아래 설정을 해줘야합니다.

```js
{
  ...
  transformIgnorePatterns: ['./node_modules/(?!(antd-mobile)/)']
}
```

`transformIgnorePatterns`은 트랜스파일링을 하지 않을 파일 패턴을 설정하는 옵션입니다. 보통 `transformIgnorePatterns`: ['./node_modules/']와 같이 설정할텐데 antd-mobile은 트랜스파일링이 필요하므로 해당 옵션을 넣어줘야 jest 실행시에 에러가 없어집니다.

`./node_modules/(?!(antd-mobile)/)`는 `antd-mobile`은 트랜스파일링을 하고, 나머지 모듈은 안 해도 된다는 의미로 해석할 수 있습니다.

이번 첫번째 파트에서는 어떤 기술스택으로 개발환경을 구성했는지와 구성 과정에서의 고민과 문제 해결방법을 설명드렸습니다. [다음 파트](https://harimkim.netlify.app/baby-shark-world-for-kids-web-view-development-story-part-2/ "next-part")에서는

- Next.js 빌드 결과물을 S3 정적 웹 호스팅으로 배포하기
- URL에 html 확장자 없이 접근하는 법
- S3 커스텀 에러 페이지 설정하기
- 딥링크로 백버튼 구현하기
- 100vh에서 스크롤이 생기는 이유와 해결 방법

에 대해서 다뤄보겠습니다. 감사합니다.