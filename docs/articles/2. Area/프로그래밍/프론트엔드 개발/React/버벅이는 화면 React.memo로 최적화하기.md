---
tags:
  - React
  - Performance
  - NextJS
  - TypeScript
  - JavaScript
created: 2022-03-11T00:00:00.000Z
published: true
title: 버벅이는 화면 React.memo로 최적화하기
---

# 버벅이는 화면 React.memo로 최적화하기

📅 2022. 03. 11

# 서론
React는 기본적으로 사용자가 빠른 UI를 경험할 수 있도록 최적화되어 있습니다. 하지만 앱의 규모가 커져가면서 속도가 느려지는 순간이 찾아옵니다.

사용자에게 가장 빠른 UI를 제공하는 건 프론트엔드 개발자의 중요한 덕목 중 하나라고 볼 수 있습니다. 

> "지출 결의서를 쓰는데 화면이 버벅여요" "렉이 너무 심해요"

어느 날 작성 폼에서 화면에 렉이 걸린다는 구성원분들의 제보를 받았습니다. 실제로 테스트를 해보니 테이블에 행을 추가할수록 값을 변경할 때 렌더링 시간이 길어졌습니다.

React Dev Tools의 Profiler를 이용해서 살펴본 결과 테이블 안의 모든 컴포넌트가 한 글자 입력할 때마다 매번 렌더링 되고 있었습니다. 결과적으로 `React.memo`를 사용해서 렌더링 시간을 `1/5`로 줄일 수 있었습니다.

React 성능 최적화 API 중 하나인 `React.memo`를 알아보고 실제 상황을 재현한 프로젝트를 통해 최적화를 어떻게 진행했는지 살펴 보도록 하겠습니다.
# React.memo?
`React.memo`는 HOC입니다. 대상 컴포넌트를 한 번 감싸서 `props` 변경이 없으면 리렌더링을 방지합니다.

