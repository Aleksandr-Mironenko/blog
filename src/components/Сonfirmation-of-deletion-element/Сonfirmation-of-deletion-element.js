import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import actions from '../../redux/actions'

import arrow from './arrow.svg'
import allert from './allert.png'
import style from './index.module.scss'

const СonfirmationOfDeletionElement = ({ store, history, id, deletePost }) => {
  const { posts, token, authorized } = store
  const deleted = () => {
    const filteritem = posts.filter((item) => item.id === id)
    deletePost(filteritem[0].slug, token)
    history.push('/articles')
  }

  const no = () => {
    history.push(`/articles/${id}`)
  }

  if (!authorized) {
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
          <button className={style.button} onClick={no}>
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
