---
tags:
  - HTTP
  - Cookie
created: 2022-03-19T00:00:00.000Z
published: true
title: 쿠키 (HTTP Cookie)
---

# 쿠키 (HTTP Cookie)

📅 2022. 03. 19

# 서론
쿠키는 메세지를 담고 있는 포춘 쿠키에서 유래한 단어이다. 과자의 안에 메세지가 담겨 있는 것처럼, 쿠키도 4kb 용량의 작은 문자열 데이터를 담고 있다. 

![](https://i.imgur.com/WvNHfX2.png)

네이버에서 **개발자 도구 → Application → Cookies → `https://naver.com`** 를 열어보면 나도 모르는 쿠키들이 마구 쌓여있다. 이 쿠키들은 언제, 왜, 어떻게 만들어진걸까?
# 쿠키는 언제 만들어질까
**사이트에 접속하면 서버가 `set-cookie` 헤더를 response에 담아서 브라우저에 내려주고, 브라우저는 해당 정보를 읽어서 쿠키 저장소에 저장한다.** 검증을 위해 크롬 시크릿 모드로 네이버에 들어가서 네트워크 탭을 열어보았다.

![](https://i.imgur.com/4M5CUmv.png)

![](https://i.imgur.com/x9uMHxv.png)

무슨 데이터인지는 잘 모르겠지만, 정말 쿠키가 생겼다. **서버가 브라우저의 요청에 응답하는 시점에 쿠키가 생성된다**는 사실을 알게 되었다.

# 쿠키는 왜 만들어진걸까
서버는 브라우저와 통신을 하고 나면 누구랑 통신을 했었는지 기억하지 못한다. 쿠키는 이 "사용자 정보를 기억하지 못하는 문제"를 해결하기 위해 개발되었다. 사용자가 웹페이지를 방문하면 쿠키에 이름을 저장할 수 있다. 다음에 사용자가 페이지를 방문하면 쿠키가 내 이름을 기억한다.

현대의 웹에서 쿠키는 주로 세 가지 용도로 사용된다.

- **세션 관리**: 로그인, 쇼핑몰 장바구니, 게임 스코어 등
- **개인화**: 사용자 환경설정, 테마 및 기타 설정
- **추적**: 사용자 동작 기록 및 분석

쿠키는 클라이언트의 데이터 저장소로 사용된다. 하지만 웹 스토리지([localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage mdn"), [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage "sessionStorage mdn")) 와 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API "IndexedDB mdn")의 등장으로 모든 데이터를 쿠키에 저장할 필요가 없어졌다. 쿠키는 모든 HTTP 요청에 자동으로 전송되어 성능에 악영향을 줄 수 있기 때문에, 클라이언트에서만 필요한 데이터는 클라이언트용 스토리지를 사용하는게 좋다.

# 쿠키는 어떻게 만들어질까
네이버에 접속했을 때 우리는 아래처럼 생긴 응답 헤더를 받았었다.
```
set-cookie: PM_CK_loc=49ccad6e1e8e7e10567ceb676c5cd6e83bec4ae045eb08e28ca23bbfbc30b2d1; Expires=Thu, 17 Mar 2022 16:46:40 GMT; Path=/; HttpOnly
```
우리도 서버에서 같은 모습의 쿠키를 만들어서 브라우저한테 주고 싶다. 어떻게 해야 할까?

## 서버에서 쿠키 관리하기 (Feat. Express)
### Express에서 쿠키 만들기
Node.js 기반의 프레임워크인 Express를 기준으로 쿠키를 생성하는 코드를 작성해보면 다음과 같다.
```js
res.setHeader('Set-Cookie', 'PM_CK_loc=49ccad6e1e8e7e10567ceb676c5cd6e83bec4ae045eb08e28ca23bbfbc30b2d1; Expires=Thu, 17 Mar 2022 16:46:40 GMT; Path=/; HttpOnly');
```

전혀 우아함이 느껴지지 않는다. 문자열로 된 쿠키는 읽고 쓰기가 번거롭다. 그래서 대부분은 [cookie-parser](https://github.com/expressjs/cookie-parser "cookie-parser github") 라이브러리를 사용해서 쿠키를 관리한다. cookie-parser의 패키지를 보면  [cookie](https://github.com/jshttp/cookie "cookie github") 라이브러리를 통해 parse 또는 serialize를 한다. 내부적으로 쿠키의 `key-value` 형태를 통해 쿠키와 쿠키의 옵션을 구분하는 걸로 보인다. [cookie-parser](https://github.com/expressjs/cookie-parser "cookie-parser github")를 설치하고 세팅해보자.

```js
const express = require('express');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
```

미들웨어 설정이 끝나면 아래 처럼 쿠키를 만들수 있다.

```js
res.cookie('cookieName', 'cookieValue', option);
```

위에서 작성했던 코드를 `cookie-parser`를 이용해서 다시 작성해보았다. 

```js
const someValue = '49ccad6e1e8e7e10567ceb676c5cd6e83bec4ae045eb08e28ca23bbfbc30b2d1';
res.cookie('PM_CK_loc', someValue, { expires: new Date(Date.now() + 900000), path: '', httpOnly: true });
```

`;` 구분자를 넣어야 하는 번거로운 일이 줄어들었다. 세 번째 옵션 인자의 경우 [공식 문서](https://expressjs.com/en/api.html#res.cookie "express res.cookie")를 참조해서 `object`로 옵션을 지정해주면 된다.

| **속성** | **타입**          | **설명**                                                                       |
| -------- | ----------------- | ------------------------------------------------------------------------------ |
| domain   | String            | 쿠키의 도메인 이름.                                                            |
| encode   | Function          | 쿠키 인코딩에 사용되는 함수, 기본값은 `encodeURIComponent`                     |
| expires  | Date              | GMT 형식의 쿠키 만료 날짜. 지정하지 않거나 0으로 설정하면 세션 쿠키를 생성함 |
| httpOnly | Boolean           | 웹 서버에서만 액세스할 수 있도록 쿠키에 플래그를 지정함                        |
| maxAge   | Boolean           | 현재 시간을 기준으로 만료 시간을 밀리초 단위로 설정하고 싶을 때 편리한 옵션    |
| path     | Boolean           | 쿠키 경로. 기본값은 `/`                                                        |
| secure   | Boolean           | HTTPS 에서만 사용할건지 여부                                                   |
| signed   | Boolean           | 쿠키 서명 여부                                                                 |
| sameSite | Boolean or String | Set-Cookie 속성의 SameSite 플래그                                              |

### Express에서 쿠키 읽기
`req.cookies`로 접근하면 파싱된 오브젝트 쿠키를 얻을 수 있다.
```js
req.cookies //=> { cookieName: 'cookieValue' }
```

### Express에서 쿠키 지우기

만약 쿠키를 지우고 싶으면 [res.clearCookie](https://expressjs.com/en/api.html#res.clearCookie "express clearCookie API")를 쓰자.
```js
res.clearCookie('name', { path: '/' })
```

**주의:** 쿠키를 삭제할 때는 삭제하려는 쿠키의 `expires`와 `maxAge`를 제외한 다른 옵션이 모두 일치해야한다.

[clearCookie 함수의 코드](https://github.com/expressjs/express/blob/ea537d907d61dc693587fd41aab024e9df2e14b1/lib/response.js#L797-L810 "clearCookie code")를 보면 쿠키를 지우는 방법은 쿠키를 바로 만료시켜서 삭제하는 방식이라는 걸 알 수 있다. 

```js
/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.clearCookie = function clearCookie(name, options) {
  var opts = merge({ expires: new Date(1), path: '/' }, options);

  return this.cookie(name, '', opts);
};
```

`new Date(1)`을 개발자 도구 콘솔에서 찍어보면 `Thu Jan 01 1970 09:00:00 GMT+0900 (한국 표준시)`가 나온다. 이미 오래전에 만료됬다고 쿠키에 표시를 해서 브라우저가 해당 응답을 받는 순간 해당 쿠키가 삭제되는 것이다.

## 브라우저에서 쿠키 관리하기
브라우저는 `document.cookie`로 쿠키 조회, 생성, 수정, 삭제가 가능하다.

### 브라우저에서 쿠키 읽기
JavaScript의 `document.cookie`로 쿠키에 접근이 가능하다.

```js
console.log(document.cookie); // 'cookie1=value; cookie2=value; cookie3=value;'
```

### 브라우저에서 쿠키 만들기
브라우저에서 JavaScript로 쿠키를 추가하는 방법은 다음과 같다.

```js
document.cookie = 'name=value';
```

이러면 **기존 쿠키들은 다 날아가는 거 아닌가?** 라는 의문점이 들 수 있다. MDN의 [document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) 문서를 들어가보면 첫 줄에

> It serves as a getter and setter for the actual values of the cookies.

라고 나와있다. `document.cookie`가 실제 쿠키값 대신 접근자 프로퍼티의 getter와 setter를 통해 쿠키를 관리한다는 것이다. 즉, 우리가 `document.cookie=value`를 실행하면 쿠키가 덮어 씌워지는게 아니고 내부 로직에 의해 쿠키가 갱신되는 것이다.

### 브라우저에서 쿠키 지우기
브라우저에서 JavaScript로 쿠키를 삭제하는 방법은 다음과 같다.

```js
document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
```

**주의:** 쿠키를 삭제할 때는 삭제하려는 쿠키의 `expires`와 `maxAge`를 제외한 다른 옵션이 모두 일치해야한다.

### 브라우저에서 쿠키 수정하기
브라우저에서 JavaScript로 쿠키를 수정하는 방법은 다음과 같다.

```js
document.cookie = 'name=value2';
```

### 브라우저 쿠키 관리 라이브러리
문자열 파싱의 번거로움을 줄이기 위해서 쿠키를 쉽게 관리할 수 있는 라이브러리 사용을 추천한다.

#### js-cookie, universal-cookie
브라우저 cookie 관리 라이브러리의 주류에는 js-cookie와 universal-cookie가 있다. [npmtrends](https://www.npmtrends.com/)에서 두 라이브러리를 비교해본 결과 2022년 3월 16일 기준으로 js-cookie 다운로드 수가 4배나 앞섰다.

![](https://i.imgur.com/nT3wOKD.png)

| **패키지**                                                                                                                   | **깃허브 스타** | **용량 (minified + gzipped)** |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------- |
| [js-cookie](https://github.com/js-cookie/js-cookie "js-cookie github")                                                       | 18,415          | 780b                          |
| [universal-cookie](https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie "universal-cookie github") | 2,054           | 12kb                          |

js-cookie의 용량은 universal-cookie의 절반, 깃허브 스타도 9배나 앞섰다. 2015년에 만들어졌는데도 아직까지 인기가 시들지 않는 것으로 보아 쿠키계의 "근본" 라이브러리로 어느정도 자리를 잡은 것으로 보인다.

**js-cookie 예제**
```js
import Cookies from 'js-cookie'

Cookies.set('foo', 'bar')
console.log(cookies.get('foo')); //=> bar
```

**universal-cookie 예제**
```js
import Cookies from 'universal-cookie';

const cookies = new Cookies();

cookies.set('myCat', 'Pacman', { path: '/' });
console.log(cookies.get('myCat')); //=> Pacman
```

예제를 비교해보면 사용법은 거의 비슷하나 universal-cookie의 경우 `class` 기반이기 때문에 매번 인스턴스를 만들어줘야 하는 사소한 번거로움이 있다.

#### **nookies**

[nookies](https://github.com/maticzav/nookies "nookies github")는 Next.js에 특화된 쿠키 관리 라이브러리이다. Next.js는 서버사이드 렌더링을 지원하기 위해 내부적으로 Express 서버를 띄우므로 서버와 브라우저에서 쿠키 관리 로직에 차이가 존재한다. nookies는 하나의 라이브러리에서 별도의 함수를 두어 쿠키를 쉽게 관리할 수 있도록 도와준다.

다음은 공식 문서에서 가져온 서버에서의 쿠키 읽기/쓰기/삭제 예제이다.

```js
import nookies from 'nookies'

export async function getServerSideProps(ctx) {
  // 쿠키 읽기
  const cookies = nookies.get(ctx)

  // 쿠키 쓰기
  nookies.set(ctx, 'fromGetInitialProps', 'value', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  // 쿠키 삭제
  // nookies.destroy(ctx, 'cookieName')

  return { cookies }
}
```

클라이언트에서 사용할 때는 `ctx` 인자에 `{}`, `null` 또는 `undefined`를 넣으면 된다.

# 쿠키 속성
쿠키는 보안 목적의 `HttpOnly`, `Secure`, `Same-Site` 속성과 그 외 만료일을 지정하는 `Expires`, `Max-Age` 그리고 어디에 쿠키가 전송되어야할지를 정하는 `Domain`, `Path` 속성이 존재한다.

### HttpOnly

보안 목적으로 사용된다. 이 필드를 활성화하면 브라우저의 `document.cookie` API 로 쿠키를 조작할 수 없게 한다. XSS 공격에 의한 쿠키 도용을 방지할 수 있다. jwt 토큰 같은 로그인 정보를 쿠키에 저장할 때 활성화하면 좋다.

### Secure

이 필드가 설정된 쿠키는 HTTPS 접속으로 이루어진 요청에 대해서만 서버로 전송된다. 개발 환경에서는 보통 `http://localhost` 를 사용하므로 꺼두고 프로덕션에서만 활성화하는 방식으로 사용할 수 있다.

### Expires, Max-Age

**`Expires <Date>`**: 지정된 날짜에 만료됨

i.e.

```
Set-Cookie: key=value; Expires=Wed, 30 Aug 2021 00:00:00 GMT
```

**`Max-Age <Number>`**: 지정된 시간 후에 만료됨

i.e.

```
Set-Cookie: key=value; Max-Age=60
```

`Expires` 혹은 `Max-Age`가 없는 쿠키는 세션 쿠키로 취급되어 브라우저 창이 닫히면 자동으로 삭제된다.

### Domain, Path

쿠키가 어떤 URL로 보내져야 하는지를 결정하는 속성이다.

**Domain**: 예를 들어 `drive.google.com`으로 설정하면 `drive.google.com`에서만 쿠키가 사용(전송)된다. `google.com`으로 설정하면 서브 도메인(`*.google.com`)에서도 쿠키가 사용된다. 설정하지 않으면 기본으로 서브 도메인을 제외한 `drive.google.com`으로 설정된다. 

**Path**: 기본값은 `/`이다. 일치하는 경로에서만 쿠키가 사용된다. 만약 `/docs`로 설정하면 `/`, `/about` 에서는 해당 쿠키가 전송되지 않는다. 실무에선 기본값인 `/` 말고는 써 본적이 없는것 같다.

### Same-Site

기본적으로 쿠키는 다른 도메인으로의 요청이라도 매 리퀘스트마다 서버에 전송된다. 따라서 쿠키는 CSRF같은 공격에 취약점을 가진다. `Same-Site` 속성을 설정하면 공격을 어느정도 예방할 수 있다.

`Same-Site`는 `None`, `Strict`, `Lax` 세 가지 값으로 설정할 수 있다.

- `None`: 쿠키가 모든 상황에서 전송됨
- `Strict`: 같은 사이트에서만 쿠키가 전송됨
- `Lax`: 같은 사이트에서만 쿠키가 전송됨. 단, **a)** `POST` 요청, **b)** a 태그/`window.location.href=` 등 Top-Level Navigation 은 예외적으로 쿠키가 전송됨.

개발자들이 알아서 쿠키의 `Same-Site` 속성을 `Strict`/`Lax`로 잘 명시해서 쓰면 좋겠지만, `Same-Site`를 잘 이용할거라고 기대하긴 어렵다. 구글은 이를 예견하고 2019년 3월 7일 IETF(국제 인터넷 표준화 기구)에 `Same-Site` 속성의 기본값을 `Lax`로 정하자는 [제안](https://datatracker.ietf.org/doc/pdf/draft-west-cookie-samesite-firstparty-00 "draft-west-cookie-samesite-firstparty")을 낸다. 

브라우저들의 `Same-Site=lax` 기본값 설정은 현재 진행형이다. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#browser_compatibility "mdn cookie browser_compatibility")에 의하면 2022년 3월 19일 기준으로 FireFox, IE, Safari (PC와 모바일), FireFox for Android 브라우저를 제외한 모든 브라우저에서 `Same-Site` 설정을 누락한 경우 기본값을 `lax`로 설정하고 있다.

## `HttpOnly` 쿠키는 브라우저에서 지울 수 있을까?

**못 지운다. `document.cookie` API로 조작이 아예 불가능하기 때문이다.** 사용자가 개발자 도구를 들어가서 삭제하면 삭제되긴 한다. 만약 사용자를 로그아웃 시킬 때 저장된 토큰을 지우고 로그인 페이지로 보내는 플로우가 있을 때 해당 상황을 고려해 볼 수 있다. 이런 경우 서버의 로그아웃 API에서 `Set-Cookie` 헤더를 통해 쿠키를 지울 수 있다.

# 결론
쿠키는 사용자 정보를 기억하기 위해서 개발된 4kb의 조그만 문자열 데이터다. 사이트에 방문할 때 `set-cookie` 헤더를 받아 생성되며, 브라우저에서도 `document.cookie`를 통해 쿠키를 조작할 수 있다.

쿠키는 사용자 정보(특히 로그인 정보)를 기억하기 위해 고안되었지만 현대의 웹 생태계에서는 사용자의 페이지 방문 추적, 쇼핑몰 장바구니 정보 저장 등 넓은 범위에서 쓰인다. 쿠키는 매번 서버에 전송되기 때문에 매번 전송될 필요가 없는 데이터는 로컬 스토리지/세션 스토리지 혹은 인덱스드 DB를 써서 저장하는 것이 좋다.

쿠키는 `cookie1=value; cookie2=value; cookie3=value;`와 같이 `key-value` 페어로 저장되며 `;`로 구분된다. 문자열로 쿠키를 관리하는 것은 번거롭기 때문에 라이브러리를 써서 관리하는 게 일반적이다. Express는 [cookie-parser](https://github.com/expressjs/cookie-parser "cookie-parser github")를, 브라우저는 [js-cookie](https://github.com/js-cookie/js-cookie "js-cookie github")를 사용하는 걸 추천한다.

쿠키는 보안 목적의 `HttpOnly`, `Secure`, `Same-Site` 속성과 그 외 만료일을 지정하는 `Expires`, `Max-Age` 그리고 어디에 쿠키가 전송되어야할지를 정하는 `Domain`, `Path` 속성이 존재한다. 쿠키는 클라이언트에서 관리하다 보니 위변조가 쉬우므로 보안 관련 속성을 잘 알아두는 것이 좋다.