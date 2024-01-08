---
tags:
  - JavaScript
  - Tampermonkey
created: 2022-03-28T00:00:00.000Z
published: true
title: 라프텔 이어보기 기능 개선하기 (Feat. Tampermonkey)
---

# 라프텔 이어보기 기능 개선하기 (Feat. Tampermonkey)

📅 2022. 03. 28

# 발단
[라프텔](https://laftel.net/ "laftel homepage")에서 영상을 틀었는데 예전에 봤던 장면이 나오고 있었습니다. '이어보기가 안 되나 설마..?' 혹시나 해서 중간에 새로고침을 해보니 0초로 돌아가더군요. 알고 보니 **재생 중간에 창을 닫거나 새로고침을 했을 때는 마지막 시청 시간을 기록하지 않아서 이어보기가 되지 않았습니다.** 중간에 다음화로 넘기는 등 내부의 UI와 상호작용했을 때만 시청 시간이 기록되는 것 같았습니다. '이거 조금만 개발하면 해결될 것 같은데..?' 라는 생각이 들어서 불편 사항을 개선하기 위해 직접 기능을 구현하게 되었습니다.
# 🧹 요구사항 정리
코딩에 들어가기 전에 먼저 요구사항을 정리해보았습니다.

1. JavaScript로 영상의 시간을 조작할 수 있어야 한다.
2. 브라우저 저장소에 영상 별로 마지막 영상 재생시간을 저장할 수 있어야 한다.
3. 크롬 확장 프로그램을 통해 비즈니스 로직을 구현한다.
4. 타 기기와의 연동은 하지 않는다. (일단 DB가 필요하고 일이 너무 커진다.)

먼저 이번 구현의 핵심 요구사항인 1번의 검증을 위해 개발자 도구 콘솔을 열고 비디오 엘리먼트를 가져올 수 있는지 확인해보겠습니다.

```js
video = document.querySelector('video');
```

![](https://i.imgur.com/YrfsSob.png)


비디오 태그를 찾았습니다. 영상 조작도 가능한지 한 번 테스트를 해봅시다.

```js
video.play(); // 잘 된다.
video.currentTime; //=> 49.53147 잘 나온다.
video.currentTime = 10; // 10초로 이동한다.
```

영상 조작이 순조롭게 잘 되네요! '당연한 거 아니야?' 라고 생각하실수도 있지만 jwplayer 같은 플레이어를 쓰는 경우 그 라이브러리의 API를 쓰지 않으면 조작이 안 되는 경우도 존재합니다. 그런 경우는 구현이 살짝 까다로워집니다.

첫번째 요구사항인 **JavaScript로 영상의 시간을 조작할 수 있어야 한다.** 는 증명이 되었습니다.

**두번째로 확인해봐야할 것은 영상 별로 마지막 재생시간을 저장할 수 있는지 여부에 대한 체크입니다.** 재생시간은 `video.currentTime`을 통해 가져올 수 있음이 이미 증명이 되었습니다. 남은 것은 영상 별로 재생시간을 저장하는 일입니다. **영상 별로 저장을 하려면 영상의 고유한 id값이 필요한데, 라프텔의 URL 에서 쉽게 고유 id를 얻을 수 있었습니다.**

영상 재생 화면에서 라프텔의 URL을 보면 `https://laftel.net/player/40192/45492`와 같이 구성이 되있는데요. 첫번째 숫자값은 애니메이션 id, 두번째 숫자값은 에피소드 id 입니다. 이는 애니메이션 종류와 에피소드를 바꿔가면서 테스트 해보면 쉽게 알 수 있습니다.

여기서 key를 `에피소드 id` 또는 `애니메이션 id + 에피소드 id`로 사용할 수 있습니다. 저는 안전하게 후자의 방법을 선택했습니다. 왜냐면 에피소드 id가 고유할지 안 할지는 저희가 DB의 내부 사정을 모르기 때문입니다. 한 번 콘솔에서 `애니메이션 id` 와 `에피소드 id` 를 가져올 수 있는지 확인해보겠습니다.

```js
const [animation, episode] = window.location.pathname.replace('/player/', '').split('/'); // [40192, 45492]로 잘 저장이 된다.
```

잘 가져오네요. 이 값을 localStorage 에 오브젝트의 키로 저장하면 될 거 같습니다.

**두번째 요구사항인 `localStroage` 브라우저 저장소에 영상 별로 마지막 영상 재생시간을 저장할 수 있어야 한다.** 도 만족이 되었습니다.

세 번째 요구사항 - 크롬 확장 프로그램을 통해 비즈니스 로직을 구현한다. - 의 경우 두 가지 선택지가 있는데요. 첫번째는 아예 새로 확장 프로그램을 개발하는 것이고, 두번째는 자바스크립트 주입(inject)을 도와주는 확장 프로그램을 사용하는 것입니다.

저는 **[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)라는 크롬 확장 프로그램을 써서 구현하기로 했습니다. 이 확장 프로그램은 유저가 작성한 자바스크립트를 원하는 사이트에 주입하는 확장 프로그램입니다.** 새로 확장 프로그램을 작성할 수도 있지만, 비즈니스 로직 이외에 신경 써야 할 부분들이 많기 때문에 번거로움을 줄이기 위해 대중적인 툴을 사용했습니다.

요구사항이 정리되었으니 이제 본격적인 구현 단계에 들어가보겠습니다.
# 👨‍💻 구현
Tampermonkey에서 새 스크립트 만들기를 누르면 기본적으로 아래와 같은 코드가 생성됩니다.
```js
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
```

주석을 보면 여러 가지 정보들이 있는데 다른 정보는 나중에 입력하고 `@match` 부분을 먼저 수정할 필요가 있습니다. `@match`는 작성한 패턴과 일치하는 URL에서 스크립트를 실행하는 규칙입니다. 저는 다음과 같이 작성했습니다.

```js
// @match        https://laftel.net/*
```
이렇게 써주면 라프텔 사이트에서만 이 스크립트가 실행됩니다.

이제 영상 조작을 위해 `video` 엘리먼트를 가져오겠습니다.

```js
(function() {
    'use strict';

    const video = document.querySelector('video');
    console.log('video', video);
})();
```
영상 재생 화면에서 새로고침을 해보면 콘솔 창에 로그가 기록된 것을 확인할 수 있습니다. 

![](https://i.imgur.com/WRPfOwm.png)

콘솔을 보면 `null`이 출력된 것을 볼 수 있습니다. `null`이 출력된 이유는 라프텔의 React 컴포넌트가 `video` 요소를 생성하기 전에 저희가 작성한 스크립트가 먼저 실행되었기 때문입니다. 해결 방법은 `setTimeout`을 통해 요소를 가져오기 전에 몇 초 텀을 두거나 해당 엘리먼트가 렌더링될 때 까지 기다리는 방법이 있습니다. 저는 깔끔한 구현을 위해 두번째 방법을 선택했습니다.

엘리먼트가 렌더링될 때 까지 기다리려면 어떻게 해야 할까요? 가장 깔끔한 방법은 [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)를 사용하는 방법입니다. `MutationObserver`를 사용하면 DOM 트리의 변화를 관찰(observe)해서 `video` DOM이 생성되는 시점에 콜백을 받아서 이후 로직을 구현할 수 있습니다. `MutationObserver`를 직접 구현할 수도 있지만 저는 빠른 구현을 위해 [Arrive.js](https://github.com/uzairfarooq/arrive) 라이브러리를 사용했습니다. 소스코드를 살펴보면 이 라이브러리의 내부 구현 로직이 `MutationObserver`을 사용해서 구현되어있음을 알 수 있습니다.

[Arrive.js](https://github.com/uzairfarooq/arrive) 라이브러리를 사용하기 위해선 해당 라이브러리를 불러와야겠죠? Tampermonkey에서 외부 라이브러리를 쓸 때는 주석에 `@require`와 `.js`파일의 경로를 작성합니다. 저는 [cdnjs](https://cdnjs.com/)에서 minified된 `arrive.min.js`을 사용했습니다.

```
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
```

이제 [Arrive.js](https://github.com/uzairfarooq/arrive) 라이브러리의 `arrive` 함수를 사용해서 `video` 태그를 가져와보겠습니다. `arrive` 함수는 selector로 지정한 DOM이 DOM Tree에 도착(arrive)했을 때 콜백을 주는 함수입니다.

```js
document.arrive('video', function () {
  console.log(this); // this에 해당 element가 bind되어 접근이 가능함
});
```

새로고침을 해보면 콘솔에서 video 태그를 `null`이 아닌 Element로 표시하는 걸 확인할 수 있습니다.

![](https://i.imgur.com/OjfSS5V.png)

참고로 `document`에 `arrive`라는 함수가 존재하는 이유는 라이브러리를 호출할 때 `HTMLElement`, `NodeList`, `HTMLCollection`, `HTMLDocument`, `window`의 prototype에 arrive를 포함한 여러가지 함수들을 할당하기 때문입니다. 궁금하신 분들은 원본 [코드](https://github.com/uzairfarooq/arrive/blob/16c5691062e6a081c07882ec4d5fa08f0cdd569f/src/arrive.js#L445-L452 "how arrive js exposed api")를 통해서 확인하실 수 있습니다.

이제 `localStorage`에서 해당 영상의 마지막 시청 기록을 확인해서 있으면 해당 시간으로 영상을 스킵하는 코드가 필요합니다. localStorage에서 쉽게 데이터를 읽고 쓰기 위해서 `getWatchInfo`와 `setWatchInfo`를 작성해 보겠습니다. `localStorage`에는 `object`를 그대로 저장할 수 없어서 `JSON` 형태로 저장하고 불러올 때도 `JSON`을 파싱 하는 방식으로  구현했습니다.

```js
function getWatchInfo() {
  let watchInfo;
  try {
    watchInfo = localStorage.getItem("watchInfo");
  } catch (e) {
    // ignore
  }
  return watchInfo ? JSON.parse(watchInfo) : null;
}

function setWatchInfo(value) {
  try {
    localStorage.setItem("watchInfo", JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}
```
아래 코드는 마지막 시청 시간으로 영상을 이동하는 로직입니다. URL을 파싱 해서 영상의 고유 id로 `localStroage`를 조회하고, 기록된 시간이 있으면 `setTimeout`을 통해 1초 뒤에 해당 시간으로 이동합니다. 테스트해보니 재생 기록이 아예 없는 경우 시간 이동이 되지 않는 상황이 발생해서 예외 처리를 위해 1초의 딜레이를 주었습니다.

```js
// 마지막 시청 시간 있으면 localStroage 에서 불러온 뒤 해당 시간으로 이동
document.arrive("video", function () {
  const video = this;
  const watchInfo = getWatchInfo();
  if (!watchInfo) return;

  const [animation, episode] = window.location.pathname
    .replace("/player/", "")
    .split("/");
  const lastPlaytime = Number(watchInfo[`${animation}-${episode}`]);
  if (!lastPlaytime) return;

  setTimeout(() => { video.currentTime = lastPlaytime; }, 1000);
});
```

이제 마지막 시청 시간을 기록하는 로직을 구현해 보겠습니다. 마지막 시청 시간은 언제 저장해야 할까요? 제가 고민했던 방법은 두 가지인데, 첫 번째는 `setInterval`을 이용해서 일정 주기마다 `localStorage`에 시청 시간을 기록하는 것이고 두 번째는 `window`의 `beforeunload` 이벤트 리스너를 사용해서 창이 닫힐 때 시청 시간을 기록하는 방법입니다. 아마 넷플릭스같이 여러 기기를 지원하는 서비스에서는 첫 번째 방법을 사용하지 않았을까 싶습니다. 하지만 저는 PC에서만 사용할 것을 염두에 두었기 때문에 두 번째 방법을 사용하기로 했습니다.

```js
// 윈도우 닫을 때 마지막 시청 시간 localStorage에 저장
window.addEventListener("beforeunload", function (event) {
  const video = document.querySelector("video");
  const watchInfo = getWatchInfo() || {};
  const [animation, episode] = window.location.pathname
    .replace("/player/", "")
    .split("/");
  if (animation && episode && video.currentTime) {
    watchInfo[`${animation}-${episode}`] = Math.floor(video.currentTime);
    setWatchInfo(watchInfo);
  }
});
```

이렇게 하면 크롬 탭을 닫거나 새로고침을 하는 등 브라우저 창이 종료되는 시점에 마지막 시청 시간이 기록됩니다.

# ✨ 최종 완성 코드
최종적으로 완성된 코드는 다음과 같습니다.

```js
// ==UserScript==
// @name         라프텔 이어보기
// @namespace    https://greasyfork.org/ko/users/894371-harim-kim
// @version      1.1
// @description  라프텔 에피소드 이어보기 기능을 지원하는 스크립트
// @author       Harim Kim
// @match        https://laftel.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laftel.net
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function getWatchInfo() {
        let watchInfo;
        try {
            watchInfo = localStorage.getItem('watchInfo');
        } catch (e) {
            // ignore
        }
        return watchInfo ? JSON.parse(watchInfo) : null;
    }

    function setWatchInfo(value) {
        try {
            localStorage.setItem('watchInfo', JSON.stringify(value));
        } catch (e) {
            // ignore
        }
    }

    // 마지막 시청 시간 있으면 localStroage 에서 불러온 뒤 해당 시간으로 이동
    document.arrive('video', function () {
        const video = this;
        const watchInfo = getWatchInfo();
        if (!watchInfo) return;

        const [animation, episode] = window.location.pathname.replace('/player/', '').split('/');
        const lastPlaytime = Number(watchInfo[`${animation}-${episode}`]);
        if (!lastPlaytime) return;

        setTimeout(() => { video.currentTime = lastPlaytime; }, 1000);
    });

    // 윈도우 닫을 때 마지막 시청 시간 localStorage에 저장
    window.addEventListener("beforeunload", function(event) {
        const video = document.querySelector('video');
        const watchInfo = getWatchInfo() || {};
        const [animation, episode] = window.location.pathname.replace('/player/', '').split('/');
        if (animation && episode && video.currentTime) {
            watchInfo[`${animation}-${episode}`] = Math.floor(video.currentTime);
            setWatchInfo(watchInfo);
        }
    });
})();
```

스크립트를 적용하고 영상 중간에 새로고침을 해보면 아래 영상에서 보시는 것과 같이 마지막 재생 시간으로 이동되는 것을 확인해 볼 수 있습니다.

<p align="center"><video src="https://videos.ctfassets.net/aygsdsdi1qnw/wRvnMGUqdzokCQzZulTAh/35bc8728723a2f84e8386a5e12e239dd/laftel_test_final.mp4" controls="controls" muted="muted" width="640" height="360"></video></p>

이 스크립트를 사용해보고 싶으신 분은 Tampermonkey 확장 프로그램을 설치하신 뒤 [Github Gist Raw 파일 링크](https://gist.github.com/iicdii/6c5f51cda12060c8a8ee2d968dd6ac13/raw/0a1642cde0105eeadbdac57346bf87a7ba0c4014/laftel-contious-watching.user.js)에 들어가서 Install 버튼을 누르면 바로 사용해 보실 수 있습니다.

감사합니다.