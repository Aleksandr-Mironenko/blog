import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import actions from '../../redux/actions'
import BlogForm from '../BlogElementForm'

const EditBlogElement = ({ store, history, updateArticle, title, tagList, description, slug, body = '' }) => {
  const { token, authorized } = store

  const handleSubmit = (data) => {
    const post = {
      title: data.title,
      tagList: data.tagList,
      text: data.text,
      slug: slug,
      description: data.description,
      token: token,
    }
    updateArticle(post)
    history.push('/articles')
  }

  if (!authorized) {
    return <Redirect to="/articles" />
  }

  return (
    <BlogForm
      defaultValues={{
        title: title,
        description: description,
        text: body,
        tagList: tagList,
      }}
      onSubmit={handleSubmit}
    />
  )
}

const mapStateToProps = (state) => ({
  store: state,
})

export default withRouter(connect(mapStateToProps, actions)(EditBlogElement))
