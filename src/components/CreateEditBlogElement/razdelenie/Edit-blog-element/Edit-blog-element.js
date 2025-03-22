import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import actions from '../../../../redux/actions'
import BlogForm from '../BlogElementForm'

const EditBlogElement = ({ store, history, updateArticle, article }) => {
  const { token, authorized } = store

  const handleSubmit = (data) => {
    const post = { ...data, token, slug: article.slug }
    updateArticle(post)
    history.push('/articles')
  }

  if (!authorized) {
    return <Redirect to="/articles" />
  }

  return (
    <BlogForm
      defaultValues={{
        title: article.title,
        description: article.description,
        text: article.text,
        tagList: article.tagList,
      }}
      onSubmit={handleSubmit}
    />
  )
}

const mapStateToProps = (state, ownProps) => ({
  store: state,
  article: state.articles.find((article) => article.slug === ownProps.match.params.slug),
})

export default withRouter(connect(mapStateToProps, actions)(EditBlogElement))
