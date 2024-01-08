---
tags: null
created: 2021-04-29T00:00:00.000Z
published: true
title: 2021-04 TIL - Apollo Client v2 to v3, Next.js Link
---

# 2021-04 TIL - Apollo Client v2 to v3, Next.js Link

📅 2021. 04. 29

# Apollo-client v2 to v3 마이그레이션
마이그레이션에 대한 자세한 가이드는 https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/ 여기서 확인할 수 있다.

최근에 Apollo-client가 v3로 업그레이드 되면서 문서를 보고 마이그레이션을 진행했다. 가장 큰 변경사항은 나눠져있던 패키지가 하나로 통합되었다는 점이다.

```js
npm install @apollo/client
yarn add @apollo/client
```
이 패키지 안에 기존에 사용하던 `ApolloProvider, useQuery, useMutation`등의 모듈이 전부 포함되어있다.
처음엔 일일이 이걸 다 바꿔야 하나..?! 했는데 공식 레파지토리에서 [마이그레이션 스크립트](https://github.com/apollographql/apollo-client/tree/main/scripts/codemods/ac2-to-ac3 "migration ac2 to ac3")를 만들어 두었더라.
코드를 실행하니 구 패키지들이 새 패키지로 마법처럼 바뀌었다. 몇 군데 덜 바뀐 부분만 수동으로 바꾸어주었다. 이제 끝났나 싶었는데...

## Trouble Shooting
### Core Pagination API 변경
역시 마이그레이션이 마냥 순조로운 것은 아니였다. 마이그레이션 적용 후 페이지네이션이 안된다는 제보가 들어와서 확인해보니 콘솔창에 `fetchMore` 함수의 콜백인 `updateQuery`가 `deprecated` 됬다는 워닝이 떴다. 공식 문서에 따르면 `updateQuery` 대신에 커스텀 `merge` 함수를 구현해서 apollo client 생성할 때 넣어주면 된다고 한다.  

> In Apollo Client 2, you would also provide fetchMore an updateQuery function, which was responsible for merging the followup query's results with your existing cached data. In Apollo Client 3, you instead define custom merge functions. This enables you to specify all of your pagination logic in a central location, instead of duplicating it everywhere you call fetchMore.

모든 페이지네이션 로직을 한 곳에서 관리할 수 있게 해준다고? 흥미로워 보인다. 일단 적용해보자.

```graphql
# select 쿼리, 타입 정의
type Select {
  name: String!
  list: [JSON]!
  subList: [JSON]
  aggregate: SelectAggregator
}

type SelectAggregator {
  totalCount: Int
  count: Int
}

select(
  model: String
  plugin: String
  targetModel: String!
  subTargetModel: String
  where: JSON
  subWhere: JSON
  start: Int
  selectValues: [String]
): Select
```

```js
const cachePolicy = {
  typePolicies: {
    Query: {
      fields: {
        select: {
          keyArgs: ['targetModel'],
          // Concatenate the incoming list items with the existing list items.
          merge(existing, incoming, { readField }) {
            const existingIdSet = new Set(
              (existing?.list || []).map((item) => readField('id', item))
            );

            const mergedList = (incoming.list || []).reduce((list, item) => {
              return !existingIdSet.has(readField('id', item))
                ? list.concat(item)
                : list;
            }, existing?.list || []);

            return {
              ...incoming,
              list: mergedList,
            };
          },
        },
      },
    },
  },
};

// ...
return new ApolloClient({
  // ...,
  cache: new InMemoryCache(cachePolicy).restore(initialState),
});
```

위 코드를 완성하면서 몇 가지 삽질을 통해 알아낸 사실을 설명하려고 한다.
### typePolices의 key는 GraphQL type 명칭이다.
```js
  typePolicies: {
    Query: {
```
여기 `Query`라고 되있는 부분은 GraphQL의 타입명칭을 적어야 한다. `typeDef`에 있는 타입들을 지정할 수 있으며 최상위 타입인 `Query`를 적으면 merge 함수에서 좀 더 많은 데이터들을 조작할 수 있다.

### fields의 key는 GraphQL field 명칭이다.
핵심은 depth에 관계 없이 필드 지정이 가능하다는 것이다. 하위 필드를 지정하면 `existing`, `incoming` 데이터도 하위 필드의 데이터로 받아온다.
```js
      fields: {
        select: {
```

### keyArgs에 따라 캐시 플랜이 바뀐다.
`keyArgs`는 데이터가 argument 중 어떤 필드 기준으로 캐싱될지를 정해주는 옵션이다. `false`로 지정하면 모든 argument를 고려해서 캐싱한다.
아래 예시를 보자.
```graphql
select(
  model: String
  targetModel: String!
  start: Int
)
```
`model`, `targetModel`, `start` 세 가지 argument를 받는 쿼리다. `InMemoryCache`는 기본적으로 세 인자의 모든 조합을 고려해서 캐싱한다.
```js
// Cache A
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 0,
}

// Cache B
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 10,
}

// Cache C
variables: {
  model: 'bank',
  targetModel: 'application::bank.bank',
  start: 0,
}
```
세 가지 값 중 인자가 하나라도 다르면 내부적으로 별도의 객체에 캐싱된다.

처음에 문서의 기본 예제를 보고 `false`로 지정했다가 `existing`과 `incoming` 데이터의 `model` 값이 다르게 들어와서 삽질을 했다. 내가 페이지네이션 하려는 `select` 쿼리는 `targetModel` 필드를 기준으로 캐싱이 되어야 한다. 그래서 다음과 같이 코드를 작성했다.
```js
keyArgs: ['targetModel'],
```

캐시되는 오브젝트도 다음과 같이 저장될 것이다.
```js
// Cache A
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 0,
}

// Cache A - targetModel이 A와 같으므로 Cache A에 Hit
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 10,
}

// Cache B - targetModel이 Cache A와 다르므로 별도 오브젝트에 저장
variables: {
  model: 'bank',
  targetModel: 'application::bank.bank',
  start: 0,
}
```

실제 데이터를 요청했을 때 어떻게 결과물이 들어오는지 살펴보자.
1) 최초 데이터 요청

