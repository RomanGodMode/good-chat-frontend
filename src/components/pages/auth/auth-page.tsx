import s from "./auth-page.module.scss";

type Props = {
  isRegister: boolean
}

export const AuthPage = ({isRegister}: Props) => {
  return (
    <main className={s.authPage}>
      <h1>{isRegister ? 'REGISTER' : 'LOGIN'}</h1>

      <form className={s.authForm}>
        <div className="inputGroup">
          <label htmlFor='email'>Email</label>
          <input id='email' type="text"/>
        </div>
        <div className="inputGroup">
          <label htmlFor='password'>Password</label>
          <input id='password' type="text"/>
        </div>
        <button>{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </main>
  )
}
