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
    <div className={style.signin}>
      <form className={style.signin__form} onSubmit={handleSubmit(pressLogin)}>
        <div className={style.signin__legend}>Sign In</div>

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
          className={errors.email ? style['input-false'] : style.input}
        />
        {errors.email && <span className={style['error-message']}>{errors.email.message}</span>}

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
          className={errors.password ? style['input-false'] : style.input}
        />
        {errors.password && <span className={style['error-message']}>{errors.password.message}</span>}

        <button type="submit" disabled={!isValid} className={style['signin__button-login']}>
          Login
        </button>
        <div className={style['no-account']}>
          <p className={style['no-account__text']}>Don’t have an account?</p>
          <Link to="/sign-up" className={style['no-account__link']}>
            Sign Up.
          </Link>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(SignIn))