```js
// Cache A
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 0,
}

merge(existing, incoming, { readField }) {
  console.log('existing');
  // undefined
  console.log('incoming');
  // { name: 'customer', list: [{ id: 1, name: 'A거래처' }], subList: [] }
  return blahblah...
}
```

2) 두번째 데이터 요청 (`start: 1`)

```js
// Cache A - targetModel이 A와 같으므로 Cache A에 Hit
variables: {
  model: 'customer',
  targetModel: 'application::customer.customer',
  start: 1,
}

merge(existing, incoming, { readField }) {
  console.log('existing');
  // { name: 'customer', list: [{ id: 1, name: 'A거래처' }], subList: [] }
  console.log('incoming');
  // { name: 'customer', list: [{ id: 2, name: 'A거래처' }], subList: [] }
  return blahblah...
}
```

3) 세번째 데이터 요청

```js
// Cache B - targetModel이 Cache A와 다르므로 별도 오브젝트에 저장
variables: {
  model: 'bank',
  targetModel: 'application::bank.bank',
  start: 0,
}

merge(existing, incoming, { readField }) {
  console.log('existing');
  // undefined
  console.log('incoming');
  // { name: 'bank', list: [{ id: 1, name: '신한은행' }], subList: [] }
  return blahblah...
}
```

혹시 이해가 안된다면 `keyArgs`를 다르게 바꿔보면서 `console.log`를 찍어보자.

# Next.js의 Link 안에 함수 컴포넌트 렌더링
> If the child of Link is a function component, in addition to using passHref, you must wrap the component in React.forwardRef

`Did you use ... React.forwardRef?` 콘솔 에러가 떠서 공식 문서를 확인해보니 Link 컴포넌트 안에 함수 컴포넌트를 렌더링 하려면 `passHref`를 쓰고, `React.forwardRef`로 컴포넌트를 감싸야 한다고 써있다.

```js
import Link from 'next/link'

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
})

function Home() {
  return (
    <Link href="/about" passHref>
      <MyButton />
    </Link>
  )
}

export default Home
```