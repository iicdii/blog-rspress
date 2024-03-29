---
tags: null
created: 2021-11-01T00:00:00.000Z
published: true
title: ORM vs ODM
---

# ORM vs ODM

📅 2021. 11. 01

# ORM
Object Relation Mapping
- MySQL, MariaDB 등 관계형 DB에서 사용
- [sequelize](https://sequelize.org/ "sequlize"), [bookshelf.js](https://bookshelfjs.org/ "bookshelf"), [Django database](https://docs.djangoproject.com/en/3.2/ref/databases/ "Django database")

# ODM
Object Document Mapper
- MongoDB, Redis 등 NoSQL DB에서 사용
- [mongoose](https://mongoosejs.com/ "mongoose")

ORM은 관계형 DB에서 쓰고, ODM은 비관계형 DB에서 쓰는 차이가 있다. ORM/ODM을 썼을 때 얻을 수 있는 장점과 단점은 다음과 같다.

## 장점
### 백엔드에서 쓰는 언어를 그대로 사용할 수 있다.
파이썬 웹프레임워크인 Django는 내장된 ORM을 통해 Python으로 SQL문 없이 CRUD 오퍼레이션 수행이 가능하다. Node.js에선 sequelize를 설치해서 JavaScript로 DB를 조작할 수 있다.

### 모델을 코드로 볼 수 있다.
모델에 대한 정의를 백엔드 단에서 코드로 작성하기 때문에 DB에 직접 접근해서 모델을 일일이 확인할 필요가 없다.

### 코드 길이가 짧아진다.
```js
const mysql = require("mysql");

// ... mysql connection 생성

connection.query(createUserTable, function (error, result) {
  // Inserting User in Users table using SQL query
  const sql =
  "INSERT INTO Users (username, password) VALUES ('username', 'admin')";
  const user = conn.query(sql, function (error, result) {
    console.log('user', result);
  });
});
...
```

위는 순수한 mysql 자바스크립트 클라이언트 패키지를 사용해서 구현한 코드이다. `sql`을 보면 알 수 있듯이 생쿼리를 직접 타이핑해야 한다. 쿼리문이 복잡해질수록 가독성의 압박은 더욱 심해진다.

```js
const Sequelize = require("sequelize");
const User = require("models/User");

// ... mysql connection 생성

const user = await User.create({ username: 'me', password: 'admin' });
```

반면 `sequelize`를 통해 구현한 코드는 짧고 간결해 보인다.

## 단점
### 구현된 기능만 쓸 수 있다.
구현되지 않은 스펙은 지원해주지 않으면 쓸 수 없다. sequelize나 mongoose 같이 유지보수와 업데이트가 잘 되는 유명한 라이브러리에선 사실 못느껴봤다. 자체 ORM을 구현한 Headless CMS를 썼을 때 복잡한 쿼리를 사용할 수 없거나, 데이터베이스 인덱스 기능이 빠져있는 등 문제를 겪은 적이 있었다. PR을 날려서 추가하면 되지 않냐고 반문할 수도 있지만 데이터베이스에 관련된 부분은 코어한 부분이기 때문에 많은 시간과 노력이 필요하다.

### 문법을 배워야 한다.
`INSERT INTO ...` 대신에 `Model.create()`를 써야한다는 걸 문서와 예제를 보고 새로 배워야 한다. 역시 세상에 공짜는 없다.

# 결론
- ORM은 관계형 DB에서 쓴다.
- ODM은 비관계형 DB에서 쓴다.
- ORM이나 ODM이나 백엔드에서 DB 쉽게 접근하려는 목적은 똑같다.
- 백엔드에서 쓰던 언어 그대로 쓸 수 있다.
- 쿼리문 직접 안짜도 되서 편하다. 근데 문서 보면서 API 공부해야 한다.