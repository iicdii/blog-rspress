---
tags:
  - HTML
  - JavaScript
  - NextJS
  - React
created: 2022-02-08T00:00:00.000Z
published: true
title: 아기상어 키즈 월드 웹뷰 개발 이야기 Part 2
---

# 아기상어 키즈 월드 웹뷰 개발 이야기 Part 2

📅 2022. 02. 08

안녕하세요. 지난 파트에서는 Next.js, Antd Mobile, next-intl로 개발 환경을 구성하는 과정에 대해 설명드렸는데요. 이번 글에서는 S3 정적 웹 호스팅에 결과물을 배포했던 경험에 대해 짧게 공유드리고, 개발중에 생겼던 문제점과 해결 방법에 대해서 소개해드리겠습니다.
## S3 정적 웹 호스팅에 배포하기
Next.js 빌드 결과물을 S3 정적 웹 호스팅에 배포했던 과정을 간략하게 정리해보았습니다.

1. S3에 버킷을 생성합니다.
2. S3 접근 권한을 퍼블릭으로 설정합니다.
3. S3 버킷 정책에 다음 정책을 추가합니다.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<S3 버킷명>/*"
        }
    ]
}
```

4. `package.json` 파일을 다음과 같이 바꿔줍니다.

```json
"scripts": {
  "build": "next build && next export"
}
```

그리고 `yarn build`를 실행하면 `out` 폴더에 정적 페이지가 생성됩니다.

5. `out` 폴더의 내용물을 버킷에 업로드 합니다.
6. 속성 > 정적 웹 사이트 호스팅 > 편집에서 S3 정적 웹 호스팅 설정을 활성화합니다.
![](https://i.imgur.com/ySYPfRl.png)

만약 별도의 에러 페이지가 있는 경우 **오류 문서** 필드에 파일 경로를 입력해주고, 없으면 빈 상태로 저장을 누릅니다.

### URL에 html 확장자 없이 접근하는 법
S3 호스팅 설정 후 페이지를 접근해보면 404 에러가 떠서 당황하실 수 있습니다. 경로에 html 확장자를 붙이지 않아서 뜨는 에러라고 볼 수 있습니다. 해결 방법은 `next.config.js`에서 `trailingSlash: true` 설정을 해주면 됩니다.

![](https://i.imgur.com/EqFQOGr.png)
<p style="text-align:center">좌: `trailingSlash`: false, 우: `trailingSlash`: true</p>

좌측은 `trailingSlash` 옵션을 `false`로 하고 `export` 했을 때의 폴더 구조이고, 우측은 `true`로 했을 때 폴더 구조입니다. `trailingSlash`을 `true`로 하면 페이지를 폴더화시키고 안에 `index.html` 파일을 만듭니다.

결과물을 S3에 업로드 해보면 `.html` 확장자 없이 접근이 가능한 걸 확인할 수 있습니다.

### S3 커스텀 에러 페이지 설정하기
만약 경로에 오타가 있거나 변경되어 없는 페이지에 접근했을 경우 아마존 S3 에러 페이지가 뜨게 됩니다. 

![](https://i.imgur.com/zV1zbTw.png)


사용자 입장에서 S3 에러 페이지를 보게 되는 경우 굉장히 부자연스러울 수 있기 때문에 커스텀 에러 페이지를 연결해두는 것이 좋습니다.

```js
// path: pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

먼저 `pages/404.js` 경로에 파일을 만들고 원하는 대로 커스터마이징을 합니다. 그 후 S3 정적 호스팅 설정의 **오류 문서** 필드에서 `404/index.html`파일을 연동해두면 잘못된 경로에 접근했을 때 아래와 같은 자연스러운 에러 페이지를 보여줄 수 있습니다.

![](https://i.imgur.com/8ziZ5CA.png)


## 딥링크로 백버튼 구현하기
딥링크란 웹페이지에서 모바일 앱으로 이동할 수 있는 차원의 문이라고 생각하시면 됩니다. 웹에서 웹으로 이동할 때는 `http`로 시작하는 도메인 링크를 사용하면 되지만 모바일 앱으로 이동시킬때는 특별한 주소가 필요합니다.

딥링크는 URI 스킴, Android 앱링크, iOS 유니버셜 링크 세 가지가 있습니다. URI 스킴은 흔히 접할 수 있는 URI 방식입니다. (예: `market://details?id=com.example.your.package`) Android 앱링크, iOS 유니버셜 링크는 구글과 애플에서 정한 특별한 양식이 있으며 스킴과 다르게 고유하다고 합니다. 회사마다 이 링크 관리 방식이 다르기 때문에 앱 개발자 분들께 꼭 여쭤보고 사용하도록 합시다. 저희는 내부적으로 앱마다 URI 스킴을 정해두고 사용하고 있다고 해서 iOS, Android 개발자 분들과의 논의를 통해 어떤 스킴과 파라메터를 넘겨줄지 정하고 노션 문서에 기록해두었습니다.

제가 받은 요구사항은 백버튼을 눌렀을 때 웹뷰를 띄운 앱으로 다시 돌아가야하는 것입니다. 간단하게 `a`태그의 `href` 속성에 URI 스킴을 넣어주면 됩니다. 아래는 예시입니다.

```html
<a href="market://details?id=com.example.your.package">뒤로가기</a>
```

만약 a 태그를 사용할 수 없는 경우 `onClick` 등의 함수에 `window.location.href`를 써서 강제로 이동시켜주면 됩니다. 아래는 함수 예시입니다.

```js
const handleGoBack = () => {
  window.location.href = 'market://details?id=com.example.your.package';
}
```

## 100vh에서 스크롤이 생기는 이유와 해결 방법
엘리먼트를 가로/세로 중앙 정렬하기 위해 DOM에 `height: 100vh;`를 적용했는데 iOS에서 스크롤이 생기는 이슈가 발생했습니다. 왜 이런 문제가 발생하는 걸까요?

![](https://i.imgur.com/zYW3TN4.png)


브라우저마다 CSS를 해석하는 방법이 조금씩 다르기 때문입니다. 사진 왼쪽을 보시면 iOS Safari는 하단의 네비게이션바 까지를 `100vh`로 해석하고 있습니다. 네비게이션바 만큼의 공간이 추가되어 스크롤이 생기는 것입니다.

제가 사용한 해결방법은 초기 화면 진입시 렌더링된 윈도우 사이즈를 height로 잡아주는 것입니다. 먼저 윈도우 사이즈를 구하는 hook을 작성해줍니다.

```js
import { useState, useEffect } from 'react';

/**
 * 현재 브라우저 윈도우의 width, height를 가져오는 hook
 * @return {{width: undefined | number, height: undefined | number }}
 */
