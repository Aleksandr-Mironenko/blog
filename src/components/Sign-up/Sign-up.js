import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import actions from '../../redux/actions'

import style from './index.module.scss'

const SignUp = ({ history, newUser, getPosts }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { agree: true },
  })

  const agree = watch('agree')
  const password = watch('password')

  const pressCreate = (data) => {
    newUser({
      username: data.username,
      email: data.email,
      password: data.password,
    })
    getPosts()
    history.push('/articles')
  }

  return (
    <div className={style.signup}>
      <form className={style.signup__form} onSubmit={handleSubmit(pressCreate)}>
        <div className={style.signup__legend}>Create new account</div>
        <label htmlFor="username" className={style.label}>
          Username
        </label>
        <input
          {...register('username', {
            required: 'Username cannot be empty',
            minLength: { value: 3, message: 'Usermane must be at least 3 characters' },
            maxLength: { value: 20, message: 'Usermane no more than 20 characters' },
          })}
          type="text"
          id="username"
          placeholder="Username"
          name="username"
          className={errors.username ? style['input-false'] : style.input}
          autoComplete="Username"
        />
        {errors.username && <span className={style['error-message']}>{errors.username.message}</span>}

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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            maxLength: { value: 40, message: 'Password no more than 40 characters' },
          })}
          autoComplete="current-password"
          type="password"
          id="password"
          placeholder="Password"
          name="password"
          className={errors.password ? style['input-false'] : style.input}
        />
        {errors.password && <span className={style['error-message']}>{errors.password.message}</span>}

        <label htmlFor="repeatPassword" className={style.label}>
          Repeat Password
        </label>
        <input
          {...register('repeatPassword', {
            required: 'Password is required',
            validate: (value) => value === password || 'Passwords must match',
          })}
          autoComplete="current-password"
          type="password"
          id="repeatPassword"
          placeholder="Repeat Password"
          name="repeatPassword"
          className={errors.repeatPassword ? style['input-false'] : style.input}
        />
        {errors.repeatPassword && <span className={style['error-message']}>{errors.repeatPassword.message}</span>}

        <div className={style.signup__agree}>
          <input
            {...register('agree')}
            name="agree"
            type="checkbox"
            checked={agree}
            onChange={() => setValue('agree', !agree)}
            className={style.signup__input}
          />
          <div className={style['signup__agree-text']}>I agree to the processing of my personal information</div>
        </div>
        <button disabled={!isValid || !agree} type="submit" className={style['signup__button-create']}>
          Create
        </button>
        <div className={style['signup__there-are-accounts']}>
          <p className={style['signup__there-are-accounts-text']}>Already have an account? </p>
          <Link to="/sign-in" className={style['signup__there-are-accounts-link']}>
            Sign In.
          </Link>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(SignUp))
