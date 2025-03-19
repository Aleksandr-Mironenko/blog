import { connect } from 'react-redux'
import { useForm } from 'react-hook-form'
import { withRouter, Redirect } from 'react-router-dom'

import actions from '../actions'

import style from './index.module.scss'
const ProfileUser = ({ store, saveUserData, history }) => {
  const { userName, emailAddress, userPhoto, token, authorized } = store

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { userName: userName, email: emailAddress, userPhoto: userPhoto },
  })

  const pressSave = (data) => {
    saveUserData({
      userName: data.userName,
      email: data.email,
      password: data.password,
      userPhoto: data.userPhoto,
      token: token,
    })
    history.push('/articles')
  }

  const checkUrlUserPhoto =
    '^(https?://)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(#[-a-z\\d_]*)?$'

  if (!authorized) {
    return <Redirect to="/articles" />
  }

  return (
    <div className={style.profile}>
      <form className={style.profile__form} onSubmit={handleSubmit(pressSave)}>
        <div className={style.profile__legend}>Edit Profile</div>

        <label htmlFor="userName" className={style.label}>
          Username
        </label>
        <input
          {...register('userName', { required: 'Username cannot be empty' })}
          type="text"
          id="userName"
          placeholder="Username"
          name="userName"
          className={errors.userName ? style['input-false'] : style.input}
          autoComplete="userName"
        />
        {errors.userName && <span className={style['error-message']}>{errors.userName.message}</span>}

        <label htmlFor="email" className={style.label}>
          Email address
        </label>
        <input
          {...register('email', {
            required: 'Email cannot be empty',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          type="text"
          id="email"
          placeholder="Email address"
          name="email"
          className={errors.email ? style['input-false'] : style.input}
          autoComplete="email"
        />
        {errors.email && <span className={style['error-message']}>{errors.email.message}</span>}

        <label htmlFor="newPassword" className={style.label}>
          New password
        </label>
        <input
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            maxLength: { value: 40, message: 'Password no more than 40 characters' },
          })}
          type="password"
          id="newPassword"
          placeholder="New password"
          name="newPassword"
          className={errors.newPassword ? style['input-false'] : style.input}
          autoComplete="new-password"
        />
        {errors.newPassword && <span className={style['error-message']}>{errors.newPassword.message}</span>}

        <label htmlFor="userPhoto" className={style.label}>
          Avatar image (url)
        </label>
        <input
          {...register('userPhoto', {
            required: 'Avatar is required',
            pattern: { value: `${checkUrlUserPhoto}`, message: 'Invalid URL' },
          })}
          type="url"
          id="userPhoto"
          placeholder="Avatar image"
          name="userPhoto"
          className={errors.userPhoto ? style['input-false'] : style.input}
          autoComplete="url"
        />
        {errors.userPhoto && <span className={style['error-message']}>{errors.userPhoto.message}</span>}

        <button type="submit" disabled={!isValid} className={style['profile__button-save']}>
          Save
        </button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(ProfileUser))
