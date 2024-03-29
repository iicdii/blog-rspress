---
tags: null
created: 2021-04-30T00:00:00.000Z
published: true
title: Toss Slash 21 프론트엔드 세션 정리
---

# Toss Slash 21 프론트엔드 세션 정리

📅 2021. 04. 30

![](https://i.imgur.com/JxADnAj.png)

# ✨ 프론트엔드 웹 서비스에서 우아하게 비동기 처리하기
🙍‍♂️ **박서진**님 - https://github.com/raon0211

웹 서비스에서 가장 다루기 어려운 부분은? **비동기 프로그래밍**
- 순서가 보장되지 않음
- 끊기지 않는 60프레임의 좋은 사용자 경험을 위해 필수

### 😇 "좋은 코드"의 입장에서 생각해보기
👎 **읽기 어려운 코드의 특징**

'성공하는 경우'와 '실패하는 경우'가 섞여있음 -> 함수의 크기가 커져 비즈니스 로직이 파악이 어려워짐

👍 **읽기 쉬운 코드의 특징**

`try`, `catch` 안에 `async`, `await`를 넣어서 처리하는 케이스가 대표적

- '성공하는 경우'들만 볼 수 있어서 좋음
- 읽기 쉽고 함수의 역할이 명확히 드러남
- 모든 에러처리를 외부에 위임할 수 있음

### 😈 React의 비동기 처리가 어려운 이유
컴포넌트에서 로딩과 에러 처리를 동시에 수행함
```js
function Profile() {
  const foo = useAsyncValue(() => fetchFoo());
  const bar = useAsyncValue(() => {
    if (foo.error || !foo.data) return undefined;

    return fetchBar(foo.data);
  });

  if (foo.error || bar.error) return <div>로딩 실패</div>;
  if (!foo.data || !bar.data) return <div>로딩중...</div>;
  return /* foo와 bar로 적합한 처리하기 */;
}
```

하나의 비동기 작업은 `로딩`, `에러`, `완료` 3가지의 상태를 가짐. 만약 2개의 비동기 작업을 요청하는 경우 9가지의 상태를 가짐.

![](https://i.imgur.com/mQxXki4.png)


-> 비동기 작업이 많아질수록 복잡성이 늘어남 😭

1. 성공하는 경우에만 집중해 컴포넌트를 구성하기 어렵다
2. 2개 이상의 비동기 로직이 개입할 때, 비즈니스 로직을 파악하기 점점 어려워진다

### 🚀 React Suspense for Data fetching으로 에러, 로딩 상태 분리
![](https://i.imgur.com/EevjfGj.png)


-> `try`, `catch` 구문과 거의 유사한 구조를 가지고 있는 모습을 확인할 수 있음

[Recoil](https://github.com/facebookexperimental/Recoil "recoil")에선 `Async Selector`를 사용,
[SWR](https://github.com/vercel/swr "vercel SWR"), [React Query](https://github.com/tannerlinsley/react-query "react query")에선 `{suspense: true}`를 사용하면 자동으로 컴포넌트의 suspense 상태가 관리됨

# 🔥 JavaScript Bundle Diet
🙍‍♂️ **이한**님 - https://github.com/hahnlee

### 왜 번들사이즈가 중요한가?
페이지 로딩 2초 이내 로드시 이탈율 9%, __5초 초과시 이탈율 38%__
> 바이트별로 보면, 자바스크립트는 같은 크기의 이미지나 웹폰트보다 브라우저가 처리하는 비용이 많이 듭니다. - Tom Dale

JavaScript는 파일을 다운로드한 후 파싱, 컴파일, 실행까지 여러 단계를 거치기 때문에 같은 용량이더라도 처리비용이 높음. 따라서 번들 최적화가 아주 중요함.

### 🔥 번들 사이즈 줄이기
**1. ✨ 원인 찾기** - [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer "webpack bundle analyzer") 추천

- 용량별로 직관적인 시각화
- 사이드바를 이용해 검색과 필터링 가능
- 사용중인 라이브러리의 디펜던시 조회 가능

용량이 큰 라이브러리는 더 가벼운 라이브러리로 대체하고 용도가 겹치는 라이브러리는 하나의 라이브러리로 통일하자.

**2. ✨ 라이브러리 중복 줄이기**

같은 라이브러리지만 버전이 다른 경우가 존재 (Dependency conflict)
패키지 매니저마다 이 문제를 다양한 방식으로 해결
- 더 높은 버전의 라이브러리 사용하기
- 사용자에게 어느 버전을 설치할지 확인받기

**2-1. npm은 어떻게 Dependency conflict를 해결했나**

npm은 tree 구조로 필요한 버전을 모두 다운로드함
-> 디펜던시를 작성자가 의도한 버전대로 동작하는 효과
-> but, 번들 사이즈와 `node_modules` 용량이 커짐

npm은 `node_modules` 용량이 과도하게 커지는 문제를 해결하기 위해 더 높은 버전을 사용
-> 라이브러리들이 [semver](https://semver.org/ "semver")를 지킨다고 가정하기 때문에 메이저 버전이 바뀌지 않는 한 문제가 없다고 판단

`npm dedupe`: 중복된 모듈을 줄일 수 있는 명령어
-> 중복된 라이브러리의 버전을 확인하고 적합한 버전으로 통합

**2-2. yarn은 어떻게 Dependency conflict를 해결했나**

> The dedupe command isn’t necessary. yarn install will already dedupe.

이미 `yarn install`이 dedupe을 알아서 한다고 함. 근데 완벽하지 않음. 😅

[yarn-deduplicate](https://github.com/atlassian/yarn-deduplicate "atlassian/yarn-deduplicate") 라이브러리를 사용해서 중복된 라이브러리 제거를 추천.

**2-3. `yarn2`는 npm처럼 `yarn dedupe`을 지원함**

**2-4. 라이브러리 중복의 쉬운 예시는 `lodash`가 있음**

`lodash`의 문제는 cjs 버전의 `lodash`, esm 버전의 `lodash-es`, 단독 라이브러리 형태의 `lodash.get` 등 같은 패키지가 여러 패키지로 존재

-> 프로젝트에서 `lodash` 패키지 하나만 쓰고 있더라도 디펜던시 때문에 여러개의 `lodash`가 설치될수 있음.

webpack의 `alias` 옵션으로 해결가능
```js
{
  resolve: {
    alias: {
      'lodash-es': 'lodash',
      'lodash.get': 'lodash/get',
      'lodash.isplanobject': 'lodash/isPlainObject'
    }
  }
}
```

**3. ✨ 필요한 라이브러리만 불러오기**
```js
import { merge } from 'lodash';
```
위의 코드는 아래와 같이 변환됨.
```js
var lodash = require('lodash');
var merge = lodash.merge;
```
-> `merge` 함수 하나를 위해 lodash 전체를 로드함 😱
```js
import merge from 'lodash/merge';
```
이렇게 필요한 라이브러리만 불러오면 용량을 줄일 수 있다.

> ...언제 다 바꾸죠? 😫

[babel-plugin-transform-imports](https://github.com/gutenye/babel-plugin-transform-imports "babel-plugin-transform-imports") 사용하면 트랜스파일러가 알아서 바꿔줌!

**4. ✨ 더 가벼운 라이브러리 사용하기**

lodash의 `groupBy`는 함수 하나가 무려 6kb. shorthands 표현, 캐싱등을 지원하기 때문. -> 직접 구현하자

[node-rsa](https://github.com/rzcoder/node-rsa "node-rsa")는 Node.js용으로 만들어진 라이브러리라서 `crypto`, `Buffer`, `Big Number`등의 polyfill 용량만 **100kb** 😱 -> webpack 설정으로 끄자

```js
node: {
  fs: 'empty',
  http2: 'empty',
  child_process: 'empty'
}
```

# 🧹 실무에서 바로 쓰는 Frontend Clean Code
🙍‍♀️ **진유림**님 - https://github.com/milooy/

"그 코드는 안 건드리시는게 좋을 거에요. 일단 제가 만질게요. ^^;;" -> 동료에게 물어봐야 알수 있는 코드는 개발 병목과 유지보수 시간을 연장시킴

> 실무에서 클린코드의 의의 = 유지보수 시간의 단축

-> 코드 파악, 디버깅, 리뷰 시간을 단축시킴

## 🤔 응집도, 단일책임, 추상화 고려하기
## 👉 응집도
> 하나의 목적을 가진 코드가 흩뿌려져 있어요

-> 같은 목적의 코드는 뭉쳐두자

### 무엇을 뭉쳐야 하는가?

뭉치면 쾌적한 코드와 답답한 코드 구분하기

- 뭉치면 쾌적 - 당장 몰라도 되는 디테일
- 뭉치면 답답 - 코드 파악에 필수적인 핵심 정보

클린 코드는 짧은 코드가 아니라 찾고 싶은 로직을 빠르게 찾을 수 있는 코드

## 👉 단일책임
> 함수가 여러가지 일을 하고 있어요

-> 하나의 일을 하는 뚜렷한 이름의 함수를 만들자

## 👉 추상화
> 함수의 세부구현 단계가 제각각이에요

-> 핵심 개념을 뽑아내자

![](https://i.imgur.com/3sV2K7u.png)

![](https://i.imgur.com/AUpaMyk.png)


# 📦 Micro-frontend React, 점진적으로 도입하기
🙍‍♂️ **조유성**님 - https://github.com/g6123

## 배경
- Django + jQuery 조합의 기술적 한계 -> 부분적으로 React를 적용해보자
- [webpack-bundle-tracker](https://github.com/django-webpack/webpack-bundle-tracker "webpack-bundle-tracker")와 [django-webpack-loader](https://github.com/django-webpack/django-webpack-loader "django-webpack-loader") 플러그인을 이용해서 Django와 React를 연동하는데 성공
- 토스 인터널에 포함된 25개 여의 서비스를 React로 작성함

## 문제점
25개의 서비스는 서로 다른 webpack entrypoint를 가지지만, 하나의 `package.json`에서 빌드를 함. 이는 다음과 같은 문제가 생김.

### 😈 의존성 지옥
패키지 하나 업데이트 했을 뿐인데 25개 서비스 중 일부 서비스에서 에러가 뿜뿜해버림

![](https://i.imgur.com/mt8uhHq.png)

![](https://i.imgur.com/LU71ZDS.png)


### ⌛ 길어진 빌드 시간
코드 한 줄만 수정해도 모든 빌드를 새로 해야함

![](https://i.imgur.com/yai2SML.png)

![](https://i.imgur.com/ruSa6gC.png)


## 2. 마이크로 프론트엔드 아키텍처를 도입한 이유와 후기
### 마이크로 프론트엔드 아키텍처를 도입한 이유
- 소스 코드부터 빌드 설정까지 완벽한 격리
- 의존성 지옥 탈출
- 빌드 속도 최적화
![](https://i.imgur.com/2vfrOsg.png)


### 구현 방법
- 기존의 거대한 소스 코드를 독립적인 패키지들로 분리
![](https://i.imgur.com/5xw6APC.png)


패키지를 세 가지로 분리하여 구성

- 동일한 빌드 툴링을 공유하기 위한 "인프라 패키지"
- 공통 소스코드를 관리하기 위한 "라이브러리 패키지"
- 페이지에서 독립적으로 작동하는 "서비스 패키지"

![](https://i.imgur.com/1dDxn9c.png)


### 마이크로 프론트엔드 도입 후기
- 다른 전략을 갖고 개발되는 제품들이 다르게 개발 될 수 있게 됨 (= 기술적인 독립)
- 한 화면에서도 각 부분을 담당하는 개발자가 자율과 책임의 원칙에 따라 독립적으로 의존성을 결정하고 코드를 결정
- 엔지니어 간의 커뮤니케이션이 줄어듬

## 3. 🚀 프론트엔드 빌드 시간을 효과적으로 단축한 비법

### 빌드 시간을 줄이는 가장 좋은 방법은 빌드를 하지 않는 것
"Zero-Build" -> 소스 코드가 바뀐 패키지만 빌드하고 나머지는 기존 빌드 결과물을 재사용하기!

### 특정 패키지의 소스 코드가 바뀌었는지는 어떻게 판단하나요?
Git 커밋 해쉬 비교
![](https://i.imgur.com/AHhnCtU.png)


### 기존 빌드 결과물은 어디에 저장하나요?
Git 저장소에 `gzip`으로 압축해서 저장
![](https://i.imgur.com/C0D88D7.png)


### 빌드 속도 Before, After
결과적으로 빌드 속도가 최대 15배 향상함
![](https://i.imgur.com/zuBYbrx.png)

