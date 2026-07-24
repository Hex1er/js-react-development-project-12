import { Formik, Form, Field } from 'formik'

const LoginPage = () => {
  return (
    <div className="container mt-5">
      <h1>Вход</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          // На этом этапе просто выведем данные в консоль
          console.log('Отправка формы:', values)
          alert('Форма отправлена')
        }}
      >
        <Form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Имя пользователя</label>
            <Field
              type="text"
              name="username"
              className="form-control"
              id="username"
              placeholder="Введите имя"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <Field
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Введите пароль"
            />
          </div>
          <button type="submit" className="btn btn-primary">Войти</button>
        </Form>
      </Formik>
    </div>
  )
}

export default LoginPage