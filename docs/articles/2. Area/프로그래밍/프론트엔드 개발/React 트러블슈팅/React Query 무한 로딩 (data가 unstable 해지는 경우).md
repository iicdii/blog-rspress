---
tags:
  - React
  - ReactQuery
  - TroubleShooting
created: 2023-10-31T00:00:00.000Z
published: true
title: React Query 무한 로딩 (data가 unstable 해지는 경우)
---

# React Query 무한 로딩 (data가 unstable 해지는 경우)

📅 2023. 10. 31

React Query가 무한으로 네트워크를 요청하는 일이 발생했다.
찾아보니, `data`가 안정적인 참조값을 들고 있지 않아, `data`에 의존성을 가진 useEffect가 계속해서 실행되는 문제였다.

**`useQuery`가 리턴하는 `data`는 항상 안정적이지 않다.** 기본적으로는 안정적이지만, 조건에 따라 `data`가 새로 생성되는 경우가 있다. 어떤 경우에 `data` 객체가 새로 생성될까?

```tsx
const useXXXQuery = (options) =>
	useQuery('fetchXXX', () => fetchXXX(), {  
	  select: data => data.data,  
	  ...options,  
	});

// data는 unstable함
const { data } = useXXXQuery();
```

위 코드의 `data`는 안정적이지 않다. `data`가 원시값일 때는 문제가 없지만, 오브젝트인 경우 문제가 된다.

**`data`가 안정적이지 않은 이유는 `select` 함수가 inline function이기 때문이다.** React Query는 select 옵션이 변경되면 select 함수를 다시 실행해서 `data`를 다시 할당한다. React 컴포넌트나 훅 내부에 정의된 함수는 `useCallback`으로 메모이제이션을 하지 않으면 렌더링마다 참조값이 변경된다.

**즉, `select` 함수를 `useCallback`로 감싸서 쓰거나 React 스코프 외부에 함수를 선언하면 문제는 해결된다.**

문제가 되는 React Query [소스코드](https://github.com/TanStack/query/blob/7f27e253ce1d14d15685d8d74e68e78a86013c20/packages/query-core/src/queryObserver.ts#L474)를 살펴보자.

```ts title="queryObserver.ts" {10}
    protected createResult(
    // ...
    
    // Select data if needed
    if (options.select && typeof state.data !== 'undefined') {
      // Memoize select result
      if (
        prevResult &&
        state.data === prevResultState?.data &&
        options.select === this.#selectFn
      ) {
        data = this.#selectResult
      } else {
        try {
          this.#selectFn = options.select
          data = options.select(state.data)
          data = replaceData(prevResult?.data, data, options)
          this.#selectResult = data
          this.#selectError = null
        } catch (selectError) {
          this.#selectError = selectError as TError
        }
      }
    }
    // Use query data
    else {
      data = state.data as unknown as TData
    }
```

위 코드에서 문제가 되는 부분은 바로 아래 비교 로직이다. (v4, v5 모두 동일한 로직을 갖고 있다)

```js
options.select === this.#selectFn
```

[React Query 메인 테이너의 블로그](https://tkdodo.eu/blog/react-query-data-transformations#3-using-the-select-option)에서도 이 부분에 대해 언급하고 있으며, 대안으로 `useCallback` 또는 React 외부 스코프로 함수를 꺼내서 쓰는 방법을 제시하고 있다. 저자는 계산 비용이 비싼 경우에 이러한 방법을 사용할 수 있다고 언급했지만, `select` 함수의 잠재적인 무한 루프 가능성에 대해서 이야기하지 않은 점이 아쉽다. **우리 팀은 이번 일을 겪고난 뒤로 잠재적인 무한 루프를 막기 위해 기본적으로 `select` 함수를 모두 React 바깥으로 빼서 쓰기로 합의했다.**

> selectors will only be called if `data` exists, so you don't have to care about `undefined` here. Selectors like the one above will also run on every render, because the functional identity changes (it's an inline function). If your transformation is expensive, you can memoize it either with useCallback, or by extracting it to a stable function reference:

```tsx
const transformTodoNames = (data: Todos) =>
  data.map((todo) => todo.name.toUpperCase())

export const useTodosQuery = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    // ✅ uses a stable function reference
    select: transformTodoNames,
  })

export const useTodosQuery = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    // ✅ memoizes with useCallback
    select: React.useCallback(
      (data: Todos) => data.map((todo) => todo.name.toUpperCase()),
      []
    ),
  })
```