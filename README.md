# Sixshop Assignment Nestjs

이성록
010-5801-3438

## Table Of Content
- 프로젝트 소개
    - 프로젝트 핵심 가치
    - 최종 구현 범위
    - 기술 스택
    - 폴더 구조
    - 코드 컨벤션
    - 스키마 마이그레이션 기록
- 프로젝트 시작 방법
  - Docker-compose 로컬 개발환경 구성
  - 패키지 설치
  - 환경설정 구성
  - 마이그레이션 Sync, Prisma Client 생성
  - NestJS 앱 실행 및 Swagger Document
- 엔드포인트 소개

<br /><br />

## 프로젝트 소개
### 프로젝트 핵심 가치
- 좋은 코드는 읽기 좋은 코드입니다
- 객체의 역할과 책임에 따라 폴더를 구성합니다
- 나의 시야를 다른사람과 공유하기위해 노력합니다

### 최종 구현 범위
- Admin
  - POST : /admin/auth : 관리자 가입
  - POST : /admin/auth/login : 관리자 로그인
  - GET : /admin/get-me : 관리자 정보 조회
- Store
  - POST : /store : 스토어 생성
  - GET : /store/{storeId}/custom-field : 특정 스토어에 등록된 커스텀필드 조회
  - POST : /store/{storeId}/custom-field : 특정 스토어에 커스텀필드 등록
  - DELETE : /store/{storeId}/custom-field/{customFieldId} : 특정 스토어의 커스텀필드 삭제
  - PATCH : /store/{storeId}/customer/{customerId} : 스토어에 소속된 고객의 기본정보 및 커스텀필드 수정
- Customer
  - POST : /customer/auth : 고객 가입
  - POST : /customer/auth/login : 고객 로그인
  - GET : /customer/get-me : 고객 정보 조회

### 기술 스택
- TypeScript/NestJS(Express)
- MySQL/Prisma
- Docker-compose
- Swagger-OpenAPI
- JWT

### 폴더 구조
```
.
├── environments[환경변수]
├── library[라이브러리]
│   ├── all-exception
│   ├── constant
│   ├── cookie
│   ├── crypto
│   ├── custom-field-validation (커스텀 필드 데이터 검증 메서드)
│   ├── jwt
│   ├── guard
│   ├── jwt
│   ├── passport
│   ├── prisma
│   ├── swagger
│   ├── time
│   └── uuid
├── prisma[프리즈마 스키마, 마이그레이션 히스토리]
├── src[도메인]
│   ├── aurh
│   └── customer
└── ...
```

### 코드 컨벤션
- 패키지 관리
  - 패키지 매니저는 yarn을 사용합니다
  - Package.json, lock파일에 기록된 패키지 정보는 반드시 패키지 매니저를 통해서만 액세스합니다
  - 패키지를 추가할 경우 단일 커밋으로 기록합니다
- 커밋 관리
  - [conventionalCommits](https://www.conventionalcommits.org/ko/v1.0.0-beta.4/)을 준수합니다
  - Linear History -> Squash Merge를 사용해서 커밋 히스토리를 관리합니다
- 네이밍 컨벤션
  - 폴더이름은 케밥 케이스를 준수하며 용도에따라 `.`으로 구분합니다
  - 클래스이름은 파스칼 케이스를 사용합니다
  - 메서드는 카멜케이스를 사용합니다
- ESLint
  - Airbnb Rule을 준수합니다
- Typescript
  - strict 모드를 활성화합니다
  - 각 객체간의 메시지를 주고 받을 때 반드시 typeSafe 하게 타입을 정의합니다
  - 요청, 응답에 대해서 DTO를 사용하고 알맞은 Validation 및 직렬화, 역직렬화 프로세스를 거쳐야합니다
  - Service, Repository 레이어에서는 DTO대신 객체 리터럴로 타입을 명시합니다
  - 매개변수가 2개 이상일 경우 객체 리터럴로 인자를 받습니다
  - Module-Import는 @nestjs 모듈 > 내부 정의 라이브러리 > 타입 순으로 그룹화 해서 정렬합니다
- NestJS
  - Exception에서 사전 정의되지 않은 에러(500)에 대해서 사용자에게 상세정보를 노출하지 않고 내부 로깅(모니터링)합니다
  - 예외 처리를할 때 반드시 사용자가 이해 하기 쉬운 에러 메시지를 리턴해야합니다
### 스키마 마이그레이션 기록
이 프로젝트에서는 Prisma Migrate로 데이터베이스를 마이그레이션합니다
[이곳](https://github.com/argon1025/sixshop-assignment-nestjs/tree/main/prisma)에서  
마이그레이션 히스토리를 문서로 관리합니다
<br /><br />

## 프로젝트 시작 방법
### Docker-compose 로컬 개발환경 구성
프로젝트를 시작하기 위해서는 개발 환경이 명시적으로 구성되어있는 Docker-compose를 통해서 로컬 개발환경을 시작할 수 있습니다
이 프로젝트 에서는 MySQL가 `Docker-compose`로 구성되어 있습니다
```
$ cd ./sixshop-assignment-nestjs
$ docker-compose up
```
컨테이너가 정상적으로 실행되었을 경우 다음으로 넘어갑니다
> MySQL 데이터는 프로젝트 폴더 ./docker/mysql/mysql-data에 저장됩니다

### 패키지 설치
```
$ yarn install
```

### 환경설정 구성
`environments/.local.env`에서 로컬 환경설정을 구성할 수 있습니다  
이미 구성된 파일이 있기 때문에 해당 섹션을 생략해도 무방합니다
> 실제 배포시 AUTH_COOKIE_SECURE 옵션을 반드시 활성화 해야합니다
```
# ##########################################
# App & Database
# NestJS앱, 데이터베이스 설정
# ##########################################
DATABASE_URL="mysql://root:root@localhost:3306/sixshop?connect_timeout=100&pool_timeout=100&socket_timeout=100"
SERVER_PORT=80
SALT_ROUND=10

# ##########################################
# Admin
# Admin 로그인정책 설정
# ##########################################
JWT_ADMIN_SECRET_KEY=1q2w3e4r
JWT_ADMIN_EXPIRES_IN=30m
ADMIN_COOKIE_HTTP_ONLY=true
ADMIN_COOKIE_SECURE=false
ADMIN_COOKIE_PATH=/
ADMIN_COOKIE_DOMAIN=localhost
ADMIN_COOKIE_MAX_AGE=1800000
ADMIN_COOKIE_SAME_SITE=strict

# ##########################################
# Customer
# Customer 로그인정책 설정
# ##########################################
JWT_CUSTOMER_SECRET_KEY=4r3e2w1q
JWT_CUSTOMER_EXPIRES_IN=30m
CUSTOMER_COOKIE_HTTP_ONLY=true
CUSTOMER_COOKIE_SECURE=false
CUSTOMER_COOKIE_PATH=/
CUSTOMER_COOKIE_DOMAIN=localhost
CUSTOMER_COOKIE_MAX_AGE=1800000
CUSTOMER_COOKIE_SAME_SITE=strict
```

### Prisma 마이그레이션 Sync, Prisma Client 생성
이 프로젝트에서는 Prisma로 마이그레이션을 관리합니다
```
$ yarn prisma:migrate:local
```
위 명령어를 통해 로컬환경과 마이그레이션 기록을 동기화하고 서버 애플리케이션 실행을 위한 Prisma Client 모듈이 생성됩니다

### NestJS 앱 실행
```
$ yarn start:local
$ yarn start:local:watch
$ yarn start:local:degub
```

<br /><br />

## 엔드포인트 소개
