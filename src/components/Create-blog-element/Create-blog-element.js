import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import actions from '../../redux/actions'
import BlogForm from '../Blog-element-form'

const CreateBlogElement = ({ store, history, createPost }) => {
  const { token, authorized } = store

  const handleSubmit = (data) => {
    const post = { ...data, token }
    createPost(post)
    history.push('/articles')
  }

  if (!authorized) {
    return <Redirect to="/articles" />
  }

  return <BlogForm defaultValues={{ title: '', description: '', text: '', tagList: [''] }} onSubmit={handleSubmit} />
}

const mapStateToProps = (state) => ({ store: state })

export default withRouter(connect(mapStateToProps, actions)(CreateBlogElement))
