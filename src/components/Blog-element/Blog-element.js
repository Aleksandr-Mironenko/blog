import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import actions from '../actions'

import style from './index.module.scss'
import white from './transparent.svg'
import red from './red.svg'

const BlogElement = ({
  store,
  history,
  tagList,
  title,
  favoritesCount,
  authorUserName,
  createdAt,
  authorImage,
  favorited,
  postAbbreviated,
  id,
  slug,
  favorite,
  noFavorite,
}) => {
  const { token, authorized } = store

  const abr = (text) => {
    if (text.length > 65) {
      return text.slice(0, 65) + '...'
    }
    return text
  }

  const tags = tagList.map((item, index) => {
    if (item === ' ') {
      item = ''
    }
    return (
      <div className={style.tag} key={index}>
        {item}
      </div>
    )
  })

  const liked = () => {
    if (!favorited) {
      favorite(slug, token, id)
    } else {
      noFavorite(slug, token, id)
    }
  }

  return (
    <div className={style.blog_element}>
      <div className={style.info}>
        <div className={style.left}>
          <div className={style.title_sting}>
            <div
              className={style.title}
              onClick={() => {
                history.push(`/articles/${id}`)
              }}
            >
              {abr(`${title}`)}
            </div>
            <div className={style.favorites}>
              <img
                alt="heart"
                src={favorited ? red : white}
                className={style.heart}
                onClick={authorized ? liked : null}
              />
              <div className={style.favorites_count}>{favorited ? favoritesCount + 1 : favoritesCount}</div>
            </div>
          </div>
          <div className={style.tags}>{tagList.length ? tags : null}</div>
        </div>
        <div className={style.right}>
          <div className={style.author_info}>
            <div className={style.author_user_name}>{authorUserName}</div>
            <div className={style.time_created}>{createdAt}</div>
          </div>
          <div></div>
          <img className={style.author_image} alt="User" src={authorImage} />
        </div>
      </div>
      <div className={style.post_abbreviated}>{postAbbreviated}</div>
    </div>
  )
}
const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(BlogElement))
