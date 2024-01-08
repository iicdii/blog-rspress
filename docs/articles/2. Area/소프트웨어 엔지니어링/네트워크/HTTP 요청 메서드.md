---
tags:
  - HTTP
  - HTTPMethods
created: 2022-03-20T00:00:00.000Z
published: true
title: HTTP 요청 메서드
---

# HTTP 요청 메서드

📅 2022. 03. 20

# HTTP Method?
HTTP는 메서드(Method)를 통해 주어진 리소스에 수행하길 원하는 행동을 나타냅니다. 메서드는 멱등 / 안전 / 캐시 여부를 구분할 수 있습니다.

## 멱등 (Idempotent)
멱등, Idempotent[aidémpətənt][아이뎀퍼턴트]은 동일한 서버에 동일한 요청을 여러번 보냈을 때 동일한 결과(효과)를 기대할 수 있는 메서드를 말합니다.

## 안전 (Safe)
서버의 상태를 변경하지 않는, 즉 읽기 전용(Read Only) 메서드를 "안전"하다고 표현합니다. 단순히 리소스 정보를 받아오는 `GET`, `HEAD`와 요청 가능한 메소드 목록을 가져오는 `OPTIONS` 메서드는 안전하다고 볼 수 있습니다.

## 캐시 (Cacheable)
캐시 가능한 메서드를 말합니다. 대표적으로 `GET`, `HEAD` 메서드는 캐시될 수 있습니다. 만약 캐시를 막고 싶으면 응답 헤더에 `Cache-Control`와 같은 헤더를 넣읍시다.

# GET
리소스 데이터를 받아올 때 사용합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | O    | O    |

# HEAD
`GET`이랑 같지만 `body`가 없습니다. 이름 그대로 요청의 헤더(Header)만 가져옵니다. 만약 어떤 파일을 실제로 다운로드 하지 않고 파일 크기만 알고 싶을 때 헤더의 `Content-Length` 헤더를 읽고 파일 크기를 확인할 수 있습니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | O    | O    |

# POST
데이터를 `body`에 담아서 서버에 전송합니다. POST 요청은 특정 조건에서 캐시될 수 있지만, 대부분은 응답을 캐시하지 않습니다.

