---
tags:
  - Network
  - TypeScript
created: 2023-05-28T00:00:00.000Z
published: true
title: unknown 에러가 Axios Error 타입인지 확인하는 방법
---

# unknown 에러가 Axios Error 타입인지 확인하는 방법

📅 2023. 05. 28

`axios.isAxiosError(error)`를 사용하면 에러가 `AxiosError` 인지 체크할 수 있다.

```ts
.catch((error: Error | AxiosError) {
  if (axios.isAxiosError(error))  {
    // Access to config, request, and response
  } else {
    // Just a stock error
  }
})
```