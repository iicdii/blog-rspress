---
tags:
  - TroubleShooting
  - JavaScript
created: 2024-04-12T00:00:00.000Z
published: true
title: 크롬 하위버전 SyntaxError - Invalid regular expression 에러 해결하기
---

# 크롬 하위버전 SyntaxError - Invalid regular expression 에러 해결하기

📅 2024. 04. 12

# 문제
- Sentry에서 `SyntaxError: Invalid regular expression` 에러 확인됨
- 크롬 하위버전에서 에러 발생하여 화면이 렌더링되지 않는 문제로 확인

![[chromium_emoji_syntax_error.png]]
Chrome 68의 개발자 콘솔에서 문제 발생 코드를 직접 실행해 본 스크린샷
# 대상
- Chrome `< 69`
- Zod
	- `>= 3.21.0`
	- `< 3.22.4`
# 트러블슈팅
- Sentry에 보고된 Chromium 65 버전을 [저장소](https://raw.githubusercontent.com/Bugazelle/chromium-all-old-stable-versions/master/chromium.stable.json)를 통해 다운로드 후, 직접 해당 URL로 접근한 결과 원인을 찾을 수 있었음
- [원인 코드](https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b#diff-52632a4861fc9d7dc2dacef13cd91d60286dd706c1bb57438b8ee6a579a8796aL573)는 다음과 같음
```ts
const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
```
- JavaScript는 정규식 표현에 유니코드를 사용하여 원하는 문자열들을 쉽게 구분할 수 있는 기능을 지원함
	- 참고: MDN, [unicode character class escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape)
- 유니코드 중 `Extended_Pictographic`([ECMAScript 스펙](https://www.unicode.org/reports/tr51/#def_level1_emoji))은 크롬 69 버전부터 지원
	- `Extended_Pictographic`은 기술적으로는 이모지가 아닌 "픽토그래픽" 문자열을 포함하는 이모지
	- ex: `"1😂💯♡⌨︎"`에서 `'😂'`, `'💯'` 뿐만 아니라 `'♡'`와 `'⌨︎'`까지 모두 포함
- 정확한 문제 발생 버전 확인을 위해 65 ~ 70 버전을 다운받은 뒤 실행해보니 69 버전부터는 코드가 정상 동작하는 것을 확인 
# 해결책
- zod 버전을 v3.22.4로 업그레이드
	- 해결 커밋: [Lazy emojiRegex](https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b)
- 3.22.4부터는 emoji 관련 정규식을 `z.string().emoji()`를 사용하는 경우에만 사용함
- 주의사항: 만약 `z.string().emoji()`를 사용하는 스키마가 있다면, 여전히 하위 버전에서 에러가 발생할 수 있음. 필요한 경우, `z.string().regex()`를 통해 직접 정규식을 구현하는 방법을 권장함
# 링크
- Github Issue, [Invalid emoji regular expression](https://github.com/colinhacks/zod/issues/2433)
- Chromium 이전 버전 다운로드 링크, https://raw.githubusercontent.com/Bugazelle/chromium-all-old-stable-versions/master/chromium.stable.json