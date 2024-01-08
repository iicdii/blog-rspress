---
tags:
  - Yarn
created: 2020-05-11T00:00:00.000Z
published: true
title: yarn 같은 패키지 여러 버전으로 설치하기
---

# yarn 같은 패키지 여러 버전으로 설치하기

📅 2020. 05. 11

# `yarn add <alias-package>@npm:<package>`

[공식 문서](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias)의 설명은 다음과 같다.
> This will install a package under a custom alias. Aliasing, allows multiple versions of the same dependency to be installed, each referenced via the alias-package name given. For example, `yarn add my-foo@npm:foo` will install the package `foo` (at the latest version) in your `dependencies` under the specified alias `my-foo`. Also, yarn add `my-foo@npm:foo@1.0.1` allows a specific version of `foo` to be installed.

`<alias-package>`에 설치하려는 패키지의 원하는 별칭을 넣고 `<package>`에 해당 패키지명을 넣으면 동일한 패키지를 여러 버전으로 설치할 수 있다.

ant-design 3, 4버전을 같이 써야할 상황이 생겨서 `package.json`에 다음과 같이 추가했다.

```js
"dependencies": {
    ...   
    "antd": "^3.26.16",
    "antd4": "npm:antd@latest"
}
```

`<package>`뒤에 `@<version>`을 붙여서 버전도 특정이 가능하다.

실제로 import를 할 땐 다음과 같이 불러온다.
```js
import { Button, message } from 'antd';
import { Table } from 'antd4';
```