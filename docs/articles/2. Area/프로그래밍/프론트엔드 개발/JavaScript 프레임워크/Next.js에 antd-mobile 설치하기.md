---
tags:
  - NextJS
created: 2021-12-09T00:00:00.000Z
published: true
title: Next.js에 antd-mobile 설치하기
---

# Next.js에 antd-mobile 설치하기

📅 2021. 12. 09

![](https://i.imgur.com/VR6LfQM.png)
# 설치중 발생하는 에러 해결하기
Next.js에 antd-mobile을 설치하고 컴포넌트를 불러오면 다음과 같은 에러가 발생한다.
> Global CSS cannot be imported from within node_modules.

해결하려면 먼저 아래 패키지를 설치하고
```sh
yarn add -D next-transpile-modules next-images
```

`next.config.js`에 다음과 같은 설정을 넣어준다.
```js
const withImages = require('next-images')

const withTM = require('next-transpile-modules')([
  'antd-mobile',
]);

module.exports = withTM(withImages({
  // other Next.js configuration in your project
}));
```

위 방법은 [antd-mobile 공식 문서](https://mobile.ant.design/guide/ssr "antd-mobile-ssr-guide")에서도 볼 수 있다.

문제는 해결했는데, 에러는 왜 발생할까?

# 왜 에러가 발생하는가
Next.js의 리드 메인테이너인 [timneutkens](https://github.com/timneutkens "github link of nextjs maintainer")에 의하면 해당 에러가 발생하는 것은 의도된 동작이며, **Next.js가 노드 모듈에 있는 코드를 컴파일하지 않기 때문에 발생하는 에러**라고 한다. css랑 jsx를 같이 퍼블리싱하는 해당 라이브러리의 잘못이라는 것이다.

![Nextjs maintainer comment](//images.ctfassets.net/aygsdsdi1qnw/7Cif1LMSHtk6RvpqcrPXAg/f02e2fb0063f57556d0e007233e83e0b/_______________________________2021-12-09_________________2.37.05.png)

해당 댓글은 보다시피 무수한 비추천을 받고 있는데, 가장 많은 추천을 받은 댓글은 **"how can you control all 3rd part developer don't let them import css to their own library, that's don't make sense. (라이브러리 만든 사람들한테 css를 import해서 쓰라고 우리가 어떻게 강요해? 그건 말이 안돼.)"** 라고 말하고 있다. 결국엔 메인테이너도 이를 인정했는데, 해당 내용은 아래에서 다시 얘기하겠다.

이에 대한 대안으로 나온게 커뮤니티 유저가 만든 `next-transpile-modules` 패키지인 것이다. "Next에서 컴파일 안해주니까 우리가 컴파일 해줄게!"라면서 말이다.

```js
const withTM = require('next-transpile-modules')([
  'antd-mobile',
]);
```

코드를 보면 `([antd-mobile])`과 같이 컴파일이 필요한 라이브러리를 특정할 수 있다. 이 모듈은 jsx, ts, css등 대부분의 확장자를 컴파일 할 수 있다.

- Supports transpilation of all extensions supported by Next.js: .js, .jsx, .ts, .tsx, .mjs, .css, .scss and .sass
- Enable hot-reloading on local packages
- Most setups should work out of the box (npm, yarn, pnpm, ...)

다만 이 패키지는 비공식(unofficial) 패키지이기 때문에 언제든지 호환성 이슈가 발생할 수 있고 소스코드의 수명도 예상할 수 없다는 단점이 있다. 메인테이너는 유저들의 의견을 수용했는지 Github discussion에서 [RFC: Global CSS Imports](https://github.com/vercel/next.js/discussions/27953 "rfc")를 등록하고 공식 레파지토리에 반영하기 위해 검토 중이다. 해당 사안이 적용되면 `next-transpile-modules` 패키지를 제거할 수 있을 것이다.

## jest 에러 해결하기
Next.js 에러를 해결하고 테스트 환경 설정을 하려는데 똑같은 에러가 발생했다.. 😡😡
`jest.config.js`에 다음 옵션을 넣어주면 해결된다.
```js
{
  ...
  transformIgnorePatterns: ['./node_modules/(?!(antd-mobile)/)']
}
```

`transformIgnorePatterns`은 트랜스파일링을 하지 않을 파일 패턴을 설정하는 옵션이다. 보통 `transformIgnorePatterns: ['./node_modules/']`와 같이 설정할텐데 antd-mobile은 트랜스파일링이 필요하므로 해당 옵션을 넣어줘야 jest 실행시에 에러가 없어진다.

`'./node_modules/(?!(antd-mobile)/)'`는 "모듈중 `antd-mobile` 모듈을 제외한 모듈"을 가르킨다.