function useWindowSize() {
  // SSR/CSR 매치를 위해 width/height 초기값을 undefined로 설정
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    // 초기 윈도우 사이즈를 얻기 위해 바로 함수를 실행
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
``` 

그리고 HOC 컴포넌트를 만들어줍니다. 저는 모든 페이지의 상위 컴포넌트로 사용할 `BasicLayout`이라는 컴포넌트를 미리 만들어두었었기 때문에 해당 컴포넌트에 만들어둔 훅을 사용했습니다.
```js
// BasicLayout.js

import { useState, useEffect } from 'react';
import useWindowSize from 'utils/hooks/useWindowSize';

function BasicLayout(props) {
  const { height } = useWindowSize();

  // ios, android 등 모바일 기기의 100vh 이슈 해결
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${height}px`);
  }, [height]);

  return (
    <div className="container">
      {props.children}
    </div>
  );
}
```

이렇게 하면 `BasicLayout` 컴포넌트가 렌더링 될 때 렌더링 된 윈도우의 높이를 갖는 `--vh`가 전역변수로 설정이 됩니다. 이후 아래처럼 

```css
// BasicLayout.module.css

.container {
  display: flex;
  height: var(--vh);
  flex-direction: column;
}
```

CSS를 설정해주면 container의 height는 `--vh`에 따라 바뀌게 됩니다. 즉, 항상 윈도우 최대 높이 사이즈로 고정이 됩니다.

![](https://i.imgur.com/Kpa2qFU.png)

캡처 화면을 보시면 현재 윈도우 높이대로 `--vh`가 설정되있으며, container 클래스를 가진 element도 같은 높이를 가지고 있는걸 확인할 수 있습니다. 

이번 글에서는 S3에 배포하는 과정과 딥링크, 모바일 100vh에서 스크롤 이슈와 해결 방법등에 대해서 설명해보았습니다. 글에서는 생략되었지만 Github Actions와 같은 CI를 사용하면 S3 배포 과정을 자동화할수도 있습니다. 매번 빌드하고 파일을 업로드 하는 것은 굉장히 비효율적이기 때문에 자동화 프로세스를 잘 구축해놓는것이 좋습니다.

이번 웹뷰 프로젝트는 사실 네이티브 앱과 크게 상호작용을 요구하는 요구사항은 없었기 때문에 난이도가 높지는 않았습니다. 만약 추후 고도화가 되서 고급 개발 기술이 들어간다면 구현 과정을 새 게시물로 한 번 남겨보도록 하겠습니다.

읽어주셔서 감사합니다.