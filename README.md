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
- Swagger-openAPI
  - /api : API Document
- Admin
  - POST : /admin/auth : 관리자 가입
  - POST : /admin/auth/login : 관리자 로그인
  - GET : /admin/get-me : 관리자 정보 조회
- Store
  - POST : /store : 스토어 생성
  - GET : /store/{storeId}/custom-field : 특정 스토어에 등록된 커스텀필드 조회
  - POST : /store/{storeId}/custom-field : 특정 스토어에 커스텀필드 등록
  - PATCH : /store/{storeId}/custom-field : 스토어에 등록된 커스텀 옵션을 수정합니다
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
이 섹션에서는 프로젝트 시작 방법에 대해서 설명합니다

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
이 섹션에서는 엔드포인트에 대해서 설명합니다

### Swagger
해당 프로젝트에서는 Swagger-OpenAPI로 Document를 작성했습니다
`localhost/api`에서 모든 API 문서를 참조하실 수 있습니다

#### POST : /admin/auth : 관리자 가입
![image](https://user-images.githubusercontent.com/55491354/167343052-e736a77b-9420-4321-80e8-2db52d5e1d86.png)

관리자 계정을 생성합니다  
관리자는 스토어를 생성하고 관리할 수 있습니다  

#### POST : /admin/auth/login : 관리자 로그인
![image](https://user-images.githubusercontent.com/55491354/167344486-4ee4ac78-5829-4f7e-ae0a-ee2ff9e3c556.png)

관리자로 로그인합니다  
로그인 시 JWT토큰을 HTTPOnly Cookie로 발급합니다


#### GET : /admin/get-me : 관리자 정보 조회
![image](https://user-images.githubusercontent.com/55491354/167344651-4a5367b3-8fde-471e-a612-6d3caf50e7bd.png)

로그인된 관리자 정보를 조회합니다

<br />

#### POST : /store : 스토어 생성
![image](https://user-images.githubusercontent.com/55491354/167344912-12912f14-31d4-4921-b678-4a1dd2954226.png)

관리자 계정으로 스토어를 생성합니다

<br />

#### POST : /store/{storeId}/custom-field : 특정 스토어에 커스텀필드 등록
![image](https://user-images.githubusercontent.com/55491354/167346184-e0afad8c-71d9-4f94-b976-3d56667fc941.png)

커스텀필드를 생성합니다 커스텀필드 기능의 목표와, 유효성검사 로직은 다음과 같습니다

`커스텀필드 목표`
- 스토어별로 다른 커스텀 필드를 적용할 수 있습니다
- 고객 가입, 물건 등록, 주문에 대해서 각각 다른 커스텀 필드를 적용할 수 있습니다
- 다양한 타입을 선택할 수 있습니다 (String, Number, Boolean)
- 커스텀 필드의 별칭을 지정할 수 있습니다
- 해당 커스텀필드가 Require 지정할 경우 반드시 입력해야합니다
- 관리자만 수정이 가능한 커스텀필드(onlyAdmin)을 정의할 수 있습니다 onlyAdmin, Require가 동시에 활성화된 경우엔 관리자 권한으로 요청할 때에만 해당 정보를 요구합니다
- 여러개의 원소를 가질 수 있는 배열옵션(isArray)을 가질 수 있습니다
- 커스텀필드에서 열거형(enumData)을 정의할 수 있습니다
- 기본데이터(defaultData)를 정의할 수 있습니다

`커스텀필드 유효성검사 순서`
![image](https://user-images.githubusercontent.com/55491354/167347081-972ff3ef-2327-4bf8-8001-de465c84882b.png)

<br />

#### GET : /store/{storeId}/custom-field : 특정 스토어에 등록된 커스텀필드 조회
![image](https://user-images.githubusercontent.com/55491354/167347811-51c7cdba-5bb5-40e7-b10d-d8f73c3fef2c.png)

특정 스토어의 커스텀필드를 조회합니다

<br />

### PATCH : /store/{storeId}/custom-field : 스토어에 등록된 커스텀필드를 수정합니다
커스텀필드를 수정합니다

`커스텀필드 수정 유효성검사 로직`
![image](https://user-images.githubusercontent.com/55491354/167352544-d38ec898-45ae-4232-ac7d-bcc2dc5ebcfc.png)


`수정 제약사항 및 이유`
- origin (적용범위 가입 | 물건 등록 | 주문) -> `불가` : 기존에 생성된 커스텀 필드와 무결성이 깨집니다
- name (커스텀필드 별칭) -> `가능`
- EnumData (열거형 옵션) ->  `추가만 가능` : default 및 기존 생성 데이터와 무결성이 깨집니다
- defaultData (기본값) -> `가능`
- require (필수여부) -> `불가` : 기존에 생성된 커스텀 필드와 데이터 정합성이 깨집니다
- fieldType (커스텀필드 타입) -> `불가` : EnumData, DefaultData, 기존데이터 모두 무결성이 깨집니다
- isArray (여러 원소 허용여부) ->  `불가` : EnumData, DefaultData, 기존데이터 모두 무결성이 깨집니다

<br />

#### DELETE : /store/{storeId}/custom-field/{customFieldId} : 특정 스토어의 커스텀필드 삭제
![image](https://user-images.githubusercontent.com/55491354/167348371-c4c45552-78ab-4d48-8e3c-af16a692f2d9.png)

스토어에서 관리하고있는 커스텀필드를 삭제합니다

<br />

#### PATCH : /store/{storeId}/customer/{customerId} : 스토어에 소속된 고객의 기본정보 및  커스텀필드 수정
![image](https://user-images.githubusercontent.com/55491354/167350626-abc31af7-2a30-4e28-a0fc-ce5c3241b1f0.png)

`고객정보 수정 커스텀필드 유효성검사 순서`
![image](https://user-images.githubusercontent.com/55491354/167351632-71eb07c0-0ea8-473d-a45d-afd1f0946ae2.png)


스토어 관리자 권한으로 소속된 고객의 정보 및 커스텀 필드를 수정합니다


#### POST : /customer/auth : 고객 가입
![image](https://user-images.githubusercontent.com/55491354/167353092-2c5694dd-21a4-4359-802c-363da373b8b2.png)

특정 스토어에 고객을 가입시킵니다
고객인 스토어에서 정의한 커스텀필드를 입력해 가입할 수 있습니다

#### POST : /customer/auth/login : 고객 로그인

고객의 정보로 로그인합니다
어드민 로그인과 동일한 로직입니다.

#### GET : /customer/get-me : 고객 정보 조회

현재 로그인된 유저의 정보 및 등록된 커스텀필드를 모두 로드합니다
