import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import actions from '../actions'

import arrow from './arrow.svg'
import allert from './allert.png'
import style from './index.module.scss'

const СonfirmationOfDeletionElement = ({ store, history, id, deletePost }) => {
  const deleted = () => {
    const filteritem = store.posts.filter((item) => item.id === id)

    deletePost(filteritem[0].slug, store.token)

    history.push('/articles')
  }
  if (!store.authorized) {
    return <Redirect to="/articles" />
  }
  return (
    <div className={style.confirmation_of_deletion_element}>
      <img src={arrow} alt="" className={style.image_arrow} />

      <div className={style.text_buttons}>
        <div className={style.text_element}>
          <img src={allert} alt="" className={style.image_allert} />
          <div className={style.text}>Are you sure to delete this article?</div>
        </div>
        <div className={style.buttons}>
          <button
            className={style.button}
            onClick={() => {
              history.push(`/articles/${id}`)
            }}
          >
            No
          </button>
          <button className={style.button} onClick={deleted}>
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(СonfirmationOfDeletionElement))
