import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from '../../redux/actions'

import style from './index.module.scss'

const UserBlock = ({ store, history, logOutLocalStorage }) => {
  const { userName, userPhoto } = store

  const pressLogOut = () => {
    logOutLocalStorage()
    history.push('/articles')
  }

  return (
    <div className={style.autorized}>
      <button className={style['autorized__new-post']} onClick={() => history.push('/new-article')}>
        Create article
      </button>
      <div className={style.author} onClick={() => history.push('/profile')}>
        <div className={style.author__username}> {userName}</div>
        <img className={style.author__image} alt="User" src={userPhoto} />
      </div>
      <button className={style.autorized__logout} onClick={pressLogOut}>
        Log Out
      </button>
    </div>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(UserBlock))
