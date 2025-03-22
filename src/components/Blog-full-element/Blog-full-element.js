import { withRouter } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'

import actions from '../../redux/actions'

import white from './transparent.svg'
import red from './red.svg'
import style from './index.module.scss'

const BlogFullElement = ({
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
      <div className={style.full__tag} key={index}>
        {item}
      </div>
    )
  })

  const addIfAuthorized = (
    <div className={style['delete-edit']}>
      <button
        className={style['delete-edit__delete']}
        onClick={() => {
          history.push(`/articles/${id}/delete`)
        }}
      >
        Delete
      </button>
      <button
        className={style['delete-edit__edit']}
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
    <div className={style.full}>
      <div className={style.full__info}>
        <div className={style.full__left}>
          <div className={style.full__title}>
            <div className={style.full__sting}>{title}</div>
            <div className={style.favorites}>
              <img
                alt="heart"
                src={favorited ? red : white}
                className={style.favorites__heart}
                onClick={authorized ? liked : null}
              />
              <div className={style.favorites__count}>{favorited ? favoritesCount + 1 : favoritesCount}</div>
            </div>
          </div>
          <div className={style.full__tags}>{tagList.length ? tags : null}</div>
        </div>
        <div className={style.full__right}>
          <div className={style.author}>
            <div className={style.author__username}>{authorUserName}</div>
            <div className={style['author__time-created']}>{createdAt}</div>
          </div>
          <div></div>
          <img className={style.author__image} alt="User" src={authorImage} />
        </div>
      </div>
      <div className={style['full__el-description']}>
        <div className={style.full__description}>{description}</div>
        {authorUserName === userName ? addIfAuthorized : null}
      </div>
      <div className={style.full__body}>{validateMarkdown(body) ? <ReactMarkdown>{body}</ReactMarkdown> : body}</div>
    </div>
  )
}
const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(BlogFullElement))
