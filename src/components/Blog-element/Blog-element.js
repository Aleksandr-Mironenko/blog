import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import actions from '../../redux/actions'

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
  description,
  id,
  slug,
  favorite,
  noFavorite,
}) => {
  const { token, authorized } = store

  const wordСutting = (text) => {
    if (text.length > 50) {
      return text.slice(0, 50) + '...'
    }
    return text
  }

  const tagListWordСutting = () => {
    const tagsList = tagList.map((item) => {
      const fomatedItem = item.trimStart().trimEnd()
      return fomatedItem
    })

    const tagsString = tagsList.join(' ')
    const tagsLength = tagsString.length
    if (tagsLength > 90) {
      const cuttingString = tagsString.slice(0, 80)
      const indexLastSpaceInCuttingString = cuttingString.lastIndexOf(' ')
      const finalCuttingString = cuttingString.slice(0, indexLastSpaceInCuttingString)
      const filterNoEmptyTags = `${finalCuttingString} ...`.split(' ').filter((item) => item !== '' || item !== ' ')
      return filterNoEmptyTags
    }
    return tagList
  }

  const tags = tagListWordСutting().map((item, index) => {
    return (
      <div className={style.element__tag} key={index}>
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
    <div className={style.element}>
      <div className={style.element__info}>
        <div className={style.element__left}>
          <div className={style.element__title}>
            <div
              className={style.element__sting}
              onClick={() => {
                history.push(`/articles/${id}`)
              }}
            >
              {wordСutting(`${title}`)}
            </div>
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
          <div className={style.element__tags}>{tagList.length ? tags : null}</div>
        </div>
        <div className={style.element__right}>
          <div className={style.author}>
            <div className={style.author__username}>{authorUserName}</div>
            <div className={style['author__time-created']}>{createdAt}</div>
          </div>
          <div></div>
          <img className={style.author__image} alt="User" src={authorImage} />
        </div>
      </div>
      <div className={style.element__description}>{description}</div>
    </div>
  )
}
const mapStateToProps = (state) => ({ store: state })
export default withRouter(connect(mapStateToProps, actions)(BlogElement))
