# RIDI Select

## Requirements

- [Docker](https://www.docker.com/)
- [traefik](https://github.com/ridi/traefik/blob/master/README.md)
- [Yarn](https://yarnpkg.com/) (for development)

## Getting Started

**Set environments**

```sh
$ cp .env.example .env
```

**Serve with TLS**

> First run [traefik](https://github.com/ridi/traefik/blob/master/README.md),

```sh
$ docker-compose up [-d] [--build]
```

## Development

**IDE를 위해 로컬에 패키지를 설치합니다.** _컨테이너 내부에서는 사용되지 않습니다._

```sh
$ yarn install --frozen-lockfile
```

**패키지 의존성이 변경되면 이미지 재빌드가 필요합니다.**

```sh
$ yarn add/remove [-D] packages
$ docker-compose up --build [--force-recreate]
```

## Merge Request

**Git-flow 정책을 따릅니다.**

```sh
$ brew install git-flow-avh
$ git flow feature start branch_name
```

**Merge는 Gitlab MR 기능을 사용합니다.**
> [Merge commit with semi-linear history](https://docs.gitlab.com/ee/user/project/merge_requests/#semi-linear-history-merge-requests) 기능을 사용해 커밋 히스토리를 관리합니다.
>
> _기본 타깃 브랜치는 `develop`이므로, Hotfix 브랜치를 머지할때는 master 브랜치로 변경해서 MR을 생성합니다._

## Deployment

* `develop` 브랜치로 머지되면 개발용 호스트(https://select.ridi.io)에 자동으로 배포됩니다.


* `master` 브랜치는 프로덕션 환경(https://select.ridibooks.com)에 PRE-RELEASE 상태로 배포됩니다.
  > Hotfix 브랜치를 `master` 브랜치에 머지했다면 해당 브랜치를 `develop` 브랜치에도 머지해주세요.
  >
  > semi-linear history 규칙에 의해 Gitlab MR을 이용하기 어렵습니다.

* PRE-RELEASE를 완료하고 프로덕션에 배포하려면, Gitlab environments 에서 `Manual Job`으로 실행할 수 있습니다.
  > 롤백시, production environment에서 롤백 버튼을 이용합니다.
