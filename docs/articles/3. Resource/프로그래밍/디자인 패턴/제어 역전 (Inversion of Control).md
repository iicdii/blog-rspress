---
tags:
  - DesignPattern
created: 2023-03-22T00:00:00.000Z
published: true
title: 제어 역전 (Inversion of Control)
---

# 제어 역전 (Inversion of Control)

📅 2023. 03. 22

# 제어 역전?
IoC는 제어 흐름을 반전 시켜서 객체가 종속성을 관리하는 대신(직접 생성/호출하는 대신), 종속성을 외부에서 객체에 제공(일반적으로 IoC 컨테이너 또는 의존성 주입을 통해)하는 것을 의미한다. 이렇게 하면 코드가 예쁘게 분리되고 유지보수가 쉬워진다.
# 언제 쓰죠?
## 클래스 인스턴스 생성할 때
### without IoC
```js
class UserRepository {
  constructor() {
    this.database = new Database(); // UserRepository가 Database 인스턴스를 생성하고 제어한다.
  }
  
  getUser(id) {
    return this.database.findUserById(id);
  }
}

const userRepository = new UserRepository();
const user = userRepository.getUser(1);
```

### with IoC
```js
class UserRepository {
  constructor(database) {
    this.database = database; // Database 인스턴스는 외부에서 제공된다.
  }
  
  getUser(id) {
    return this.database.findUserById(id);
  }
}

const database = new Database(); // Database 인스턴스는 UserRepository 바깥에서 생성된다.
const userRepository = new UserRepository(database);
const user = userRepository.getUser(1);
```

두 번째 예시(IoC 사용)에서는 UserRepository 클래스가 더 이상 데이터베이스 인스턴스 생성 및 관리를 담당하지 않는다. 대신에 데이터베이스 인스턴스를 매개변수로 받으므로 코드가 더 모듈화되고 테스트하기 쉬워진다.
  
TypeScript와 React의 맥락에서 IoC는 `InversifyJS`와 같은 라이브러리와 함께 의존성 주입을 사용하거나 공유 상태 및 의존성을 관리하기 위한 React의 내장된 컨텍스트 API 및 후크를 사용하여 구현할 수 있다.
  
자바스크립트, 타입스크립트, 리액트 프로젝트에서 IoC를 사용하면 Java나 스프링을 사용하든 상관없이 유지보수가 용이하고 테스트가 가능하며 유연한 코드를 만들 수 있다.

## Context API 사용할 때
간단한 사용자 관리 앱에서 제어의 반전(IoC)을 구현하기 위해 React와 그 컨텍스트 API를 사용하는 실제 예시를 살펴보자. 이 앱은 사용자 데이터를 가져오는 `UserService`와 사용자 정보를 표시하는 `UserProfile` 컴포넌트가 있다.

먼저 `UserService`를 만든다.

```js
// services/UserService.js
class UserService {
  async getUser(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await response.json();
    return user;
  }
}
```

이제 React의 컨텍스트 API를 사용하여 이를 필요로 하는 컴포넌트에 사용자 서비스를 제공한다.

```js
// context/UserServiceContext.js
import { createContext } from 'react';
import UserService from '../services/UserService';

const userService = new UserService();
export const UserServiceContext = createContext(userService);
```

다음은 `UserService`를 소비하는 `UserProfile` 컴포넌트이다.

```js
// components/UserProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { UserServiceContext } from '../context/UserServiceContext';

function UserProfile({ userId }) {
  const userService = useContext(UserServiceContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await userService.getUser(userId);
      setUser(fetchedUser);
    }

    fetchUser();
  }, [userId, userService]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

마지막으로, 앱을 `UserServiceContext.Provider`로 래핑하여 필요한 컴포넌트에서 사용자 서비스를 사용할 수 있도록 한다.

```js
// App.js
import React from 'react';
import UserProfile from './components/UserProfile';
import { UserServiceContext } from './context/UserServiceContext';

function App() {
  return (
    <UserServiceContext.Provider value={new UserService()}>
      <UserProfile userId={1} />
    </UserServiceContext.Provider>
  );
}

export default App;
```

이 예시에서 `UserProfile` 컴포넌트는 `UserService`를 직접 생성하거나 관리하지 않는다. 대신, 컨텍스트 API를 사용하여 제어의 역전(IoC)을 구현한 `UserServiceContext`를 통해 `UserService` 인스턴스를 받는다. 이 접근 방식은 모듈화, 유지보수 및 테스트를 보다 효율적으로 할 수 있게 해준다.