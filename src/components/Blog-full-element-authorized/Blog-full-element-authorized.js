import { withRouter } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'

import actions from '../actions'

import white from './transparent.svg'
import red from './red.svg'
import style from './index.module.scss'

const BlogFullElementAuthorized = ({
  store,
  tagList = [],
  title,
  favoritesCount,
  authorUserName,
  createdAt,
  authorImage,
  favorited,
  description = '',
  body = '',
  history,
  id,
  slug,
  favorite,
  noFavorite,
}) => {
  const { userName, token, authorized } = store

  const validateMarkdown = (text) => {
    const markdownPatterns = [
      /^#/,
      /\[([^\]]+)]\(([^)]+)\)/,
      /\*\*([^*]+)\*\*/,
      /__([^_]+)__/,
      /\*([^*]+)\*/,
      /_([^_]+)_/,
      /^(\*|-|\+|\d+\.) /,
      /!\[([^\]]+)]\(([^)]+)\)/,
    ]
    return markdownPatterns.some((pattern) => pattern.test(text))
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

  const addIfAuthorized = (
    <div className={style.edit_delete}>
      <button
        className={style.delete}
        onClick={() => {
          history.push(`/articles/${id}/delete`)
        }}
      >
        Delete
      </button>
      <button
        className={style.edit}
        onClick={() => {
          history.push(`/articles/${id}/edit`)
        }}
      >
        Edit
      </button>
    </div>
  )

  const liked = () => {
    if (!favorited) {
      favorite(slug, token, id)
    } else {
      noFavorite(slug, token, id)
    }
  }

  return (
    <div className={style.blog_full_element}>
      <div className={style.info}>
        <div className={style.left}>
          <div className={style.title_sting}>
            <div className={style.title}>{title}</div>
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
      <div className={style.abbr_edit_delete}>
        <div className={style.post_abbreviated}>{description}</div>
        {authorUserName === userName ? addIfAuthorized : null}
      </div>
      <div className={style.body}>{validateMarkdown(body) ? <ReactMarkdown>{body}</ReactMarkdown> : body}</div>
    </div>
  )
}
const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(BlogFullElementAuthorized))
