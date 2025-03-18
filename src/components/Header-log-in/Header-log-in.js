import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from '../actions'

import style from './index.module.scss'

const HeaderLogIn = ({ store, history, logOutCookie }) => {
  const { userName, userPhoto } = store

  const pressLogOut = () => {
    logOutCookie()
    history.push('/articles')
  }

  return (
    <div className={style.block_user}>
      <button className={style.create} onClick={() => history.push('/new-article')}>
        Create article
      </button>
      <div className={style.profile} onClick={() => history.push('/profile')}>
        <div className={style.author_user_name}> {userName}</div>
        <img className={style.author_image} alt="User" src={userPhoto} />
      </div>
      <button className={style.log_out} onClick={pressLogOut}>
        Log Out
      </button>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(HeaderLogIn))
