---
tags:
  - CLI
  - Pnpm
  - Nvm
  - Npm
  - Volta
created: 2025-01-29T00:00:00.000Z
published: true
title: nvm과 volta 동시에 사용하기
---

# nvm과 volta 동시에 사용하기

📅 2025. 01. 29

저장소마다 Node 버전과 PNPM 버전이 달라서 매번 변경해주는 거 귀찮지 않으신가요?
저는 이런 귀차니즘을 없애기 위해 nvm 공식 저장소에서 소개한 [노드 버전 자동 전환 스크립트](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh)를 활용해서 디렉토리를 이동할 때 `.nvmrc`를 읽어 노드 버전이 프로젝트에 맞게 자동으로 설정되도록 쓰고 있습니다.
다만 PNPM 버전의 경우 여전히 직접 전환을 해줘야하는 번거로움이 있어서 새 프로젝트에서는 Volta를 써봤습니다. 제 목표는 터미널을 실행했을 때 프로젝트에 설정된 Node 버전과 PNPM 버전이 자동으로 스위칭되는 환경을 만드는 것입니다.
# 문제
기존에 설치된 NVM과 Volta가 하는 일이 비슷하다보니 충돌이 발생했습니다. 분명 Volta로 pnpm 버전을 v9로 고정하고 `pnpm install`을 실행했는데 v8로 설치가 되는 등의 이슈가 있었습니다.
## 원인
NVM이 이미 Node 버전 경로(`PATH`) 설정에 대한 우선순위를 갖고 있어서, Volta의 우선순위가 밀리는 게 원인이었습니다.

참고: 저는 Volta에서 현재 실험적으로 제공하는 [pnpm 지원](https://docs.volta.sh/advanced/pnpm) 옵션을 활성화해서 pnpm 버전도 프로젝트에 따라 자동으로 적용되게 했습니다. MacOS 기준으로는 `export VOLTA_FEATURE_PNPM=1`을 `~/.zshrc`(혹은 `~/.bash_profile`)에 추가하면 됩니다.
# 해결
GPT한테 상황을 설명하니, Volta와 NVM을 자동 전환 해주는 쉘 스크립트를 작성해줬습니다.

**1. Volta와 NVM을 모두 로드하되, 디렉토리에 따라 우선순위를 달리한다**
- **Volta pin이 있는 폴더**: `package.json` 내 `"volta": {...}` 필드가 있으면, Volta를 최우선으로 설정해 node, pnpm 등이 Volta 버전을 사용하게 합니다.
- **Volta pin이 없는 폴더**: 기존처럼 `.nvmrc` 파일을 읽어 NVM 버전을 적용합니다.

**2. `~/.zshrc`에 자동 전환 스크립트 작성**
아래와 같은 코드를 `~/.zshrc` 맨 아래에 추가하면, 디렉토리를 이동할 때마다 자동으로 Volta 혹은 NVM을 선택하게 됩니다. (기존 nvm에서 제공하는  [스크립트](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh)를 아래 코드로 대체했습니다.)

```shell
# --- [시작] Volta/NVM 자동 전환 설정 ---

##
# (1) package.json 안에 "volta" 필드가 있는지 검사
##
volta_project_has_pins() {
  [[ -f package.json ]] && grep -q '"volta":' package.json
}

##
# (2) NVM을 사용 (현재 디렉토리 내 .nvmrc 버전 적용)
##
use_nvm() {
  # nvm이 아직 로드되지 않았다면 로드
  if ! type nvm &>/dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  fi

  # .nvmrc가 있으면 해당 버전으로 nvm use
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version="$(nvm version "$(cat "${nvmrc_path}")")"

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

##
# (3) Volta를 우선 사용
#     - Homebrew 경로(/opt/homebrew/bin)는 이미 PATH에 있을 수도 있지만,
#       "node", "pnpm" 등의 shim은 보통 `~/.volta/bin/`에 위치합니다.
##
use_volta() {
  # (a) ~/.volta/bin을 PATH 맨 앞에 추가 (이미 있으면 중복 추가 X)
  if [[ -d "$HOME/.volta/bin" ]]; then
    case ":$PATH:" in
      *":$HOME/.volta/bin:"*) ;;  # 이미 포함되어 있으면 패스
      *) export PATH="$HOME/.volta/bin:$PATH" ;;
    esac
  fi

  # (b) 혹시 이전에 nvm으로 잡아둔 버전이 있다면 해제(선택 사항)
  if type nvm &>/dev/null; then
    nvm deactivate &>/dev/null
  fi
}

##
# (4) 디렉토리 이동 시마다 "Volta pin" 존재 여부에 따라 Volta / NVM 적용
##
switch_volta_nvm() {
  if volta_project_has_pins; then
    # package.json 안에 "volta" 필드가 있다면 → Volta 우선
    use_volta
  else
    # 없다면 NVM(.nvmrc) 사용
    use_nvm
  fi
}

autoload -U add-zsh-hook
add-zsh-hook chpwd switch_volta_nvm

# Zsh 시작 시, 현재 디렉토리에 맞춰 1회 실행
switch_volta_nvm

# --- [끝] Volta/NVM 자동 전환 설정 ---
```


**3. 적용 후 확인**
**Volta pin된 프로젝트**
- `package.json`에 `"volta": { "node": "x.x.x", "pnpm": "x.x.x" }` 등이 명시되어 있으면, 폴더에 들어가자마자 Volta가 우선 적용됩니다.
- `node -v`, `pnpm -v` 등을 입력했을 때 pin된 버전이 정상적으로 표시됩니다.

**`.nvmrc`만 있는 프로젝트**
- 기존대로 `.nvmrc` 파일을 읽어 `nvm use`가 자동으로 적용됩니다.
# 마무리
이렇게 설정하면 내 컴퓨터에 NVM, Volta를 동시에 설치해서 사용하더라도 문제가 없으며, 저장소에 맞게 필요한 Node 버전을 자동으로 전환해서 쓸 수 있습니다.

다만, Volta pin과 `.nvmrc`를 동시에 쓰는 프로젝트의 경우 문제가 생길 수 있습니다. 따라서 하나의 프로제트에는 하나의 도구만 사용하시는 걸 추천드립니다.

이상으로 Volta와 NVM을 동시에 사용하는 방법을 정리해 보았습니다. 비슷한 문제로 고생하시는 분들께 도움이 되었으면 좋겠습니다.