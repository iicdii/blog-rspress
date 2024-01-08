---
tags:
  - Safari
  - JavaScript
created: 2023-03-25T00:00:00.000Z
published: true
title: Safari Smooth Scroll Polyfill
---

# Safari Smooth Scroll Polyfill

📅 2023. 03. 25

Safari 15.4 미만에서는 smooth scroll을 사용할 수 없다. Safari에서 smooth scroll을 사용하려면 polyfill을 적용해야 한다.

- https://github.com/magic-akari/seamless-scroll-polyfill (추천)
- https://github.com/iamdustan/smoothscroll

위 라이브러리를 설치하고 엔트리 포인트에서 패키지를 import 해주면 polyfill이 적용된다. scrollTo, scrollIntoView 등 스크롤 관련 자바스크립트 메소드에 폴리필을 넣어준다.
seamless-scroll-polyfill을 smoothscroll보다 추천하는 이유는 smothscroll의 경우 유지보수가 멈췄고, seamless-scroll-polyfill이 타입스크립트로 작성되었기 때문이다.