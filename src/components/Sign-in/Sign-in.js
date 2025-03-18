import React from 'react' //, { useState }
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import actions from '../actions'

import style from './index.module.scss'

const SignIn = ({ history, oldUser, getPosts }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  const pressLogin = (data) => {
    oldUser({
      email: data.email,
      password: data.password,
    })
    getPosts()
    history.push('/articles')
  }

  return (
    <div className={style.signIn_body}>
      <form className={style.signIn} onSubmit={handleSubmit(pressLogin)}>
        <div className={style.head}>Sign In</div>

        <label htmlFor="email" className={style.label}>
          Email address
        </label>
        <input
          {...register('email', {
            required: 'Email cannot be empty',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          autoComplete="email"
          type="email"
          id="email"
          placeholder="Email address"
          name="email"
          className={errors.email ? style.input_false : style.input}
        />
        {errors.email && <span>{errors.email.message}</span>}
        <label htmlFor="password" className={style.label}>
          Password
        </label>
        <input
          {...register('password', { required: 'Username is required' })}
          autoComplete="current-password"
          type="password"
          id="password"
          placeholder="Password"
          name="password"
          className={errors.password ? style.input_false : style.input}
        />
        {errors.password && <span>{errors.password.message}</span>}
        <button type="submit" disabled={!isValid} className={style.button_login}>
          Login
        </button>
        <div className={style.not_account}>
          <p className={style.not_account_text}>Don’t have an account?</p>
          <Link to="/sign-up" className={style.not_account_link}>
            Sign Up.
          </Link>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(SignIn))