아래는 [React 레파지토리](https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactMemo.js#L12-L15 "React memo function from repo")에서 가져온 `memo` API의 소스 코드입니다.

```js
export function memo<Props>(
  type: React$ElementType,
  compare?: (oldProps: Props, newProps: Props) => boolean,
) {
```

첫 번째 인자는 컴포넌트를 받고, 두 번째 인자는 선택적으로 props를 비교할 함수를 받습니다. 두 번째 인자에 `?`가 붙은 걸 보니 선택적으로 비교 로직을 짤 수 있는 것 같아 보입니다.

컴포넌트 코드 예시를 보면서 실제로 어떻게 쓰이는지 알아보도록 하겠습니다. 아래는 상품의 가격을 표시해 주는 단순한 컴포넌트입니다.

```js
function DisplayPrice({ price }) {
  return (
    <div>{price}</div>
  );
}

DisplayPrice.propTypes = { price: PropTypes.number };

export default React.memo(DisplayPrice);
```

`React.memo`에 의해 감싸진 컴포넌트는 기본적으로 props의 변경이 없다면 리렌더링이 일어나지 않게 됩니다. 즉, `price` 값이 변하지 않는 한 이 컴포넌트는 가만히 있게 됩니다.

`React.memo`로 대상 컴포넌트를 감싸면 얕은 비교를 통해 최적화가 이루어집니다. 다만 기본 로직에 의한 최적화는 `primitive` 값 비교는 잘하지만 `object`, `array`, `function` 타입의 props는 항상 `areEqual? => false`가 되기 때문에 매번 리렌더링이 일어납니다. `'==='` 동치 비교를 떠올리면 이해가 쉽습니다.

당장 개발자 도구를 열어서 아래 구문을 실행해 봅시다.

```js
{ key: 'value' } === { key: 'value' } // false
```

여기서 아까 소스코드에서 봤던 `compare?: (oldProps: Props, newProps: Props) => boolean` 함수의 용도를 예상해 볼 수 있습니다. 복잡한 object props 비교는 개발자가 어떻게 구현하느냐에 달려있습니다.

이론에 대한 설명은 여기까지 하고, 실제 예제를 통해 Memo를 썼을 때와 안 썼을 때 성능 차이가 얼마나 알아보겠습니다.
# 문제의 상황 재현하기

화면이 버벅였던 상황을 최대한 비슷하게 재현하기 위해 원본 프로젝트와 같은 Nextjs + Ant Design + Formik 기술 스택을 사용해서 구현하였습니다. 완성된 코드는 [Full example Github Link](https://github.com/iicdii/nextjs-lab/tree/main/01-react-memo "Full example Github Link")에서 확인하실 수 있습니다.

완성된 화면은 다음과 같습니다.

![](https://i.imgur.com/RBlRDx4.png)


`/` 페이지는 문제가 발생한 컴포넌트로 구성이 되있으며, `/memoized` 페이지는 `React.memo`를 사용해서 최적화된 컴포넌트로 구성이 되있습니다.

아래는 최적화 전 페이지에서 총액 데이터를 입력한 영상입니다.

<video src="https://videos.ctfassets.net/aygsdsdi1qnw/5uvJuXwW0i8VICZFzURUM/5889ffddc49ee0a60559ae410fe50718/normal.mov" controls="controls" muted="muted" style="width:480px;max-height:640px;"></video>

영상을 보면 input에 값을 입력할 때 지연 시간이 있는 걸 확인할 수 있습니다. 

![](https://i.imgur.com/B32Izh6.png)

React Dev Tools를 통해 프로파일링을 해보면 1개의 Cell이 변경되었을 때 Table의 다른 나머지 Cell들도 다같이 리렌더링이 되는걸 확인할 수 있습니다. 이 부분을 `React.memo`를 사용해서 변경된 Cell만 리렌더링이 되도록 수정해 보겠습니다.

예제 프로젝트의 컴포넌트 계층 구조를 그려보면 아래와 같습니다.

```
<ProductVoucherForm> -- Formik
  <ProductTable> -- Antd Table
    <FormInput>
      <BasicField>
        <Input /> -- Antd Input
      </BasicField>
    </FormInput>
  </ProductTable>
</ProductVoucherForm>
```

`<ProductVoucherForm />` 컴포넌트 부터 아래로 차근차근 내려가면서 memo를 적용할 수 있는 부분을 찾아보도록 하겠습니다.

아래는 계층 구조 기준 가장 상위 컴포넌트인 `<ProductVoucherForm />` 코드입니다.

```tsx
// path: optimization/components/ProductVoucherForm.tsx

import { Formik, Form, FormikValues, FormikProps } from 'formik';
import * as yup from 'yup';
import { ProductVoucher } from 'types';
import { Button, Space } from 'antd';
import ProductTable from 'components/ProductTable';
import FormInput from 'components/FormInput';

const initialValues: ProductVoucher = {
  title: '',
  products: new Array(50).fill({}).map((n, index) => ({
    name: `name-${index}`,
    uid: `${index}`,
    amount: 0,
    vat: 0,
  })),
};

const schema = yup.object({
  title: yup.string().required(),
  products: yup.array(
    yup.object({
      name: yup.string(),
      uid: yup.string(),
      amount: yup.number(),
      vat: yup.number(),
    }).required(),
  ).required().min(1),
});

function ProductVoucherForm() {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        alert('submit');
      }}
    >
      {(formik: FormikProps<FormikValues>) => {
        const { values, isSubmitting, } = formik;

        return (
          <Form className="ant-form ant-form-horizontal">
            <Space direction="vertical">
              <FormInput
                name="title"
                label="제목"
                type="string"
                required={true}
              />
              <ProductTable
                prefix="products"
                products={values.products}
              />
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                저장
              </Button>
            </Space>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ProductVoucherForm;
```

`initialValues`는 Formik의 초기 데이터 상태를 정의합니다. 퍼포먼스 테스트를 위해 초기값으로 50개의 `products` 배열을 생성하는 코드를 작성했습니다. `products` 값은 `<ProductTable />`의 prop으로 전달되서 각 로우의 셀을 렌더링 하는데 사용됩니다.

```tsx
const initialValues: ProductVoucher = {
  title: '',
  products: new Array(50).fill({}).map((n, index) => ({
    name: `name-${index}`,
    uid: `${index}`,
    amount: 0,
    vat: 0,
  })),
};
```

초기화 된 값은 `<ProductTable />`의 `products` prop으로 전달됩니다.

```tsx
              <ProductTable
                prefix="products"
                products={values.products}
              />
```

아래는 `<ProductTable />` 컴포넌트 코드입니다.

```tsx
// path: optimization/components/ProductTable.tsx

import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Product } from 'types';
import FormInput from 'components/FormInput';

interface ProductsProps {
  prefix: string;
  products: Product[];
}

function ProductTable({
  prefix,
  products,
}: ProductsProps) {
  const columns: ColumnsType<Product> = [
    {
      title: '제품명',
      dataIndex: 'name',
      key: 'name',
      render: (value, record, index) => (
        <FormInput
          name={`${prefix}[${index}].name`}
          type="string"
          required={true}
        />
      )
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      render: (value) => value
    },
    {
      title: '총액',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record, index) => (
        <FormInput
          name={`${prefix}[${index}].amount`}
          type="number"
          required={true}
        />
      )
    },
    {
      title: '부가세',
      dataIndex: 'vat',
      key: 'vat',
      render: (value, record, index) => (
        <FormInput
          name={`${prefix}[${index}].vat`}
          type="number"
          required={true}
        />
      )
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="uid"
      pagination={false}
    />
  );
}

export default ProductTable;
```

`<ProductTable />`의 props를 보면 원시값 `prefix`와 복잡한 오브젝트 `products`를 갖고 있습니다. 배열을 prop으로 가진 경우 memo를 써도 성능 개선이 어렵기 때문에 아랫단의 컴포넌트에서 최적화 구간을 찾아보도록 합시다.

`<FormInput />`은 `type` 속성에 따라 일반 input 혹은 숫자 입력 input을 렌더링 하는 HOC 컴포넌트입니다.

```tsx
// path: optimization/components/FormInput.tsx

import { Field, getIn } from 'formik';
import { FieldProps } from 'formik/dist/Field';
import BasicField from 'components/BasicField';
import { Input, InputNumber } from 'antd';

interface FormInputProps {
  name: string;
  label?: string;
  type: 'string' | 'number';
  required: boolean;
}

function FormInput({ name, label, type, required = false, }: FormInputProps) {
  return (
    <Field name={name}>
      {({field, form}: FieldProps) => {
        const { errors, touched, values, setFieldValue, setFieldTouched } = form;

        return (
          <BasicField
            name={field.name}
            label={label}
            required={required}
            error={getIn(errors, name, '')}
            touched={getIn(touched, name, false)}
          >
            {(() => {
              switch (type) {
                case 'string':
                  return (
                    <Input
                      value={getIn(values, name, '')}
                      onChange={e => setFieldValue(name, e.target.value)}
                      onBlur={() => setFieldTouched(name, true)}
                    />
                  );
                case 'number':
                  return (
                    <InputNumber
                      value={getIn(values, name, 0)}
                      onChange={value => setFieldValue(name, value)}
                      onBlur={() => setFieldTouched(name, true)}
                    />
                  );
                default:
                  return <div />;
              }
            })()}
          </BasicField>
        );
      }}
    </Field>
  );
}

export default FormInput;
```

`<Input />`이 있는 제일 아랫단까지 내려왔습니다. 결론적으로 말씀드리면 `<Field />` 혹은 `<BasicField />`를 memo하면 불필요한 렌더링을 방지할 수 있습니다. `<FormInput />` 컴포넌트를 memo하면 되는 거 아닌가? 라고 생각하실 수도 있을텐데, `<Field />` 컴포넌트의 `useContext` 로직이 props 변경과 상관없이 항상 리렌더링을 유발하기 때문에 성능 개선의 효과를 기대하긴 어렵습니다.

리렌더링을 유발하는 hook에 대한 내용은 React 공식 문서에서 확인하실 수 있습니다.

> React.memo only checks for prop changes. If your function component wrapped in `React.memo` has a `useState`, `useReducer` or `useContext` Hook in its implementation, it will still rerender when state or context change.

`<Field />` 컴포넌트는 memo가 가능할까요? `<FastField />` 컴포넌트를 사용하면 가능합니다. 하지만 "다른 필드로부터 독립적"이어야 한다는 조건이 있습니다.

Formik은 memo가 적용된 `FastField`라는 컴포넌트를 제공합니다. 공식 문서에서 다음과 같이 설명하고 있습니다.

> `'<FastField />'` is meant for performance optimization. However, you really do not need to use it until you do.
> If a <Field /> is "independent" of all other <Field />'s in your form, then you can use <FastField />.

> For example, `'<FastField name="firstName" />'` will only re-render when there are:
> - Changes to `values.firstName`, `errors.firstName`, `touched.firstName`,  or `isSubmitting`. This is determined by shallow comparison. Note: > dotpaths are supported.
> - A prop is added/removed to the `<FastField name="firstName" />`
> - The `name` prop changes

저자는 `<Field />` 컴포넌트가 모든 다른 필드로부터 독립적일 때 사용할 수 있다고 명시했습니다. 예를 들어 `amount`, `vat`가 있을 때 `amount`를 입력하면 `vat`가 `amount`의 10%로 자동 입력되는 상황을 떠올려 봅시다. 이때 `vat` 필드는 `amount`에 종속성이 생긴다고 볼 수 있습니다.

 제가 진행했던 프로젝트는 이런 요구사항들이 굉장히 많아서 `<FastField />` 사용은 불가능했습니다. 그럼 더 아랫단 컴포넌트로 내려가서 최적화가 가능할지 살펴봐야겠네요. 

아래는 `<Field />`의 하위 컴포넌트인 `<BasicField />` 컴포넌트입니다. 여기서 최적화가 가능할지 한 번 보도록 하겠습니다.

```tsx
// path: optimization/components/BasicField.tsx

import React from 'react';
import { Form } from 'antd';

interface BasicFieldProps {
  label?: string;
  name: string;
  required?: boolean;
  error?: any;
  touched?: boolean;
  style?: object;
  labelCol?: object;
  wrapperCol?: object;
  children: React.ReactElement;
}

function BasicField({
  label,
  name,
  required = false,
  error,
  touched = false,
  style,
  labelCol,
  wrapperCol,
  children,
}: BasicFieldProps) {
  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      hasFeedback={!!error}
      validateStatus={(error && touched && 'error') || ''}
      help={touched && error}
      {...(labelCol && { labelCol })}
      {...(wrapperCol && { wrapperCol })}
      {...(style && { style })}
    >
      <>
        {React.cloneElement(children, {
          id: name,
        })}
      </>
    </Form.Item>
  );
}

export default BasicField;
```

`<BasicField />` 컴포넌트는 Ant Design의 `<Form.Item />`으로 `children`을 감싸주는 HOC 컴포넌트입니다. `useState`, `useContext`, `useReducer` 등 강제 리렌더링을 유발하는 요소들이 없으니 안심하고 `React.memo`를 써볼 수 있을 것 같습니다.

아래는 memo를 적용해서 새로 작성한 `<MemoizedBasicField />` 코드입니다.

```tsx
// path: optimization/components/MemoizedBasicField.tsx
import React from 'react';
import { Form } from 'antd';
import { getIn } from 'formik';
import isEqual from 'react-fast-compare';

function MemoizedBasicField({
  // <BasicField /> 컴포넌트와 동일
});

export default React.memo(
  MemoizedBasicField,
  (prevProps, nextProps) => {
    const name = nextProps.name || prevProps.name;
    const prevError = getIn(prevProps.error, name);
    const nextError = getIn(nextProps.error, name);

    if (prevError !== nextError) return false;

    const prevTouched = getIn(prevProps.touched, name);
    const nextTouched = getIn(nextProps.touched, name);

    if (prevTouched !== nextTouched) return false;

    // check diff primitive props
    ['label', 'name', 'required'].forEach(key => {
      const prevProp = getIn(prevProps, key);
      const nextProp = getIn(nextProps, key);

      if (prevProp !== nextProp) return false;
    });

    // check diff object props
    ['style', 'labelCol', 'wrapperCol'].forEach(key => {
      const prevProp = getIn(prevProps, key);
      const nextProp = getIn(nextProps, key);

      if (!isEqual(prevProp, nextProp)) return false;
    });

    return true;
  }
);
```

로직을 정리하면 순서대로 `error`, `touched`, 원시값 비교, 오브젝트 값 비교를 하고 변경된 게 없으면 `areEqual? => true`를 반환합니다.

`error`, `touched` 오브젝트는 각각 해당 필드에 에러가 있는지, 사용자의 상호작용이 있었는지를 `key-value`로 저장합니다. `Formik`의 `getIn` 함수를 이용하면 `a[0].b.c`와 같은 형식으로 쉽게 `value`에 접근할 수 있습니다.

만약 `error`, `touched`에 변화가 없었다면 원시값 props들을 비교해 봅니다. 원시값은 단순하게 `'==='`로 빠른 비교가 가능하므로 오브젝트 비교보다 먼저 하는 것이 좋습니다. 만약 비교 결과가 같다면 [react-fast-compare](https://github.com/FormidableLabs/react-fast-compare "react-fast-compare github") 라이브러리를 사용해서 오브젝트를 비교합니다.

[react-fast-compare](https://github.com/FormidableLabs/react-fast-compare "react-fast-compare github")는 깊은 비교를 빠르게 해주는 라이브러리입니다. 

![React Fast Compare Benchmark](https://raw.githubusercontent.com/FormidableLabs/react-fast-compare/master/assets/benchmarking.png)

벤치마크 결과를 보면 `react-fast-compare`가 `lodash/isEqual`보다 약 4배 이상 빠른 속도를 보여줍니다. 만약 오브젝트의 구조를 다 알고 있고 유지 보수가 가능하다면 직접 비교 로직을 최적화해보는 것도 좋습니다. 저는 `react-fast-compare`의 성능으로 이미 충분한 퍼포먼스 개선 효과를 보았고 비교 로직에 대한 개발 공수를 줄이기 위해 라이브러리를 사용했습니다.

# 최적화 전, 후 성능 비교

<video src="https://videos.ctfassets.net/aygsdsdi1qnw/5uvJuXwW0i8VICZFzURUM/5889ffddc49ee0a60559ae410fe50718/normal.mov" controls="controls" muted="muted" style="width:480px;max-height:640px;"></video>
<p align="center">최적화 전</p>

<video src="https://videos.ctfassets.net/aygsdsdi1qnw/4mgGuytvRX3PgalAmiMDJZ/cebed8df5a2793edb63257edcbbeb075/optimized.mov" controls="controls" muted="muted" style="width:480px;max-height:640px;"></video>
<p align="center">최적화 후</p>

최적화 전 영상을 보시면 12345를 연달아 입력했을 때 바로 입력이 안되고 딜레이가 생긴 후에 값이 변화되는 모습을 볼 수 있습니다. 반면에 최적화 후 영상을 보시면 딜레이 없이 숫자가 자연스럽게 입력이 되는 걸 확인할 수 있습니다.

![](https://i.imgur.com/yZAkEuL.png)

<p align="center">최적화 전</p>

![](https://i.imgur.com/ZsuPk63.png)

<p align="center">최적화 후</p>

React Profiler로 memo 적용 전, 적용 후를 측정한 결과입니다. 적용 전에는 모든 컴포넌트가 리렌더링 되는 반면, 적용 후에는 변경 사항이 없는 컴포넌트에서 리렌더링이 일어나지 않는 것을 확인하실 수 있습니다 (그래프의 회색).

![](https://i.imgur.com/enrAlcQ.png)

<p align="center">최적화 전</p>

![](https://i.imgur.com/gjkTCVP.png)

<p align="center">최적화 후</p>

페이즈에서 가장 렌더링이 긴 시간을 대조해보면 `109.2ms` -> `27.1ms`로 약 5배 정도 빨라진 것을 확인할 수 있습니다. 
# 결론
- 화면이 버벅인다면 불필요한 렌더링이 일어나는지 확인해 보고 `React.memo`를 통해 개선할 수 있습니다.
- `React.memo`를 사용하면 props 간의 비교를 통해 변화가 일어났을 때만 렌더링이 됩니다. 빌트인 API는 얕은 비교 로직을 사용하지만 두 번째 인자를 통해 원하는 비교 로직을 직접 구현할 수도 있습니다.
- `React.memo`를 사용할 때 주의해야 할 점은 `useState`, `useContext`와 같은 hook을 사용하는 컴포넌트의 경우 비교 로직의 참 거짓 여부와 상관없이 리렌더링이 될 수 있다는 점입니다.
- [react-fast-compare](https://github.com/FormidableLabs/react-fast-compare "react-fast-compare github")를 사용하면 A, B의 빠른 속도의 깊은 비교를 간단하게 구현할 수 있습니다. 직접 알고리즘을 짜는 게 어렵거나 개발 공수를 줄이고 싶다면 라이브러리를 쓰는 것도 좋은 방법입니다.

결과적으로 원본 코드를 재현해보았을 때 `React.memo`를 통해 약 5배 정도의 성능 향상을 얻을 수 있었습니다.

이상으로 글을 마칩니다. 감사합니다.