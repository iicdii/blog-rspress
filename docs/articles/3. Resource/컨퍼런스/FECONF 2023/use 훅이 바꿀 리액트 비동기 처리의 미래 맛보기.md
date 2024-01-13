---
tags:
  - 컨퍼런스
  - FECONF2023
created: 2023-10-22T00:00:00.000Z
published: true
title: use 훅이 바꿀 리액트 비동기 처리의 미래 맛보기
---

# use 훅이 바꿀 리액트 비동기 처리의 미래 맛보기

📅 2023. 10. 22

FECONF 2023 [use 훅이 바꿀 리액트 비동기 처리의 미래 맛보기](https://www.youtube.com/watch?v=Hd1JeePasuw) 영상의 내용을 정리한 글입니다.

발표자: 문태근 (데브시스터즈)

- React에서 비동기를 처리하는 과정 되짚어보기
- `useState`, `useEffect`를 통해서 비동기를 처리
- `data`, `error`, `loading` 처리를 위해 `useQuery`와 같은 커스텀 훅 사용
- React Query와 같은 Data Fetching 라이브러리를 사용
- `Suspense`와 `ErrorBoundary`의 조합으로 데이터가 로딩 된 상태만 생각할 수 있게 됨

- Data Fetch 다시 생각하기

```jsx
const MyApp = () => {
  const { data } = useQuery({
    queryFn: () => fetch('/api/data'),
    suspense: true,
  });

  return <div>{data}</div>
}
```

- 왜 굳이 여기서 Hook을 써야 하는 걸까? `fetch`에 바로 `await`를 쓸 수는 없는걸까?
- 클라이언트 컴포넌트는 async 일 수 없다
- Promise 결과를 동기적으로 꺼낼 수 없을까?
- [RFC: first class support for promises and async/await](https://github.com/reactjs/rfcs/pull/229)에서 현재 논의 중인 `use` 훅
- `use`는 Promise를 파라메터로 받아서 resolve된 값을 리턴하는 동기 함수의 시그니처를 가짐

```ts
function use<T>(promise: Promise<T>): T
// * 간소화된 타입으로, 실제와 차이가 있습니다
```

- `await`가 함수였다면 아래와 같은 모습이지 않을까?
- 결과만 보면 거의 비슷하게 동작함

```js
// async function
const data = await promise;

// React Component / Hooks
const data = use(promise);
```

- `use`는 `Suspense`를 발동시키는 트리거 역할을 하게될 것
```jsx
<Suspense fallback={<div>Loading</div>}>  
  <MyApp /> // use(Promise)
</Suspense>
```
- MyApp 렌더링 도중에 아직 resolve되지 않은 `use()`가 실행되면, 가장 가까운 Suspense의 fallback이 렌더링 되는 방식
- 왜 이름이 use일까?
	- 기존의 훅과 다르게, 조건부로 호출될 수 있기 때문
- 어떻게 동작할까?
	- `use`는 아직 구현체가 정해지지 않았다.
- Jotai, Recoil, React Query는 Suspense를 이미 사용하고 있는데, 어떻게 Suspense를 트리거하고 있을까?
	- React 18.2 기준으로, `use`는 아직 사용할 수 없음
	- `use`를 호출하는 대신에 Promise를 `throw`하는 방식으로 임시 구현
- 정리
	- `use`는 새로운 hook
	- Suspense 트리거
	- `await`와 비슷한 역할
	- 조건부 호출 가능
- 조건부 호출이 가능하다는 점이 hook의 여러가지 문제점을 해결할 수 있을 것이라고 기대
# Case Study
- 사례: 유저 인벤토리 조회
- Hook의 제약으로 인한 문제점
- `use`로 Hook의 제약 벗어나기

## 사례: 유저 인벤토리 조회
- `useInventory`는 `userId: string`과 `search: string`을 받아서 아이템을 조회하는 커스텀 훅

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);

	return inventory
		.filter((item) => {
			if (!search) return true;
			return item.name.includes(search);	
		});
}
```

- 이 코드에는 한 가지 문제점이 있었음
- `item.name`은 항상 `name` 필드를 갖고 있지 않음
- 아이템마다 Resource의 종류가 다를 수 있기 때문
- 아이템의 종류는 NormalItem과 EventItem가 있다고 가정
- 리소스 데이터에서 NormalItem / EventItem을 구분하는 로직으로 변경

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) normalItems에서 이름 체크;
			if (Event Item이면) eventItems에서 이름 체크;
			return item.name.includes(search);	
		});
}
```

- `normalItems`와 `eventItems`는 어떻게 로딩해야 할까?
- 게임 클라이언트는 사전에 모든 리소스 데이터를 다운로드 받는 형식
- 브라우저 환경에서는 동일한 방법을 적용하기 어려움
	- 수십 MB의 거대한 사이즈: 접속할 때마다 다운하기 부담
	- 개발 환경에서 매 시간 업데이트: 낮은 캐시 효율성
	- 꾸준히 증가하는 데이터 총량: 확장성 X
