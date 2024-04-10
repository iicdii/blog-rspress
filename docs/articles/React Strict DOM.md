---
tags:
  - React
created: 2024-04-10T00:00:00.000Z
published: true
title: React Strict DOM
---

# React Strict DOM

📅 2024. 04. 10

[React Strict DOM(RSD)](https://github.com/facebook/react-strict-dom)은 Meta에서 실험 단계로 개발중인 프로젝트다. RSD는 웹 개발자들이 사용하는 `div`, `span`같은 요소를 네이티브 코드에도 동일하게 사용할 수 있게 만들어준다고 보면 된다. 예를 들어, React Native에서 제공하는 `TextInput`라는 컴포넌트를 알지 못해도 웹에서 개발하듯이 `input`을 사용하면 된다. 이러한 지식이 없이도 개발이 가능할 수 있다면, 러닝 커브가 줄어들어 React Native 경험이 없는 개발자들의 진입 장벽이 낮아지는 효과를 기대할 수 있다. README 문서를 보면, "Meta는 RSD를 통해 더 적은 수의 엔지니어로 더 많은 플랫폼에 더 빠르게 기능을 제공할 수 있다"고 언급한다.

다음은 저장소의 Expo [RSD 예제 코드](https://github.com/facebook/react-strict-dom/blob/2c32133262dedf403a40eeb17f396289d54a756a/apps/examples/src/App.js) 일부이다. 코드를 보면 어떤 식으로 RSD가 사용될 지 예측해볼 수 있다.

```jsx
import { css, html } from 'react-strict-dom';

const egStyles = css.create({
  container: { borderTopWidth: 1 },
  h1: { padding: 10, backgroundColor: '#eee' },
  content: { padding: 10 },
  div: {
    paddingBottom: 50,
    paddingTop: 50,
    backgroundColor: 'white'
  }
});

function ExampleBlock(props: ExampleBlockProps) {
  const { title, children } = props;
  return (
    <html.div style={egStyles.container}>
      <html.h1 style={egStyles.h1}>{title}</html.h1>
      <html.div style={egStyles.content}>{children}</html.div>
    </html.div>
  );
}
```

(전) Meta React 팀 엔지니어 [Dan Abramov 인터뷰](https://youtu.be/Ehjw-Cw_OeY?si=P3inCk2YG98Lawgc&t=1183) 에서 RSD에 언급하는 내용(19분 43초 부터)이 있다. DOM/CSS 뿐만 아니라 웹에서 유용하게 쓰이는 `IntersectionObserver` 같은 API도 구현되는 방향으로 개발되고 있다고 한다. 