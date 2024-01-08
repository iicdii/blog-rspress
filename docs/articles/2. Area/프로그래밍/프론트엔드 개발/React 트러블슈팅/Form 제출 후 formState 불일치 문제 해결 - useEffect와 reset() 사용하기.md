---
tags:
  - React
  - ReactHookForm
  - TroubleShooting
created: 2023-03-23T00:00:00.000Z
published: true
title: Form 제출 후 formState 불일치 문제 해결 - useEffect와 reset() 사용하기
---

# Form 제출 후 formState 불일치 문제 해결 - useEffect와 reset() 사용하기

📅 2023. 03. 23

React Hook Form에서 `handleSubmit`은 비동기 함수이기 때문에 `handleSubmit` 안에서 `reset`을 실행하면 `formState`의 불일치가 일어날 수 있다. 컴포넌트가 다시 마운트되기 전 까지 input이 `register`되기 때문이다. 순서의 보장을 위해서 아래처럼 `useEffect`안에 `formState`가 success가 된 후에 reset을 실행하도록 로직을 구현하는게 권장된다.

아래는 [공식 문서](https://react-hook-form.com/api/useform/reset/#:~:text=It%27s%20recommended%20to%20reset%20inside%20useEffect%20after%20submission.) 에서 가져온 예제이다.
```js
useEffect(() => {
  reset({
    data: 'test'
  })
}, [isSubmitSuccessful])
```

공식 문서에서도 Form 제출 후 `reset`을 하고 싶으면 `useEffect`에서 하는 걸 권장하고 있다.

> It's recommended to `reset` inside `useEffect` after submission.