- 각 리소스 데이터를 리소스 별로 다운로드 하기 위한 fetch 함수와 커스텀 훅을 정의

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);
	const normalItems = useNormalItems();
	const eventItems = useEventItems();

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) normalItems에서 이름 체크;
			if (Event Item이면) eventItems에서 이름 체크;
			return item.name.includes(search);	
		});
}
```
## Hook의 제약으로 인한 문제점
1. 불필요한 Blocking으로 인한 TTL 증가 -> UX 저하
2. 코드 응집도 저하로 인한 DX 저하

- 문제 1. 불필요한 Blocking

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);
	const normalItems = useNormalItems();
	const eventItems = useEventItems();
	// 1. normalItems, eventItems 데이터를 불러오면서 UI 블로킹이 발생

	return inventory
		.filter((item) => {
			if (!search) return true;
			// 2. search 키워드가 없는 경우 리소스를 불러왔음에도 사용하지 않고 종료됨
			if (Normal Item이면) normalItems에서 이름 체크;
			if (Event Item이면) eventItems에서 이름 체크;
			return item.name.includes(search);	
		});
}
```

- 페이지를 처음 접속하면 검색 키워드가 없기 때문에 리소스 데이터를 위한 블로킹은 불필요

- 문제 2. 응집도 저하

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);
	const normalItems = useNormalItems();
	const eventItems = useEventItems(); // 여기서 로딩하지만

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) normalItems에서 이름 체크;
			if (Event Item이면) eventItems에서 이름 체크; // 사용은 여기서
			return item.name.includes(search);	
		});
}
```

- 아이템 종류가 늘어난다면..?
	- 로딩하는 코드와 사용하는 코드가 굉장히 멀어지게 됨

![[FEconf 2023 - TRACK A 1-19-46 screenshot.png]]

- 실제로는 수백 종류의 리소스와 수십 종류 페이지가 존재
- "Hook은 최상단에서만 호출해야 한다"는 제약 조건이 문제의 원인
## use로 Hook의 제약 벗어나기
- `use`를 사용할 수 있는 곳
	- ✅ 조건문, 반복문
	- ✅ `return` 문 다음
	- ❌ 이벤트 핸들러
	- ❌ 클래스 컴포넌트
	- ❌ `useMemo`, `useReducer`, `useEffect`에 전달한 클로저

- Before
```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);
	const normalItems = useNormalItems();
	const eventItems = useEventItems();

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) normalItems에서 이름 체크;
			if (Event Item이면) eventItems에서 이름 체크;
			return item.name.includes(search);	
		});
}
```

- After
```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useUserInfo(userId);

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) use(fetchNormalItems()) 에서 이름체크;
			if (Event Item이면) use(fetchEventItems()) 에서 이름체크;
			return item.name.includes(search);	
		});
}
```

- 결과
	- Top Level Hook 제거로 DX 개선
	- 필요한 순간에 리소스 로딩을 통해 UX 개선
- 그러면 이제 `use`만 쓰면 되나요?
	- ❌ `use`는 low-level API, Data Fetching 라이브러리는 더 많은 기능을 제공
- 따로 해결했던 문제
	- 중복 Fetching 문제 해결을 위한 cache
	- Request waterfll 문제 해결을 위한 prefetching
- 문제 1. 중복 fetch
- 아래 코드에는 한 가지 버그가 있음
```js
const useInventory = (...) => {
  // ...
  use(fetchNormalItems());
  // ...
}
```
- resolve -> rerender -> fetch -> 무한 루프에 빠짐
- 해결 1. Cache
	- fetch를 바로 리턴하던 fetch 함수에 cache 기능을 추가해주면 해결됨

```js
const fetchNormalItems = cache(() => {
  return fetch('/res/normal-items');
})
```

- `cache` API는 React 공식 API로 추가될 예정이지만, 아직은 실험 단계이며 Server Component 에서만 사용이 가능
	- 특별한 로직이 있진 않아서 `lodash.memoize`로 대체하여 구현함
- 문제 2. Request waterfall

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useKingdom(userId);

	return inventory
		.filter((item) => {
			if (!search) return true;
			// 1. Normal Item 로딩
			if (Normal Item이면) use(fetchNormalItems()) 에서 이름체크;
			// 2. Normal Item 로딩이 끝난 후 Event Item 로딩
			// -> 불필요한 순차적 로딩
			if (Event Item이면) use(fetchEventItems()) 에서 이름체크;
			return item.name.includes(search);	
		});
}
```

