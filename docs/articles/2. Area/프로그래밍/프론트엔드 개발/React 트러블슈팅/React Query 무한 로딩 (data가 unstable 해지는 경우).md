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
---

React Query가 무한으로 네트워크를 요청하는 일이 발생했다.
찾아보니, `data`가 안정적인 참조값을 들고 있지 않아, `data`에 의존성을 가진 useEffect가 계속해서 실행되는 문제였다.

useQuery가 리턴하는 data는 항상 안정적이지 않은걸까? 기본적으로는 안정적이지만, 조건에 따라 `data`가 새로 생성되는 경우가 있다. 어떤 경우에 `data` 객체가 새로 생성될까?

```tsx
const useXXXQuery = (options) =>
	useQuery('fetchXXX', () => fetchXXX(), {  
	  select: data => data.data,  
	  ...options,  
	});

// data는 unstable함
const { data } = useXXXQuery();
```

여기서 data가 unstable한 이유는, select 함수의 참조값이 달라질 경우 결과값을 렌더링 싸이클마다 매 번 새로 생성하기 때문이다.

React Query 소스코드를 살펴보면, v4, v5 에서 동일한 로직을 발견할 수 있다.

https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L474

```ts

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

위 코드에서 문제가 되는 부분은 바로 아래 비교 로직이다.

```js
options.select === this.#selectFn
```

[React Query 메인 테이너의 블로그](https://tkdodo.eu/blog/react-query-data-transformations#3-using-the-select-option)에서도 이 부분에 대해 언급하고 있다.

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