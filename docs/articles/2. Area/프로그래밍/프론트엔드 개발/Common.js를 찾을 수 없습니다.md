---
tags:
  - CommonJS
created: 2021-02-12T00:00:00.000Z
published: true
title: Common.js를 찾을 수 없습니다
---

# Common.js를 찾을 수 없습니다

📅 2021. 02. 12

# CommonJS는 프로젝트 이름입니다
자바스크립트 개발자라면 CommonJS라는 단어를 한번쯤 들어보셨을거에요.
저는 이게 당연히 라이브러리의 일종이라고 생각했었습니다.
React.js, Vue.js를 읽을 때 리액트제이에스 라고 읽지 리액트쩜제이에스 라고 읽지는 않잖아요? 그래서 저도 Common.js라는 라이브러리가 있다고 생각했었죠.
하지만 구글링을 해보면 놀랍게도 CommonJS는 라이브러리가 아닌 프로젝트 이름이라는 걸 알 수 있습니다.

> CommonJS는 웹 브라우저 밖의 자바스크립트를 위한 모듈 생태계의 규칙을 설립하기 위한 프로젝트이다. - 위키백과

프로젝트인건 알겠는데, 무슨 프로젝트인지는 아직 감이 잘 안오네요. 🤔
왜 프로젝트 이름을 CommonJS라고 지은것이며 이 프로젝트는 어디다 쓰는 걸까요?

# javascript: not just for browsers any more!
CommonJS의 공식 홈페이지에 들어가보면 __'자바스크립트: 더 이상 브라우저만의 것이 아닙니다!'__ 라고 설명하는 문구를 발견할 수 있습니다. 문구를 보니 약간 감이 오시지 않나요?
CommonJS는 자바스크립트가 브라우저 뿐만 아니라 다양한 플랫폼에서 범용적으로 사용할 수 있도록 명세를 정의하는 일을 하고 있답니다. 플랫폼중엔 대표적으로 서버사이드 어플리케이션인 Node.js가 CommonJS의 명세를 가져와서 사용하고 있죠.

# Node.js는 CommonJS를 어떻게 쓰고있나요? 
Node.js는 [CommonJS Modules 1.0](http://www.commonjs.org/specs/modules/1.0/ "Modules 1.0") 명세를 사용해서 [모듈 시스템](https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules "CommonJS modules")을 정의했어요.
Node.js는 자바스크립트 파일을 하나의 모듈로 취급해요. 각 모듈은 독립된 실행 영역을 가지기 때문에 변수끼리 충돌되는 문제가 없어요.

> 뒤로가기 누르고 싶어지네요. 쉽게 설명해봐요.

아래 그림을 한번 보세요.

![](https://i.imgur.com/cbR2AHt.png)


`app.js`와 `logger.js`가 있네요. `logger.js`는 `module.exports` 문법을 사용해서 자기가 정의한 변수들을 바깥으로 내보내고 있어요. 덕분에 `app.js`에서는 `logger.js`에서 정의한 변수들을 사용할 수 있게 됬어요.
만약 모듈 시스템이 없었다면 어떨까요? `app.js`에 모든 로직을 다 때려넣어야 된다고 상상해보세요. 수많은 문제들이 제 머릿속을 스쳐가네요. 똑같은 변수명을 쓰는 건 상상도 못할 일이고, 디버깅을 하려면 스크롤바를 하루종일 왔다갔다해야겠죠.

# 모듈 시스템은 어떻게 생겼나요?
Node.js의 모듈은 의외로 간단하게 생겨먹었어요.

```js
(function(exports, require, module, __filename, __dirname) {
    // 모듈 코드
});
```

사실 Node.js는 모듈을 실행하기 전에 모듈마다 위의 함수를 덮어씌워요. 미용실에서 머리 감아주기 전에 얼굴에 천을 덮어주는것 처럼요.

![](https://i.imgur.com/PHBCQpW.png)

 사진 - Node.js가 모듈에 Wrapper function을 덮어주는 모습

아까 모듈은 각자 독립적인 영역을 갖고 있다고 했죠? 이렇게 노드가 자체적으로 만든 함수로 감싸준 덕분에 최상위 레벨 변수(`const`, `let`, `var`)를 마구마구 쓸 수 있어요. 서로 독립된 영역으로 취급되기 때문이죠.

# 결론
- CommonJS는 자바스크립트를 모든 플랫폼에서 써먹으려는 프로젝트 이름이에요.
- Node.js는 CommonJS의 명세를 가져와서 모듈을 구축했어요.
- Node.js는 자바스크립트 파일을 하나의 모듈로 취급해요.
- Node.js는 모듈을 실행하기 전에 모듈이 각자의 독립적인 영역을 가질 수 있도록 함수를 씌워줘요.

# 그 외에 하고싶은 이야기
CommonJS 외에도 AMD(Asynchronous Module Definition)와 `import`를 사용하는 ES6 모듈에 대해서도 알아보시는 걸 추천드려요 😊