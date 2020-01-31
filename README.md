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

**Release-flow 정책을 따릅니다.**

**Merge는 Github PR 기능을 사용합니다.**
> _기본 타깃 브랜치는 `master`입니다._

## Deployment

* `master` 브랜치로 머지되면 개발용 호스트([https://select.ridi.io](https://select.ridi.io)), 그리고 PRE-RELEASE환경에 자동으로 배포됩니다.
> _reviewer 모두가 approve를 하게 되면 자동으로 머지 후 배포가 진행됩니다._

* `release` 브랜치로 머지되면 프로덕션 환경([https://select.ridibooks.com](https://select.ridibooks.com))에 배포됩니다.


---
## Serverless

serverless 디렉토리에서 별도로 관리합니다.
배포는 Circle-ci 에서 Approval job 으로 실행할 수 있습니다.

### test
```sh
$ yarn serverless invoke local -f server -d '{"httpMethod": "GET", "path": "/"}'
```
