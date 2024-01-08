---
tags:
  - React
  - ImmerJS
  - Immutable
  - JavaScript
  - Library
  - BestPractice
created: 2023-03-25T00:00:00.000Z
published: true
title: Immer의 원리와 lodash cloneDeep 함수와의 차이점
---

# Immer의 원리와 lodash cloneDeep 함수와의 차이점

📅 2023. 03. 25

리액트에서 배열이나 객체를 업데이트 해야 할 때에는 직접 수정 하면 안되고 불변성을 지켜주면서 업데이트를 해주어야 한다. 불변성을 지키는 방법은 자바스크립트에 내장된 Spread Opreator로 얕은 복사를 하거나, 써드파티 라이브러리를 사용하는 방법이 있다.
### immer
불변성 유지를 도와주는 [immer](https://immerjs.github.io/immer/) 라이브러리 (Github Star: 24.9k)

리액트에서 배열이나 객체를 업데이트 해야 할 때에는 직접 수정 하면 안되고 불변성을 지켜주면서 업데이트를 해주어야 한다. Immer를 사용하면 React 컴포넌트의 깊은 상태(nested/deep state) 업데이트를 쉽게 할 수 있다.

**As-is**
```js
const nextState = {
  ...state,
  posts: state.posts.map(post =>
    post.id === 1
      ? {
          ...post,
          comments: post.comments.concat({
            id: 3,
            text: '새로운 댓글'
          })
        }
      : post
  )
};
```

**To-be**
```js
const nextState = produce(state, draft => {
  const post = draft.posts.find(post => post.id === 1);
  post.comments.push({
    id: 3,
    text: '와 정말 쉽다!'
  });
});
```
### immer는 어떤 원리를 이용했길래 불변성을 유지해 주는 것일까?
**immer의 핵심 원리는 `Copy-on-write`(이하 기록 중 복사)와 `Proxy`(이하 프록시)에 있다.** 기록 중 복사란 자원을 공유하다가도 수정해야 할 경우가 발생하면 자원의 복사본을 쓰게 하는 개념이다. immer는 프록시 객체를 이용해서 원본 객체인 상태 객체 대신 프록시 객체를 대신 조작(변경) 하는 것이다.

immer를 이용하면 상태 객체에서 실제로 변경할 부분만 골라서 변경이 되고, 다른 부분은 기존 상태 객체와 동일한 것을 확인할 수 있다.
### lodash/cloneDeep 과의 차이점은?
`lodash/cloneDeep`은 항상 전체 상태를 완전히 복제한다. 여기서 두 가지 문제가 발생하는데, 데이터 양이 많을수록 문제가 심각해진다.

- **깊은 복사의 비용은 엄청 비싸다.** 100개의 item이 있으면 매 업데이트마다 복사를 수행해야 되기 때문에 성능과 가비지 컬렉터에 심각한 영향을 준다.
- 깊은 복사는 **매번 다른 참조를 만들기 때문에 메모이제이션이 불가능하다.** 따라서 React는 매번 컴포넌트를 리렌더링해야하며 불변성이 주는 모든 이점을 없앤다.

자세한 비교는 [[lodash cloneDeep vs immer]]에서 확인할 수 있다.