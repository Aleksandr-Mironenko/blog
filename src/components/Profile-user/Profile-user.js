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
    <div className={style.edit_profile_body}>
      <form className={style.edit} onSubmit={handleSubmit(pressSave)}>
        <div className={style.edit_profile}>Edit Profile</div>

        <label htmlFor="userName" className={style.edit_label}>
          Username
        </label>
        <input
          {...register('userName', { required: 'Username cannot be empty' })}
          type="text"
          id="userName"
          placeholder="Username"
          name="userName"
          className={errors.userName ? style.input_false : style.edit_input}
          autoComplete="userName"
        />
        {errors.userName && <span>{errors.userName.message}</span>}

        <label htmlFor="email" className={style.edit_label}>
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
          className={errors.email ? style.input_false : style.edit_input}
          autoComplete="email"
        />
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="newPassword" className={style.edit_label}>
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
          className={errors.newPassword ? style.input_false : style.edit_input}
          autoComplete="new-password"
        />
        {errors.newPassword && <span>{errors.newPassword.message}</span>}

        <label htmlFor="userPhoto" className={style.edit_label}>
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
          className={errors.userPhoto ? style.input_false : style.edit_input}
          autoComplete="url"
        />
        {errors.userPhoto && <span>{errors.userPhoto.message}</span>}

        <button type="submit" disabled={!isValid} className={style.button_save}>
          Save
        </button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(ProfileUser))
