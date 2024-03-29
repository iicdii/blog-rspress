---
tags:
  - Git
created: 2023-03-17T00:00:00.000Z
published: true
title: Git Commit Message Conventions
---

# Git Commit Message Conventions

📅 2023. 03. 17

팀 내 커밋 컨벤션을 수립하기 위해 아래와 같은 컨벤션을 제안하고 슬랙으로 투표를 받았다.

1.  `B마트 사전예약 전용 주문 대응 - "제목"`
2. `feat: B마트 사전예약 전용 주문 대응 - "유형: 제목"`
3. `[COMMWEBFNT-1276] B마트 사전예약 전용 주문 대응 - "[이슈번호] 제목"`
4. `feat: [COMMWEBFNT-1276] B마트 사전예약 전용 주문 대응 - "유형: [이슈번호] 제목"`
5. `[COMMWEBFNT-1276] feat: B마트 사전예약 전용 주문 대응 - "[이슈번호] 유형: 제목"`
6. 기타 의견

투표 결과, 3번이 압도적인 표차로 선택되었다.

| 1번 | 2번 | 3번 | 4번 | 5번   | 6번    |
| --- | --- | --- | --- | --- | --- |
| 0표    | 0표    | 8표    | 3표    | 0표    | 0표    |

나도 3번을 선택했고 내가 제시한 의견은 다음과 같았다.
> 커밋 유형(feat:, chore:... )붙이는거 좋아하지만 이슈 번호까지 붙이면 너무 **제목길이를 많이 차지**해서 제목 길이가 부족할 때가 생기고, 왠만하면 **대부분의 커밋이** `**feat:**` 이여서 조금 의미가 없는거 같기도 합니다.

회사에서 지라를 사용한다면 지라 이슈 번호를 커밋 제목에 넣는 것이 히스토리 추적에 큰 도움이 된다. 여기에 [Conventional Commits](https://www.conventionalcommits.org/)를 사용할 수도 있지만, 제목의 길이가 너무 길어지면 커밋 글자 제한에 걸리기 때문에 생략하는 게 나을수도 있다.

Jira를 사용하지 않는 경우, [Conventional Commits](https://www.conventionalcommits.org/) 사이트의 규칙을 팀 내 규칙으로 정의하면 좋다.

[Gitmoji](https://github.com/carloscuesta/gitmoji)도 옵션으로 고려해볼 수 있다. 커밋 메시지에 이모티콘을 사용하면 사용된 이모티콘만 보고도 커밋의 목적이나 의도를 쉽게 파악할 수 있다. [Gitmoji](https://github.com/carloscuesta/gitmoji)는 이모티콘의 선택지가 다양해서 생기는 어려움을 해결하기 위해 이모티콘을 더 쉽게 사용할 수 있는 가이드를 제공해준다.

팀 동료가 [Gitmoji](https://github.com/carloscuesta/gitmoji)를 써보고 싶다는 의견을 제안해서, [Gitmoji](https://github.com/carloscuesta/gitmoji)의 장단점을 정리해보았다.

**Gitmoji 장점**  
-   커밋 로그를 시각적으로 확인하기 좋음
-   재미있음

**단점**  
-   이모지 구별이 어려울 수 있음
-   GUI(GitKraken, Github Desktop, ...)에서 쓰기 번거로움
-   이슈번호, 커밋 유형 등과 같이 쓰면 제목에 쓸 글자수가 부족할 수 있음

**정보**  
`:smile:`, 😊 두 가지 방식이 있는데 전자는 깃허브에서만 이모지로 보이고 후자는 플랫폼 상관없이 이모지로 표시된다고 합니다. 전자의 경우 크로스 플랫폼 호환성 100%이지만 후자의 경우 일부 환경에서 글자가 깨질 수 있습니다.gitmoji CLI나 VSCode Extension으로 이모지를 편리하게 고를 수 있습니다. GUI 쓰시는 분들은 Gitmoji 홈페이지에 들어가서 원하는 이모지를 찾아서 사용하면 됩니다.

내가 [Gitmoji](https://github.com/carloscuesta/gitmoji)를 선택하지 않은 이유는 번거로움, 그리고 GUI에서 커맨드 라인 사용의 어려움 때문이었다. [Gitmoji](https://github.com/carloscuesta/gitmoji)에서 제공하는 CLI를 사용하면 타입에 따라 이모지 선택을 쉽게 할 수 있지만, Gitkraken 사용자로서 이 옵션을 사용할 수 없다는 것은 굉장히 치명적이었다. 커밋을 하기 위해서 사이트를 열어 이모지를 탐색하고, 복사하고 제목에 붙여넣는 과정을 수행하는 작업은 생산성에 부정적인 영향을 가져올 게 분명했다.

따라서, 결과적으로 우리 팀은 **지라 이슈 번호와 커밋에 대한 설명을 제목에 넣는 것을 규칙으로 정했다.**