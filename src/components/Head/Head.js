import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import actions from '../../redux/actions'
import UserBlock from '../User-block'
import HeaderLogOut from '../Header-log-out'

import style from './index.module.scss'

const Head = ({ store, history }) => {
  const { authorized } = store

  const headerUser = authorized ? <UserBlock /> : <HeaderLogOut />

  return (
    <header className={style.header}>
      <div
        className={style.header__left}
        onClick={() => {
          history.push('/articles')
        }}
      >
        Realworld Blog
      </div>
      <div className={style.header__right}>{headerUser}</div>
    </header>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(Head))