[IETF RFC 2616 Section 9.5](https://datatracker.ietf.org/doc/html/rfc2616#section-9.5 "IETF RFC 2616 Section 9.5") 명세를 보면

> Responses to this method are not cacheable, unless the response includes appropriate Cache-Control or Expires header fields.

서버에서 적절한 `Cache-Control`, `Expires` 응답 헤더를 주면 응답이 캐시된다고 합니다. 하지만 리소스의 저장/수정을 수행하는 POST 메서드의 특성을 생각해보면 응답을 캐시해야 하는 상황은 매우 드물지 않나 싶습니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| X    | X    | △   |

# PUT
새 리소스를 생성하거나 수정/대체할 때 사용합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | X    | X   |

# DELETE
리소스를 삭제할 때 사용합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | X    | X   |

# CONNECT
서버와 SSL 통신을 할 때 사용합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| X    | X    | X   |

# OPTIONS
서버에서 지원하는 메서드의 종류를 알고 싶을 때 사용합니다. 웹 개발자들이 흔히 겪는 CORS 문제의 상황에서 이 메서드를 볼 수 있습니다. 브라우저는 서로 다른 출처의 서버에 요청을 할 때 `OPTIONS` 메서드의 Preflight Request(사전 요청)을 보내서 실제로 요청을 보낼 수 있는지 여부를 확인합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | O    | X   |

# TRACE
진단 목적으로 사용되며 클라이언트가 전송한 리퀘스트를 그대로 반환합니다. 실무에서는 거의 쓰이지 않습니다. TRACE 메서드를 쿠키의 HttpOnly 기능을 우회하여 쿠키 정보를 획득할 수 있는 취약점이 있습니다. 이것을 자바스크립트로 읽어서 공격자에게 보내면 결국 세션을 탈취할 수 있게 됩니다. 대부분의 브라우저는 `TRACE` 메서드를 비활성화해놓았습니다. 크롬의 개발자 도구를 열고 `fetch` API를 통해 테스트 해보면 아래와 같은 에러를 출력합니다.

![chrome trace error](//images.ctfassets.net/aygsdsdi1qnw/7EiYWIorC4dq8Ak4Vo2pvQ/5d1286938ee75cae763e3911c72bd260/image.png)

```
'TRACE' HTTP method is unsupported
```

사용할 일이 없다면 웹 서버는 아예 `TRACE`를 비활성화 해놓는 것이 좋습니다. nginx는 기본적으로 `CONNECT`, `TRACE` 메서드 요청 시 405 (Method Not Allowed)를 반환하도록 [하드 코딩](https://github.com/nginx/nginx/blob/828fb94e1dbe1c433edd39147ba085c4622c99ed/src/http/ngx_http_request.c#L2014-L2026 "nginx hard coded methods github")되어 있습니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| O    | O    | X   |

# PATCH
리소스의 일부를 수정할 때 사용합니다.

| 멱등 | 안전 | 캐시 |
| ---- | ---- | ---- |
| X    | X    | X   |

# FAQ
## GET vs POST
1. GET은 URL의 마지막에 쿼리 스트링을 연결해서 데이터를 전달하는 반면, POST는 body에 데이터를 담아서 전달합니다.

GET 요청 예시:
```
/test/demo_form.php?name1=value1&name2=value2
```

POST 요청 예시:
```
POST /test/demo_form.php HTTP/1.1
Host: w3schools.com

name1=value1&name2=value2
```

GET의 경우 URL에 데이터가 노출되므로 민감한 정보를 포함하지 않도록 주의해야 합니다.

2. GET은 캐시되지만 POST는 캐시되지 않습니다.
3. GET은 즐겨찾기 추가가 가능하지만 POST는 즐겨찾기 추가가 불가능합니다.
4. GET은 데이터 길이에 제한이 있지만, POST는 원하는 만큼 데이터를 전송할 수 있습니다.

2022년 1월 10일 기준으로 [stackoverflow의 한 개발자가 실험한 결과](https://stackoverflow.com/a/417184 "stackoverflow url length experiment")에 따르면 URL 길이 제한은 다음과 같습니다.

| 브라우저 | 주소창      | `document.location` |
| ------- | ----------- | ------------------- |
| Chrome  | 32,779      | >64k                |
| Android | 8,192       | >64k                |
| Firefox | >64k        | >64k                |
| Safari  | >64k        | >64k                |
| IE11    | 2,047       | 5,120               |
| Edge 16 | 2,047       | 10,240              |

POST 요청은 웹 서버에 따라 최소 1MB에서 무제한으로 데이터 전송이 가능합니다.

| 웹 서버 | 기본 제한값  | 최대값 |
| ------- | ----------- | ------ |
| Nginx   | 1MB         | 무제한 |
| Apache  | ?           | 2GB    |

5. GET은 멱등하지만, POST는 멱등하지 않습니다.

## PUT vs PATCH
`PUT`은 **데이터 전체** 수정, `PATCH`는 **데이터 일부** 수정 목적으로 사용합니다.
아래와 같은 유저 모델이 있다고 가정해봅시다.

```ts
type UserType {
  username: string;
  email: string;
}
```

현재 `id=1`의 유저 정보는 다음과 같습니다.
```js
{ username: 'admin', email: 'staff@gmail.com' }
```

`PUT` 또는 `PATCH`를 사용해서 유저 정보를 수정할 수 있습니다. `PUT`으로 이메일을 변경하는 예시입니다.
```js
// PUT /users/1
{ username: 'admin', email: 'modified@naver.com' }
```

`PATCH`로 이메일을 변경하는 예시입니다.
```js
// PATCH /users/1
{ email: 'modified@naver.com' }
```

위의 예시에서 볼 수 있듯이 `PUT`에는 이 사용자에 대한 모든 파라미터가 포함되었지만 `PATCH`에는 수정할 파라미터(이메일)만 포함되었습니다.

`PUT`을 사용할 때 누락된 필드가 있으면 누락된 채로 데이터가 교체된다는 점에 주의하세요.
```js
// GET /users/1
{
  "username": "admin",
  "email": "staff@domain.com"
}
// PUT /users/1
{
  "email": "modified@naver.com" // 새 이메일 주소로 변경합니다.
}

// GET /users/1
{
  "email": "modified@naver.com" // 새 이메일 주소로 변경합니다. 근데 username은..?
}
```