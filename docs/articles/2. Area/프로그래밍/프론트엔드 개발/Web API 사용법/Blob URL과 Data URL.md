---
tags:
  - JavaScript
  - WebAPI
created: 2023-06-29T00:00:00.000Z
published: true
title: Blob URL과 Data URL
---

# Blob URL과 Data URL

📅 2023. 06. 29

# Blob URL
- Blob URL은 `URL.createObjectURL()` 함수를 사용하여 생성됨
- Blob URL은 일시적인 URL로, 웹 페이지에서 동적으로 생성됨
- Blob URL은 웹 브라우저의 메모리에 저장되기 때문에, 웹 페이지를 닫거나 새로 고침하면 사라짐
- Blob URL은 주로 동적으로 생성된 이미지, 사용자가 생성한 이미지 데이터 등을 표시하기 위해 사용됨
- `URL.revokeObjectURL()` 로 동적 URL을 삭제할 수 있음

# Data URL
- Data URL은 데이터 자체를 URL에 포함시키는 형태의 URL임
- Data URL은 "data:"로 시작하고, MIME 타입 및 데이터를 Base64 인코딩하여 URL에 포함.
- Data URL은 정적인 데이터를 나타내며, 웹 페이지를 새로 고치거나 닫아도 유지됨
- Data URL은 이미지 데이터를 직접 URL에 포함하는 것이기 때문에 웹 페이지를 로드할 때 데이터가 함께 전송됨
- Data URL은 작은 이미지나 CSS, HTML 코드 등을 인라인으로 포함시키는 데 사용되기도 함.
- 데이터가 크거나 많은 수의 Data URL을 사용하는 경우에는 성능 문제가 발생할 수 있음