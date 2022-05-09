# Prisma Migration History

## `20220503164024_init`

`PR Link` : [Prisma 스키마 마이그레이션, 서비스 #11](https://github.com/argon1025/sixshop-assignment-nestjs/pull/11)

### 작업내역

- 데이터베이스를 초기 구성하면서 생성되었습니다.

## `20220504055714_admin_set_unique_email_column`

`PR Link` : [관리자 등록, 로그인 #15](https://github.com/argon1025/sixshop-assignment-nestjs/pull/15)

### 작업내역

- 관리자 Email을 유니크 컬럼으로 지정했습니다

## `20220506100449_customer_set_unique_email_column`

`PR Link` : [고객 가입 #23](https://github.com/argon1025/sixshop-assignment-nestjs/pull/23)

### 작업내역

- 고객 Email을 유니크 컬럼으로 지정했습니다

## `20220507083733_customField_add_name_column`

`PR Link` : [커스텀필드 생성, 조회 개선 #27](https://github.com/argon1025/sixshop-assignment-nestjs/pull/27)

### 작업내역

- 커스텀필드에 name 컬럼을 추가했습니다

## `20220508061324_customField_add_onlyAdmin_column`

`PR Link` : [유저 정보 커스텀필드 관리 #36](https://github.com/argon1025/sixshop-assignment-nestjs/pull/36)

### 작업내역

- 커스텀필드에 onlyAdmin 컬럼을 추가했습니다

## `20220508080102_customerCustomField_set_unique`

`PR Link` : [유저 정보 커스텀필드 관리 #36](https://github.com/argon1025/sixshop-assignment-nestjs/pull/36)

### 작업내역

- CustomerCustomField [CustomFieldId, Customer] 컬럼을 함께유니크로 설정했습니다

## `20220509091347_product_order_set_price_int`

`PR Link` : [주문 생성 #41](https://github.com/argon1025/sixshop-assignment-nestjs/pull/41)

### 작업내역

- price 컬럼을 String->Int로 변경했습니다
