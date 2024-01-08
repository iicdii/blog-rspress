---
tags:
  - Strapi
  - CMS
  - JavaScript
  - NodeJS
created: 2021-08-13T00:00:00.000Z
published: true
title: Strapi 1년이면 풀스택을 읊는다
---

# Strapi 1년이면 풀스택을 읊는다

📅 2021. 08. 13

![](https://i.imgur.com/BTnd2BE.png)

Strapi를 실무에 도입한지 어느덧 1년 반이 되었네요. 서버 환경구성을 쉽게 하려고 도입했다가 Strapi 상위 60번째 컨트리뷰터가 된 저의 우당탕탕 사용기를 여러분께 소개드리고자 합니다. Strapi는 프로덕션 레벨에서 쓸만할까요? 저는 Yes라고 봅니다. 관심있으시면 계속 읽어주세요 😀
# 🚀 Strapi?
Bootstrap + API를 줄여서 Strapi라고 합니다. 한글로 스트라피라고 읽습니다. Strapi는 Node.js 웹 프레임워크 중 하나인 Koa 기반으로 구현되었으며 풀 커스터마이징이 가능한 개발자 우선(Developer-first) 오픈소스 Headless CMS입니다. 요기요, L’Equipe, Societe Generale, ERLKOENIG & 도요타, bancointernacional 등의 기업에서 운용하는 서비스의 백엔드로 Strapi를 채택해 사용하고 있습니다.

# Headless CMS?
CMS는 Content Management System의 약자입니다. Wordpress, 제로보드 XE 등 전통적인 CMS와는 다르게 Headless CMS는 오로지 콘텐츠 관리만을 위한 서비스입니다. 기존 CMS는 뷰와 콘텐츠가 결합되어 있던 반면 Headless CMS는 REST API, GraphQL 등을 사용해서 콘텐츠 데이터를 제공합니다. Headless CMS를 사용하면 내가 원하는 기술 스택(ex: 콘텐츠 관리는 Strapi, 뷰는 Next.js)으로 사이트를 구성할 수 있다는 장점이 있습니다.

# 왜 Strapi를 선택했나?
입사 1년차쯤에 사내에서 전자결재 시스템을 직접 개발하는 프로젝트를 담당하게 되었습니다. 저희 프로젝트의 백엔드는 대부분 Python 기반의 Django 혹은 Flask를 사용하고 있는데, JavaScript를 주력으로 사용하는 저의 입장에서 백엔드를 JavaScript화 시켜야 겠다는 욕망(?)이 생겼습니다. Django도 물론 좋은 프레임워크지만, Node.js 기반의 Strapi로 바꾸게 된 계기가 있습니다.

### Python과 JavaScript 혼용이 불편하다.
모든 언어가 그렇겠지만, 언어마다 다른 syntax를 가지고 있기 때문에 교차해서 쓰면 굉장히 헷갈리는 부분이 많습니다. 일례로 Python의 dict와 JavaScript의 Object가 있습니다. 둘은 중괄호 `{}`안에 key, value를 넣는다는 개념은 같지만 지원하는 메소드, 오퍼레이터가 매우 다르기 때문에 쉽게 혼란의 카오스가 찾아옵니다. 특히 프론트엔드 개발자인 제가 백엔드 까지 작업해야 하는 상황이었으니 JavaScript로 백엔드 로직을 짤 수 있다는 이점을 포기하고 싶지 않았죠.

### Node.js 경험도, 인력도 부족해.. 😢
아직 경험이 많지 않은 개발자분들이라면 한번 쯤 '내가 잘하고 있는게 맞나..?'라는 생각 해보셨을겁니다. 프로젝트 구축 당시 새로 나온 React hook을 공부하느라 바쁜 한낮 프론트 뉴비였고 Node.js 스택을 실무에서 구축해본 경험이 없었기 때문에 살짝 겁먹은 상태였습니다. 프로젝트 마감 기한이 있었기 때문에 혼자 Node.js를 공부하면서 하는 것보다는 잘 만든 프레임워크를 찾자! 가 떠오른 대안이였습니다.

Strapi를 처음 접하게 된 건 Alex Kwon님의 [코딩 없이 10분 만에 REST API/Graphql 서버 개발하기](https://medium.com/@khwsc1/js%EB%A1%9C-10%EB%B6%84%EB%A7%8C%EC%97%90-rest-api-graphql-%EC%84%9C%EB%B2%84-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0-d28148dbdef2 "코딩 없이 10분 만에 REST API/Graphql 서버 개발하기") 글 덕분이었습니다. UI에서 모델의 필드, 타입을 설정하고 저장을 누르는 순간 해당 모델의 CRUD가 구현된 REST API와 GraphQL Query, Mutation 그리고 모델의 json 파일이 자동으로 생성된다는 점이 매우 인상 깊었습니다. 이 기능 덕분에 현업에서 얼마나 많은 시간이 단축됬는지 모릅니다.

Strapi를 클론 받아서 며칠간 써본 결과, 제가 생각한 "좋은 프레임워크"의 기준에 합격점이었습니다. 그 이유는

### 빠른 개발환경 구축이 가능하다.
CMS 자체의 장점일수도 있지만, `yarn create strapi-app my-project --quickstart` 한 줄로 기본적인 개발 환경과 UI에서 플러그인 설치, 모델 구성, 역할 설정 등을 쉽게 할 수 있는 장점이 있습니다.

### 확장성이 높고, 오픈소스 생태계가 활발하다.
Strapi 에서 공식적으로 개발한 기능 외에도 어드민 페이지 커스터마이징, 커스텀 확장 플러그인 개발 등이 가능하도록 설계 되있기 때문에 확장성이 무궁무진합니다. 또한 커밋의 95%가 스트라피 직원이 아닌 일반 컨트리뷰터일만큼 유지보수와 버그 수정이 굉장히 자주 이루어진다는 장점이 있습니다.

### GraphQL 지원
GraphQL 플러그인을 설치하면 apollo-server-koa가 내장됩니다. 독립적으로 작동하지 않고 Strapi 시스템과 연계되어 사용할 수 있어서 매우 편리합니다. 저희 웹개발팀은 Next.js + GraphQL + Apollo client로 된 프로젝트가 많아서 GraphQL에 익숙하기 때문에 Strapi에서 GraphQL을 사용할 수 있었던 점이 굉장히 반가웠습니다.

Django, Express, Strapi 중 하나를 고민했지만, 백엔드와 프론트엔드를 JavaScript로 통일해서 효율성을 높이기 위해서 Node.js 기반의 프레임워크를 선택하게 되었습니다. Express는 내가 원하는 환경과 기능을 자유롭게 구현할 수 있다는 장점이 있지만, 개발 환경 구성 비용과 저의 부족한 백엔드 숙련도를 고려했을 때 Strapi를 대안으로 결정하게 되었습니다. Strapi를 사용하면 비즈니스 로직에 집중할 수 있으며, 필요한 경우 커스터마이징이 충분히 가능한 오픈소스였기 때문에 제 선택의 기준에 충분히 맞아떨어졌습니다. 🙂

# 기능
### Shadow CRUD
Strapi의 강력한 기능 중 하나인 [Shadow CRUD](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/graphql.html#shadow-crud) 기능 입니다. 모델을 생성하면 해당 모델의 CRUD를 구현한 REST API/GraphQL endpoint를 자동으로 생성해주는 매우 유용한 기능인데요. Strapi 공식 문서에서는 Shadow CRUD를 다음과 같이 설명하고 있습니다.

> To simplify and automate the build of the GraphQL schema, we introduced the Shadow CRUD feature. It automatically generates the type definition, queries, mutations and resolvers based on your models. The feature also lets you make complex query with many arguments such as `limit`, `sort`, `start` and `where`.

데이터를 조회할 때 자주 필요한 `limit`, `sort`, `start`, `where` 파라메터까지 지원하고 있어서 대부분의 유스케이스는 Shadow CRUD로 커버가 가능한 장점이 있습니다. `where`절을 작성하는 법은 공식 문서의 [GraphQL - filters](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/graphql.html#filters "GraphQL filters") 를 참조하거나 REST API의 경우 [Content API - filters](https://docs-v3.strapi.io/developer-docs/latest/developer-resources/content-api/content-api.html#filters "REST API filters") 를 참조하시면 됩니다. 만약 쿼리가 복잡해지거나 성능이 떨어지는 경우 직접 controller/service를 만들거나 [custom resolver](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/graphql.html#define-a-custom-resolver "Define a custom resolver")를 작성할 수도 있습니다.

__🍯 소소한 꿀팁__

Shadow CRUD로 생성된 CRUD 메소드를 오버라이드 할 수 있습니다. 예를 들어 `Post` 콘텐츠 타입이 `create`될 때, `creator` 필드에 사용자를 매핑하고 싶으면 다음과 같이 구현할 수 있습니다.

```js
// api/post/controllers/post.js

'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  create: async (ctx) => {
    const { user } = ctx.state;
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['post'].create(data, { files, user });
    } else {
      entity = await strapi.services['post'].create(ctx.request.body, {
        user,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models['post'] });
  },
}  
```
```js
// api/post/services/post.js

'use strict';
const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  create: async (data, { files, user } = {}) => {
    const isDraft = isDraft(data, strapi.models.restaurant);
    data.creator = user.id;

    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models['post'],
      data,
      { isDraft }
    );
    const entry = await strapi.query('post').create(validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'post',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
};
```

이렇게 하면 REST API 뿐만 아니라 GraphQL에서도 `creator`가 매핑됩니다. 단, 어드민 페이지에서는 생성할 때는 매핑되지 않으니 주의하세요. 

### 구글 로그인 등 15개의 인증 Provider
#### Strapi에서 지원하는 Provider 목록
- Auth0
- Cas
- Cognito
- Discord
- Facebook
- Github
- Google
- Instagram
- Linkedin
- Microsoft
- Reddit
- Twitch
- Twitter
- Vk

Strapi는 [purest](https://github.com/simov/purest "purest") 라이브러리를 이용해서 기본적인 이메일 로그인을 포함한 15개의 인증 방법을 제공합니다. 액세스 키, 시크릿 키 등 간단한 환경설정만 해주면 간단하게 소셜 로그인을 구현할 수 있으며, 이메일 로그인의 경우 비밀번호 찾기, 비밀번호 재설정 API와 메일 템플릿까지 설정할 수 있도록 구현되어 있어 인증 개발시간을 매우 단축시킬 수 있습니다.

__🍯 소소한 꿀팁__

소셜 로그인을 구현할 때 프로필 사진 등 추가적인 데이터(scope)가 필요한 경우 `extensions/users-permissions/services/Providers.js` 파일을 생성해서 `connect` 함수를 커스터마이징할 수 있습니다. [원본 파일](https://github.com/strapi/strapi/blob/releases/v3.6.9/packages/strapi-plugin-users-permissions/services/Providers.js "Original Provider.js")을 `extensions/users-permissions/services/Providers.js` 경로에 그대로 복사해서 필요한 부분을 고치면 됩니다. (폴더가 없으면 새로 만들어주세요.) 저는 [purest 목차](https://github.com/simov/purest#table-of-contents "purest 목차") 와 해당 프로바이더의 API 문서를 참고해서 커스터마이징을 진행했습니다.

### RBAC (Role Based Access Control)
> 역할 기반 접근 제어(role-based access control, RBAC)는 컴퓨터 시스템 보안에서 권한이 있는 사용자들에게 시스템 접근을 통제하는 한 방법이다. - 위키 백과

Strapi는 Admin과 User 각각 별도의 Role/Permission을 설정할 수 있는 페이지를 제공합니다. (Strapi가 왜 Admin, User 테이블을 나눠놨는지 궁금하신 분은 [Why we split the management of Admin Users and End Users](https://strapi.io/blog/why-we-split-the-management-of-the-admin-users-and-end-users#:~:text=In%20summary%2C%20separating%20Admin%20Users,database%20issues%20down%20the%20road. "Why we split the management of Admin Users and End Users")를 읽어주세요.) 여기서 __Role은 역할__, __Permission은 역할이 할 수 있는 일(권한)__ 을 말합니다.  

처음 Strapi를 설치하고 만드는 어드민 계정은 기본적으로 `Super Admin` 역할을 갖게 됩니다. Super Admin은 슈퍼유저와 같은 권한으로 모든 것을 관리할 수 있는 강력한 권한이 있습니다. 만약 권한이 한정된 (ex: 게시물 생성, 수정만 가능한) 계정을 만들고 싶다면 `http://.../admin/settings/roles` 페이지에서 역할과 권한을 설정할 수 있습니다. 모델 별로 CRUD 각각의 권한 등 세세한 설정이 가능합니다. 단, 무료 플랜의 경우 3개의 역할까지만 생성이 가능합니다. 1달에 29$ 브론즈 플랜을 이용하면 30개 까지 역할을 생성할 수 있습니다.

User는 기본적으로 `Public`, `Authenticated` 두 개의 역할이 있으며 비로그인 사용자의 요청은 모두 `Public` 권한에서 설정한 규칙을 따르게 됩니다. API를 누구나 쓸 수 있게 오픈하고 싶으면 `Public` 권한에서 해당 기능을 체크하면 되겠죠? 반면 `Authenticated` 역할은 로그인 사용자에게 부어지는 기본 역할입니다. 만약 기본 역할을 `Authenticated` 말고 다른 역할로 바꾸고 싶다면 고급 설정(`http://.../admin/settings/users-permissions/advanced-settings`) 페이지에서 인증된 사용자의 기본 역할(role)을 원하는 역할로 설정해주시면 됩니다.

프론트엔드에서 User 조회 API를 사용하면 `role` 데이터를 받아올 수 있는데요. 이 `role`에 따라서 특정 페이지의 접근 권한을 제어하거나, 특정 기능의 실행 권한을 제어할 수 있습니다.

### SQLite, PostgreSQL, MySQL, MariaDB, MongoDB 지원
[지원되는 데이터베이스 및 버전](https://docs-v3.strapi.io/developer-docs/latest/setup-deployment-guides/installation/cli.html#preparing-the-installation "지원되는 데이터베이스 및 버전")에서 최소 버전과 지원하는 DB 목록을 확인할 수 있습니다. MongoDB는 곧 출시될 v4 릴리즈에서는 아쉽게도 지원이 중단될 예정이라고 합니다. 지원 중단을 결정한 이유는 아래에서 별도로 얘기하겠습니다. Strapi는 SQL DB의 경우 `bookshelf` ORM, MongoDB의 경우 `mongoose` ORM 위에 Strapi에서 개발한 커스텀 ORM을 쌓아놓은 형태로 구현되어있습니다. 따라서 쿼리를 호출할 때 Strapi ORM에 정의된 API에 맞춰서 `strapi.query('model').find({});`와 같이 실행합니다. 커스텀 쿼리가 필요한 경우 `await strapi.connections.default.raw(`SELECT * FROM table`);` 처럼 쓸수도 있습니다.

__Strapi가 MongoDB 지원을 중단한 이유__

MongoDB는 SQL 기반을 베이스로 한 Strapi의 모델 구조와 맞지 않아 성능이 떨어지고 유지보수가 어려우며 Strapi에서 MongoDB로 생성한 프로젝트 비율이 너무 적어서 드랍을 결정하게 되었다고 합니다. 다음 버전에서도 사용은 가능하지만 비공식 플러그인으로 지원될 예정이며, 기존 MongoDB 사용자들에게는 Migration 가이드/스크립트를 제공할 예정이라고 합니다. 저희 팀에서도 MongoDB 기반의 Strapi 프로젝트가 2개 있는데, 아마 MySQL로 이전을 하지 않을까 싶습니다. Strapi 팀의 말대로 NoSQL에 맞지 않는 모델 구조 때문에 쿼리 튜닝을 열심히 해봤지만 그래도 큰 효과는 나타나지 않더라구요.

### 이메일, 업로드 등 확장성 높은 플러그인 기능
Strapi의 플러그인은 이메일 전송, 파일 업로드 등 흔한 개발 요구사항을 쉽게 사용할 수 있도록 도와줍니다. 플러그인을 사용하면 패키지를 리서치 하고, best-practice를 고민하고, 유지보수하는 시간을 줄일 수 있습니다. S3 파일 업로드, AWS SES 메일 전송 플러그인 등을 Strapi에서 공식적으로 유지보수/관리 하고 있기 때문입니다.

#### 📧 이메일 플러그인 종류와 사용법
Strapi를 설치하면 기본적으로 `strapi-plugin-email` 플러그인이 설치되어있습니다. 어떤 방법으로 이메일을 전송할지는 다음 6가지 패키지 중에 선택하면 됩니다.

- strapi-provider-email-amazon-ses
- strapi-provider-email-mailgun
- strapi-provider-email-nodemailer
- strapi-provider-email-sendgrid
- strapi-provider-email-sendmail

목록에 이용하려는 이메일 서비스가 없는 경우 npm에서 `strapi-provider-email`로 검색해서 사용자들이 만들어놓은 프로바이더를 사용할 수도 있고, [Create new provider](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/email.html#create-new-provider "Create new email provider") 항목을 참고해서 나만의 새 이메일 프로바이더를 만들 수 있습니다.

프로바이더를 설치했으면 해당 프로바이더의 README를 읽고 설정을 진행해줍니다.

설정이 완료되면 Strapi에서 보내는 모든 이메일은 내가 설정한 Provider를 통해 발송됩니다. 비즈니스 로직에서 이메일 발송이 필요한 경우 아래 예제를 참고해주세요.

```js
await strapi.plugins["email"].services.email.send({
  to: "paulbocuse@strapi.io",
  from: "joelrobuchon@strapi.io",
  cc: "helenedarroze@strapi.io",
  bcc: "ghislainearabian@strapi.io",
  replyTo: "annesophiepic@strapi.io",
  subject: "Use strapi email provider successfully",
  text: "Hello world!",
  html: "Hello world!",
});
```

```js
const emailTemplate = {
  subject: 'Welcome <%= user.firstname %>',
  text: `Welcome on mywebsite.fr!
    Your account is now linked with: <%= user.email %>.`,
  html: `<h1>Welcome on mywebsite.fr!</h1>
    <p>Your account is now linked with: <%= user.email %>.<p>`,
};

await strapi.plugins.email.services.email.sendTemplatedEmail(
  {
    to: user.email,
    // from: is not specified, so it's the defaultFrom that will be used instead
  },
  emailTemplate,
  {
    user: _.pick(user, ['username', 'email', 'firstname', 'lastname']),
  }
);
```

#### 📁 업로드 플러그인 종류와 사용법
Strapi를 설치하면 기본적으로 `strapi-plugin-upload` 플러그인이 설치되어있습니다. 어떤 방법으로 이메일을 전송할지는 다음 4가지 패키지 중에 선택하면 됩니다.

- strapi-provider-upload-aws-s3
- strapi-provider-upload-cloudinary
- strapi-provider-upload-local
- strapi-provider-upload-rackspace

목록에 이용하려는 서비스가 없는 경우 npm에서 `strapi-provider-upload`로 검색해서 사용자들이 만들어놓은 프로바이더를 사용할 수도 있고, [Create new provider](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/upload.html#create-providers "Create new provider") 항목을 참고해서 나만의 새 업로드 프로바이더를 만들 수도 있습니다.

프로바이더를 설치했으면 해당 프로바이더의 README를 읽고 설정을 진행해줍니다.

파일 업로드는 크게 두 가지 방법이 있는데 `/upload` 엔드 포인트에 `POST`로 파일을 업로드 하는 방법과 직접 함수를 실행해서 업로드하는 방법이 있습니다.

`/upload` 엔드 포인트에 업로드를 하는 경우 [Request parameters](https://docs-v3.strapi.io/developer-docs/latest/development/plugins/upload.html#request-parameters "Request parameters")를 보고 파일 Buffer, 업로드 경로등을 body에 담아서 `POST` 메소드로 요청할 수 있습니다.

비즈니스 로직상에서 업로드가 필요한 경우 아래 예제를 참고해주세요.
```js
const entry = await strapi.query('restaurant').create(validData);
if (files) {
  // automatically uploads the files based on the entry and the model
  await strapi.entityService.uploadFiles(entry, files, {
    model: "restaurant",
    // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
  });
}
```

```js
// controller/xxx.js
async uploadFiles(ctx) {
  const {
    request: { body, files: { files } = {} },
  } = ctx;

  await strapi.plugins.upload.services.upload.upload({
    data: body,
    files,
  });
}
```

__🖼️ 미디어 라이브러리__

upload 플러그인을 통해 업로드 된 이미지, 동영상, 오디오 파일 등은 미디어 라이브러리에서 관리 됩니다. 미디어 라이브러리는 Strapi admin 패널에 내장되있으며

- 파일 검색
- 실시간 편집
- 미리보기
- 이미지 사이즈 자동 최적화
- 파일 Replace 기능
- Small-Medium-Large 이미지 자동 생성

등 유용한 기능을 포함하고 있습니다. 자세한 내용은 https://strapi.io/features/media-library 페이지를 참고해주세요.

### 그 외 지원하는 기능
- __Draft(임시 저장)/Public(발행)__ 기능
별도 설정 없이 임시 저장 기능을 구현할 수 있습니다. 콘텐츠 타입을 생성할 때  Draft/Public 기능을 On으로 하면 발행 여부/발행 날짜 필드 등을 내부적으로 갖게 되며 발행 여부를 기준으로 쿼리를 요청할 수 있는 엔드포인트도 자동 생성됩니다.
- __I18n(다국어)__ 기능
같은 모델의 로우를 내가 설정한 다국어별로 생성할 수 있습니다.  
- __Webhook__ 기능
특정 콘텐츠 타입이 생성/수정/삭제 되었을 때 데이터의 변화를 알려주는 Webhook 기능을 어드민 패널에서 쉽게 설정할 수 있습니다.
- __Database lifecycle__ 기능
`beforeFind`, `afterFind`, `beforeCreate`, `afterCreate` 등 특정 모델의 수명 주기에 훅을 만들고 원하는 비즈니스 로직을 생성할 수 있습니다. 콘텐츠 타입을 생성하면 자동으로 생성되는 `./api/<모델명>/models/<모델명>.js` 파일에서 수명 주기를 설정할 수 있습니다.
- __Cron__ 기능
`./config/functions.cron.js`에서 특정 시간에 실행되는 스케쥴러를 설정할 수 있습니다.

# 단점
### Complex query 요청과 Query tuning이 어렵다.
Strapi는 `bookshelf`/`mongoose` ORM위에 전용 ORM을 매핑한 데이터베이스 모델 구조를 갖고 있습니다. 덕분에 어떤 DB를 사용하던지 동일한 API로 비즈니스 로직을 작성할 수 있죠. 하지만 모든 것엔 트레이드 오프가 있는 법.. Strapi ORM에서 구현할 수 없는 쿼리가 존재합니다. Strapi 쿼리에 어떤 한계가 있는지 한 번 살펴보시죠.

- __SELECT 가 존재하지 않음__

SELECT로 원하는 필드를 가져오는 건 튜닝 중의 기초인데, 현재 Strapi v3은 SELECT를 지원하지 않습니다..! 😭 최적화를 하려면 생쿼리를 써야하므로 코드가 지저분해질 가능성이 높습니다.

- __Nested Search Query를 지원하지 않음__

Strapi 쿼리 중 `search`는 모델의 첫번째 depth만 검색하기 때문에 하위 relation 검색이 불가능합니다.
```js
strapi.query('restaurant').search({ _q: 'my search query' })
```

대안으로 아래와 같이 `find` 쿼리의 `_or`을 이용하는 방법이 있는데요.
```js
strapi.query('restaurant').find({
  _or: [{ title_contains: 'keyword' }, { comments.body_contains: 'keyword' }]
})
```
이 방법도 두번째 depth 까지만 검색이 가능하기 때문에 결국 생쿼리를 써야한다는 한계가 있습니다.

- __`Media` 타입 필드는 무조건 JOIN됨__

`find`, `search` 등의 쿼리를 사용할 때 마지막 인자로 JOIN 할 필드를 지정할 수 있습니다. 만약 `[]`를 인자로 넘기면 조인이 되지 않지만, `Media` 타입 필드는 강제 JOIN이 됩니다. 데이터가 많아지면 이게 은근히 쿼리 비용이 커져서 당혹스럽습니다. 생쿼리를 쓰면 해결이 가능하긴 합니다.

### 자동 생성된 GraphQL의 한계가 존재한다.
- __모델 하나를 조회하는 쿼리는 id로만 조회가 가능함__

`Account`라는 콘텐츠 타입을 생성하면 아래와 같은 GraphQL 쿼리가 생성되는데요.
```graphql
account(
  id: ID!
  publicationState: PublicationState
): Account
```
`where` 인자가 없기 때문에 결국 `accounts` 쿼리를 써서 배열로 받아오거나 Custom resolver를 생성해야 하는 불편함이 있습니다.

- __Relation의 순서가 보장되지 않음__

`Post`(게시물) 모델이 하위 필드로 `Comment`(댓글)을 1:N으로 가지고 있다고 가정했을 때 REST API로 조회하면 Comment의 순서를 보장해주지만, GraphQL로 조회하면 무조건 id 순서로 정렬이 되서 응답이 내려옵니다. 대안으로 `JSON` 타입의 필드를 정의해서 순서를 매핑하는 등의 방법을 사용해야 합니다.

- __기본 쿼리 성능이 좋지 못함__

GraphQL의 장점 중 하나가 클라이언트에서 내가 요청한 필드만 받아올 수 있다는 점인데요. Strapi에서 생성된 GraphQL 쿼리는 'Naive'하기 때문에 기본 쿼리의 성능이 REST 보다 좋지 못합니다. 이유는 GraphQL에서 응답을 내려줄 때 해당 모델이 가진 모든 필드를 JOIN 하기 때문인걸로 추정됩니다. 이를 개선하기 위해서는 Custom Type과 Custom Resolver 정의가 불가피하다는 단점이 있습니다.

### 세부적인 모델 설정이 불가능하다.
- __SQL DB를 쓸 때 JSON 타입 필드가 통 String으로 저장됨__

SQL DB도 최근부터 JSON 필드를 지원하기 시작했는데요, (MySQL의 경우 5.7 버전부터 사용가능) Strapi에선 호환성을 위해 `"\{test:123\}"`과 같은 String 형태로 데이터를 저장하기 때문에 쿼리를 100% 활용할 수 없는 문제점이 있습니다.   

- __JSON 타입 필드의 내부 타입 필드를 정의할 수 없음__

mongoose는 스키마 안에 서브 스키마를 지정하는 식으로 모델을 구성해서 별도의 JOIN 없이 nested한 모델을 구성하는게 가능한 반면 Strapi는 하위 모델을 구성하는 경우 무조건 relation이 필요한 단점이 있습니다. 다음 v4 버전부터 MongoDB를 드랍하는 이유 중 하나이기도 하지요.

- __Database Indexing을 DB단에서 직접해줘야함__

mongoose는 모델을 정의할 때 '이 필드에 이러이러한 index를 걸어줘야 한다'를 설정하는게 가능한 반면 Strapi는 아직 인덱싱이 지원되지 않기 때문에 프로덕션에 배포하고 나서 직접 인덱싱을 걸어줘야하는 불편함이 있습니다.

# v4에서 단점들이 개선될거라는 얘기가 있다
[what updates are planned for this summer](https://strapi.io/v4 "strapi v4")에서 말하길 곧 다가올 Strapi v4에서 문제점을 개선한 버전을 출시할 예정이라고 합니다.

- Database Layer(Query Engine) 개선
- REST API / GraphQL의 확장성과 유연성 개선
- Admin 패널의 UI를 좀 더 직관적으로 변경
- Admin 패널의 Dark 모드 지원

자세한 건 나와봐야 알겠지만 PR을 살짝 훑어본 결과 위에서 언급한 "Complex query 요청과 Query tuning이 어렵다"는 문제점은 개선될 것으로 보입니다. 가장 마음에 드는 변경사항은 `SELECT` 옵션이 추가되었다는 점과 좀 더 복잡한 쿼리를 보낼 수 있도록 쿼리 엔진을 변경한 부분이였습니다 :)

# Strapi 이런 분에게 추천합니다
- 빠르게 무언가를 만들고 싶다
- 사용자가 적은 서비스가 필요하다
- 나는 프론트엔드 개발자인데 백엔드도 해야된다
- 회사에 인력이 부족하다
- JavaScript에 능숙하다

# Strapi 이런 분에게 추천하지 않습니다
- 사용자가 많은 서비스를 개발해야 한다
- 커스터마이징이 매우 많이 필요한 서버가 필요하다
- JavaScript를 잘 모른다

# 그 외 Strapi 관련 이야기
### Strapi 컨트리뷰터가 된 계기와 PR 후기
> 답답하면 니들이 뛰던가

라는 말이 있죠. 그래서 직접 뛰어보았습니다 🏃

첫 PR은 한글패치였습니다. 이미 어드민 패널에 한글화가 진행되어있었지만 일부분 번역이 매끄럽지 않거나 번역이 안 된 부분이 있어서 수정해보고 싶다는 생각이 들었습니다. 사실 저는 오픈소스에 이슈를 남겨본적은 있어도 풀리퀘스트를 직접 해본적은 없었습니다. 굉장히 두근거리는 마음으로 `CONTRIBUTING.md`를 차근차근 읽으면서 PR을 준비했습니다. 사실 파일 하나를 수정하는 일이라서 큰 부담은 없었지만 첫 커밋이라 떨리더군요. 풀리퀘를 날린지 얼마 안되서 Strapi 측에서 PR 고마워! 라고 하면서 마스터에 머지를 했을때는 매우 뿌듯했습니다 😃

두번째 PR은 몽고DB의 트랜잭션을 Strapi ORM에서 쓸 수 있도록 만들어주는 내용이었습니다. SQL DB는 이미 지원하고 있었지만 몽고DB는 사용자가 적어서 그런지 아직 지원을 하지 않더군요. 몽고 DB 문서를 찾아보았더니 MongoDB 4.0 버전부터 `multi document transaction`을 지원하고 있었고, mongoose에서도 `session` 파라메터를 통해서 트랜잭션 처리가 가능했습니다. 다만 Strapi의 ORM에선 이 `session` 파라메터를 받는 부분이 없었기 때문에 이 부분만 추가해주면 되겠는데? 라고 생각했고 실제로 테스트를 해보니 생각한대로 트랜잭션이 잘 되더군요. 꼼꼼히 코드를 수정, 확인하고 PR을 날렸지만 역시 코어한 내용이라 그런지 리뷰가 엄청 느렸습니다. 중간중간에 master 브랜치의 수정사항 때문에 conflict를 해결하거나 CI 테스트에 실패해서 이를 수정하는 과정도 빈번했습니다. 결과적으로 무려 1년에 걸쳐서 제 PR이 마스터에 머지가 되었습니다 🎉🎉 덕분에 제 프로젝트에서 커스텀으로 쓰던 MongoDB 커넥터를 Strapi 공식 커넥터로 다시 대체할 수 있어서 기분이 매우 좋았습니다 😁

이 외에도 현재 진행형이거나, 테스트를 통과하지 못해서 실패한 PR 등이 있는데 모두 저에게 좋은 경험이 되고 있습니다! 크리티컬한 버그 같은 경우는 PR 반영이 매우 빨라서 좋더군요. Strapi가 38.4k의 스타를 가지고 있는 것도 사용자들이 이런 활발한 생태계를 느끼고 있기 때문이 아닌가 싶습니다.

### 외부 서비스에서 사용할 Strapi 액세스 토큰 만들기
저희 팀은 내부적으로 통신하는 프로젝트가 많다보니 외부 서비스에서 사용할 인증 수단이 필요했습니다. Strapi는 JWT 기반의 액세스 토큰으로 인증된 사용자인지를 검증하고 있는데, 로드맵에는 있으나 아직 공식으로 액세스 토큰 생성을 지원하지는 않습니다. 그래서 사용자가 직접 액세스 토큰을 만들어서 사용해야 합니다. 액세스 토큰을 만드는 방법은 두 가지가 있는데 첫번째는 User 기반의 액세스 토큰을 만드는 방법이고 두번째는 Admin 사용자 기반의 액세스 토큰을 만드는 방법입니다.

User 기반의 액세스 토큰은 Admin 토큰에 비해 보안 상 좀 더 안전합니다. 엔드 포인트의 권한을 세세하게 줄 수 있기 때문이죠. Admin 토큰은 기본 권한이 Super Admin이기 때문에 편리하지만 보안성은 떨어집니다. 어드민 역할 관리 페이지에서 제한된 권한을 줄 수는 있지만 무료 플랜은 3개까지만 역할을 만들 수 있고 역할이 갖는 권한의 범위를 User 토큰에 비해서 세세하게 줄수 없다는 단점이 있습니다. 

__User 기반의 액세스 토큰을 만드는 방법__ 은 Strapi 공식 문서의 [API tokens](https://docs-v3.strapi.io/developer-docs/latest/guides/api-token.html#api-tokens "API tokens")를 참조해주세요.

__Admin 기반의 액세스 토큰을 만드는 방법__ 은 간단합니다. Strapi 어드민 패널에서 __Settings > ADMINISTRATION PANEL > Users__ 메뉴로 들어가 어드민 유저를 생성해주세요. 생성된 유저 페이지를 들어가면 URL의 마지막에 admin 유저의 id가 있습니다. 그 상태에서 터미널을 열고 strapi가 설치된 루트 경로에서 `NODE=1338 yarn strapi console`을 실행해주세요. 그리고 다음 스크립트에서 아까 전에 알아낸 adminId를 `XXX` 부분에 넣고 실행하시면 토큰이 발급됩니다.

```js
async function issueAdminToken(adminId) {
  let adminUser;
  try {
    adminUser = await strapi.query("user", "admin").findOne({ id: adminId });
  } catch (e) {
    console.log(e);
    throw e;
  }
  if (!adminUser) {
    strapi.log.error("해당 어드민 계정은 DB에 존재하지 않습니다.");
    throw new Error("해당 어드민 계정은 DB에 존재하지 않습니다.");
  }
  return strapi.admin.services.token.createJwtToken(adminUser);
}

issueAdminToken(XXX);
```

발급 받은 토큰은 외부 서비스에서 Authorization 헤더에 `Bearer xxxx...`을 넣어서 사용할 수 있습니다.

만약 발행된 토큰의 유효 기간을 수정하고 싶으시면 `./config/server.js`에서 `admin.options.expiresIn`을 원하는 기간으로 수정해주세요. (`10y`는 10년, `1m`는 1달, `1h`는 1시간) 아래는 예시입니다.

```js
module.exports = ({ env }) => ({
  ...,
  admin: {
    url: '/admin',
    autoOpen: false,
    watchIgnoreFiles: [],
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
      options: { expiresIn: '10y' },
    },
  },
});
```

# 마치며
지금까지 Strapi에 대한 소개와 장단점, 소소한 꿀팁등을 공유해보았습니다. Strapi는 2015년에 생긴 프로젝트로 현재까지 활발한 오픈소스 생태계와 높은 확장성으로 많은 개발자들에게 사랑을 받고 있는 CMS입니다. 실제 서비스에 Strapi를 1년 반정도 쓰면서 느낀 점은 정말 확장성이 높고 개발 속도가 빨라서 다양한 요구사항에 빠르게 대처할 수 있다는 점이었습니다. 복잡한 쿼리와 쿼리 튜닝이 어렵다는 점이 아쉽지만, Strapi 팀에서도 인지하고 있는 만큼 앞으로 점점 더 개선될 것이라고 보여집니다. 긴 글 읽어주셔서 감사합니다 :)