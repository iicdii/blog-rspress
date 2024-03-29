---
tags:
  - JavaScript
created: 2019-01-27T00:00:00.000Z
published: true
title: 최근 JavaScript를 공부하면서 배운 5가지
---

# 최근 JavaScript를 공부하면서 배운 5가지

📅 2019. 01. 27

## 1. for...in은 오브젝트 키를 탐색하는 용도다.
처음에 for...in의 존재를 알았을 땐 단순히 '엘레강트하게 반복문을 짜라고 만든 문법이구나!' 라고 생각했지만 틀렸다.
MDN에서 정의한 for...in의 설명을 보면 정확하게 object를 위한 문법이라고 설명되어있다.

> The **`for...in`  statement** iterates over all non-[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [enumerable properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) of an **object.**

for...in의 주 목적은 **object의 키를 탐색하는 것**이다.
배열 탐색 용도로 사용할 경우 매번 속성을 탐색하기 때문에 성능상으로 느릴뿐더러
의도치않은 property까지 탐색하는 등 side-effect를 일으킬 수 있다.

```js
for (let item in [1,2,3]) {} // Wrong
for (let item in { key1: 'a', key2: 'b' }) {} // Correct
```

## 2. console.time, console.timeEnd로 성능을 측정할 수 있다.
다음과 같은 코드로 간단하게 성능을 측정할 수 있다.

```js
console.time('myTest1');
// do something
console.timeEnd('myTest1');
```

파라메터엔 고유한 label 이 인자로 들어가며, `ms`로 결과를 얻을 수 있다.

## 3. 콜백 함수의 트릭
지원했던 스타트업에서 기술면접 첫 문제로 나왔던 문제이다.
다음과 같은 코드를 주고 왜 의도하지 않은 결과 `[0, null, .., 20]`가  나오는지 설명하고 올바른 코드로 수정하라는 문제였다.

```js
const data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

const result = data.map(parseInt);

document.write(JSON.stringify(result));
//=> [0,null,null,null,null,null,null,null,null,null,10,12,14,16,18,20]
```

일단 parseInt쪽에서 문제가 있는건 확실했다. 따라서 다음과 같이 코드를 고치고 제출했다.

```js
const data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

const result = data.map(n => parseInt(n));

document.write(JSON.stringify(result));
//=> [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
```

"이대로 제출하겠습니다."라고 말했더니 면접관 분이 뭐가 문제였나요?라고 물어봤다. '아, 뭐가 문제인지 설명하라고 했었지..' 살짝 당황했지만 "다시 검색해봐도 될까요?"라고 말한 뒤 구글링을 시작했다.

운좋게도 javascript map을 검색한 [첫번째 MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)에서 정확히 이 문제와 같은 케이스를 친절하게 설명하고 있었다(!)

설명을 요약하면, map은 `element, index, array` 세 개를 인자로 받고 parseInt는 `string, radix` 두 개를 인자로 받는다. 문제는 map에 `parseInt`를 넘기면서, map의 두 번째 인자인 index가 parseInt의 `radix`로 넘어가게 되는 것이다.
즉, 다음과 같이 실행되는 것이다.

```js
data.map((e, i, arr) => parseInt(e, i));
//=> (0, 0, arr) => parseInt(0, 0) = 0
//=> (1, 1, arr) => parseInt(1, 1) = null
//=> (2, 2, arr) => parseInt(2, 2) = null
```

사실은 엄청 쉬운 문제였으나, 문제와 같이 직접 콜백 함수에 함수를 곧바로 넣는 방식의 코딩을 해 본적이 없어서
매우 당황스러웠던 문제이다. 결국 기술면접에선 떨어졌지만, 아직도 기억에 남는 인상적인 문제이다.

## 4. `in`으로 오브젝트 키 존재여부를 알 수 있다.
최근에 알게 된 문법이다.

```js
'foo' in { foo: 'bar' } // => true
```

`hasOwnProperty`와의 차이점은 다음의 코드를 보면 쉽게 이해할 수 있다.

```js
({ foo: 'bar' }).hasOwnProperty('toString') // false
'toString' in ({ foo: 'bar' }) // true
```

`in` 오퍼레이터는 프로토타입에 포함된 속성까지 찾는 반면,  `hasOwnProperty`는 자신이 직접 갖고 있는 속성만 탐색한다.

## 5. Splice vs Slice

배열에서 요소를 제거할 때마다 항상 how to remove element from array 를 검색해서 stackoverflow의 첫번째 답변을 보고 복붙을 하는게 일상이 되었다. 자바스크립트 개발자로서 반성의 시간과 확실한 정리의 시간을 갖기 위해서 목차로 넣게 되었다.

### 5-1. splice()
> `array.splice(start[, deleteCount[, item1[, item2[, _...]]]]_)`

- 배열에서 제거한 요소들을 반환한다.
- 기존 배열이 **바뀐다.**

### 5-2. slice()
> `arr.slice(_[_begin[, end]])`

- 배열에서 선택된 요소들을 반환한다.
- 기존 배열이 **유지된다.**

어떤 함수가 어떤 값을 반환하는지, 기존 데이터에 변화가 있는지를 알고 있는게 중요한 것 같다. 개발 초기에 가장 많이 했던 실수가 변수에 선언없이 `concat`을 실행하고 '왜 똑같지?' 삽질하던 경험이다. `push`와 같이 곧바로 배열에 함수가 적용될거라는 착각 때문이었다. 그래도 삽질이 소득이 있었으니 다행이다!