- Data Fetching Library들은 이런 문제를 해결하기 위해 Prefetch 혹은 Parallel Query 사용
- Prefetch를 통해 해결하는 것으로 결정
- 해결 2. Prefetch
	- Prefetch는 간단함. fetch를 사전에 한 번 더 해주면 됨

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useKingdom(userId);
	fetchNormalItems();
	fetchEventItems();

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) use(fetchNormalItems()) 에서 이름체크;
			if (Event Item이면) use(fetchEventItems()) 에서 이름체크;
			return item.name.includes(search);	
		});
}
```

- 하지만, `use`를 도입함으로써 해결했던 코드의 응집성 문제가 다시 나타남
- 이 문제를 Dynamic Prefetch라는 아이디어로 해결함
- prefetch 대상을 런타임에 동적으로 결정하는 방식

```js
const fetchNormalItems = () => {
  // 현재 페이지에서 normalItems를 사용했다고 localStorage에 기록
  return fetch('/res/normal-items');
}

document.onready = () => {
  const names = (); // localStorage 에서 사용 기록 읽기
  names.forEach((XXX) => fetchXXX());
}
```

- 페이지를 접속했을 때 발생하는 이벤트 핸들러에서 프리패치를 호출하는 로직 작성

```jsx
document.onready = () => {
  // 2. React 외부에서 dynamic prefetch 을 실행하여 코드 응집도 문제를 다시 해결할 수 있음
}

const useInventory = ({ userId, search }) => {
	const { inventory } = useKingdom(userId);
	// 1. React 내부에서 호출하던 Prefetching 함수를 제거하고
	// fetchNormalItems();
	// fetchEventItems();

	return inventory
		.filter((item) => {
			if (!search) return true;
			if (Normal Item이면) use(fetchNormalItems()) 에서 이름체크;
			if (Event Item이면) use(fetchEventItems()) 에서 이름체크;
			return item.name.includes(search);	
		});
}
```

- 이제 완벽해진걸까..?
# use의 제약
- 발표 준비 후 알게 된 충격적인 사실
- 현재는 Promise를 throw하는 방식으로 렌더링을 지연할 수 있으나
- 미래는 React Component와 Hook 안에서만 사용이 가능하다고 함 😇
- 따라서, 미래 시점에서 앞에서 설명한 코드는 잘못됨
	- `use`를 호출하는 함수가 컴포넌트나 훅이 아닌 클로저(filter) 함수이기 때문

```jsx
const useInventory = ({ userId, search }) => {
	const { inventory } = useKingdom(userId);

	return inventory
		.filter((item) => {
			if (!search) return true;
			// Closure 함수에서 use를 사용함
			if (Normal Item이면) use(fetchNormalItems()) 에서 이름체크;
			if (Event Item이면) use(fetchEventItems()) 에서 이름체크;
			return item.name.includes(search);	
		});
}
```

- 이런 제약을 지키게 된다면
	- `map`, `filter`, `reduce` 사용 불가
	- 중복 로직을 함수로 묶는 것이 불가
	- 직접 호출만 가능..!
- 제약이 왜 있는걸까?
	- RFC 문서에 의하면, 제약을 어겨도 런타임에서는 에러가 발생하지 않지만 컴파일러 에러가 발생할 것이라고 함

> Theoretically, it will "work" in the runtime if you call `use` inside a function which itself is only called from inside a React Component or Hook, but this will be treated as a compiler error

- "컴파일러 에러가 발생한다고?"
- 2021년에 처음 소개된 React 자동 성능 최적화 도구인 React Forget 컴파일러로 이야기는 되돌아감
- `async` / `await`는 자바스크립트의 문법 요소이기 때문에 컴파일러 기반 최적화가 가능
	- ex) Babel은 async function을 generator로 컴파일 가능
- async Server Component 최적화 기능을 개발 중
- 반면에, `use`는 함수이지만 React 내에서는 문법 요소의 역할을 강제
	- 예를 들어, `await`는 `async` 함수 안에서만 사용 가능
	- `yield`는 `generator` 함수 안에서만 사용 가능
	- `use`도 Component / Hook 안에서만 사용 가능
- 이런 `use`의 문법적인 제약은 앞으로 다가올 React 컴파일러 최적화를 위한 대비라고 볼 수 있음
- 'React Forget은 `useMemo`만 최적화 해주는 게 아니였나?'
- '성능 최적화를 위해 `use`에 문법적인 제약을 만드는 것은 DX 저하가 아닌가?'
- '제약을 우회할 수 있는 방법은 없을까?'
- 현재 React 컴파일러의 모습이 어떤 형태일지는 출시되어야 알 것 같음
- React Forget 컴파일러는 아직 알파 단계도 아님
- `cache` API는 RFC도 없는 상태
- 현재와 같은 unstable `use`를 좀 더 쓰게 될듯