---
tags:
  - HTML
created: 2021-08-10T00:00:00.000Z
published: true
title: HTML 태그들, 헷갈리는거 정리해 보았다
---

# HTML 태그들, 헷갈리는거 정리해 보았다

📅 2021. 08. 10

b와 strong 중에 어떤걸 쓰는게 정답일까요? 왜 div로 모든 레이아웃을 구성하는게 나쁜걸까요? HTML 태그를 사용하면서 헷갈릴 수 있는 내용들을 [드림코딩 by 엘리님의 유튜브](https://www.youtube.com/watch?v=T7h8O7dpJIg&ab_channel=%EB%93%9C%EB%A6%BC%EC%BD%94%EB%94%A9by%EC%97%98%EB%A6%AC "드림코딩 by 엘리님의 유튜브")를 보고 정리해보았습니다.
# 시맨틱 태그
시맨틱은 "의미가 있다"는 뜻입니다. 프라이팬과 컵이 있습니다. 여러분은 어디에 물을 부어서 마실건가요? 물론 프라이팬에 물을 부어서 마실수도 있지만, 컵을 냅두고 굳이 프라이팬에 물을 따르진 않죠? HTML 태그도 마찬가지로 태그마다 의미가 있습니다. Top heading 타이틀을 작성하는 상황이라면 span 대신에 h1 태그를 사용할 수 있겠죠. h1 태그를 사용하면 브라우저는 '아 이건 중요한 제목이구나'라고 인식하고 글씨 크기를 크게 표시할 것이고, 개발자도 의도를 파악하기가 더 쉬워집니다.

# 시맨틱 태그가 중요한 이유 3가지
### 📝 SEO
시맨틱 태그가 잘 정의되어 있으면 Search Engine Optimization에 도움이 됩니다. SEO가 잘되있을수록 사람들이 검색 엔진에 키워드를 검색했을 때 내가 만든 사이트가 추천될 확률이 높아집니다.

### 🕶️ 접근성
스크린 리더를 이용하거나 키보드만을 사용해서 사이트를 이용할 때 웹 접근성이 좋아집니다.

### 🔧 유지 보수
개발자들이 의도를 파악하기 더 쉬워집니다.

# 📦 웹사이트 구조를 이루는 태그들

### 1. div만으로 구성한 레이아웃
![[html_layout_only_div.png]]
### 2. semantic tag로 구성한 레이아웃
![[html_layout_with_semantic.png]]

어떤게 더 보기 좋아보이시나요?
## `article` vs `section`
### `article`
`article`은 블로그 포스트에서 포스트 하나, 신문 기사에서의 기사 하나를 표현할 때 사용합니다. `article`은 `article` 자체만으로 다른 페이지에 보여졌을 때 전혀 문제가 없는, 독립적이고 고유한 정보를 나타내려 할 때 사용할 수 있습니다.

```html
// article 구성 예시
<main>
  <article>
  </article>
</main>
```

### `section`
`main` 안이나 `article` 안에서 연관 있는 내용들을 하나로 묶어주는 역할을 합니다. 한 페이지 안에서 여러가지 내용을 보여준다면 `section` 단위로 묶을 수 있습니다.

```html
// section 구성 예시 1
<main>
  <article>
    <section>주제 1</section>
    <section>주제 2</section>
  </article>
</main>
```

```html
// section 구성 예시 2
<main>
  <section>
    <article>
      blah blah...
    </article>
  </section>
  <section>
    blah blah...
  </section>
</main>
```

## `i` vs `em`
`i` 태그는 시각적으로만 이탤릭체이고 `em`은 시각적, 청각적으로 강조되는 이탤릭체입니다. 스크린 리더로 아래 HTML 태그를 읽어보면

```html
나는 <i>삼겹살</i>을 <em>진짜진짜</em> 좋아한다.
```

삼겹살은 그대로 읽어주고, 진짜진짜는 __진!짜!진!짜__ 라고 읽힙니다.

## `b` vs `strong`
`b` 태그는 시각적으로만 볼드체이고 `strong`은 시각적, 청각적으로 강조되는 볼드체입니다. 스크린 리더로 아래 HTML 태그를 읽어보면

```html
나는 <b>뿌링클</b>을 <strong>정말정말</strong> 좋아한다.
```

뿌링클은 그대로 읽어주고, 정말정말은 정!말!정!말 이라고 읽힙니다.

## img vs CSS background
### img
이미지가 웹 페이지 안에서 하나의 중요한 콘텐츠로 구성되어 있다면 `img` 태그를 사용합니다.

![[img_tag_example.png]]
### CSS background
이미지가 문서의 내용과 별개로 스타일링 목적을 위해서 배경 이미지로 사용되는 경우 (문서의 일부분이 아닌 경우) `CSS background`로 사용합니다.

![[css_background_example.png]]

![[css_background_example2.png]]
# 정리
- `div`를 남발하지 말고 `header`, `nav`, `article`, `section`, `footer` 등 적절한 시맨트 태그를 이용해서 레이아웃을 구성하면 SEO, 웹 접근성, 유지보수에 좋다.
- `i`는 시각적으로 이탤릭, `em`은 시각적, 청각적으로 이탤릭체이다.
- `b`는 시각적으로 볼드, `strong`은 시각적, 청각적으로 볼드체이다.
- `img`는 내용의 한 부분을 차지할 때, `CSS background`는 스타일링 목적을 위한 뒷배경 에 사용하자.