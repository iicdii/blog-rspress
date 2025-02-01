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

아래 글은 Volta와 NVM을 동시에 사용하면서 겪었던 문제와 해결 과정을 간략히 정리한 내용입니다.

Volta와 NVM을 하나의 쉘에서 자동 전환하려는 분들이 참고하면 좋습니다. 참고로 저는 Homebrew로 Volta를 설치했습니다.

# 문제

## NVM만 쓰던 환경

- 회사 프로젝트에서는 `.nvmrc` 파일을 통해 Node 버전을 자동으로 맞추고 있습니다.
- 그래서 nvm 공식 저장소에서 알려준 [스크립트](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh)를 활용해서 디렉토리를 이동할 때 `.nvmrc`를 읽어 `nvm use`를 자동 적용했습니다.

## Volta 병행 사용 필요성

- 개인 프로젝트에서는 Volta를 통해 Node/Pnpm 버전을 프로젝트에 pinning하여 사용하고 싶었습니다.
- Homebrew로 Volta를 설치했기 때문에, `volta --version` 등은 잘 동작하지만, `node`, `pnpm` 명령어를 치면 기존 NVM 버전이 먼저 잡혀서 충돌이 발생했습니다.
- Volta pin이 있는 프로젝트에서도 `node -v` 입력 시 `command not found` 오류가 뜨는 문제가 생겼습니다.

## 원인

- Volta로 설치한 node, pnpm 바이너리는 실제로 `~/.volta/bin` 디렉터리에 존재하지만, `PATH` 상에서 우선순위가 보장되지 않았습니다.
- Homebrew를 통해 설치된 volta 명령 자체는 `/opt/homebrew/bin/volta`에 있지만 Volta를 호출하기 위한 실행 파일일 뿐이고 각종 Node/Pnpm Shim 파일은 여전히 `~/.volta/bin`에 있습니다.
- NVM이 이미 `PATH` 상단에서 Node 실행 파일을 제공하니, Volta의 Shims가 제대로 인식되지 않아 `command not found: node` 문제가 발생했습니다.

> [!info] Shim이란?
> Shim은 실제 실행 파일로 연결해주는 중간 다리 역할을 하는 작은 실행 파일입니다. Volta의 경우 `node` 명령어를 입력하면, Shim이 프로젝트에 맞는 올바른 Node 버전을 자동으로 찾아 실행해줍니다.

참고로, 저는 Volta에서 현재 실험적으로 제공하는 [pnpm 지원](https://docs.volta.sh/advanced/pnpm) 옵션을 활성화해서 pnpm 버전도 프로젝트에 따라 자동으로 적용되게 했습니다. MacOS 기준으로는 `export VOLTA_FEATURE_PNPM=1`을 `~/.zshrc`(혹은 `~/.bash_profile`)에 추가하면 됩니다.

# 해결

**1. Volta와 NVM을 모두 로드하되, 디렉토리에 따라 우선순위를 달리한다**

- **Volta pin이 있는 폴더**: `package.json` 내 `"volta": {...}` 필드가 있으면, Volta를 최우선으로 설정해 node, pnpm 등이 Volta 버전을 사용하게 합니다.
- **Volta pin이 없는 폴더**: 회사 프로젝트 등에서는 기존처럼 `.nvmrc` 파일을 읽어 NVM 버전을 적용합니다.

**2. `~/.zshrc`에 자동 전환 스크립트 작성**
아래와 같은 코드를 `~/.zshrc` 맨 아래에 추가하시면, 디렉토리를 이동할 때마다 자동으로 Volta 혹은 NVM을 선택하게 됩니다. (기존 nvm에서 제공하는 [스크립트](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh)를 아래 코드로 대체했습니다.)

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

이렇게 설정하면 개인 프로젝트에선 Volta가 제공하는 버전을 쉽게 사용할 수 있고, 회사 프로젝트에선 기존 NVM(`.nvmrc`) 환경을 손대지 않고 그대로 사용할 수 있습니다.

- **장점**: 한 번 설정해 두면 디렉토리를 이동할 때마다 자동으로 전환되어 편리합니다.
- **주의**: Volta pin과 `.nvmrc`가 같이 있는 프로젝트라면 (대부분 그럴 일 없겠지만) 우선순위를 결정해야 합니다. 현재 스크립트는 Volta pin이 있으면 무조건 Volta를 우선 적용합니다.

이상으로 Volta와 NVM을 동시에 사용하는 방법을 정리해 보았습니다. 비슷한 문제로 고생하시는 분들께 도움이 되었으면 좋겠습니다.
