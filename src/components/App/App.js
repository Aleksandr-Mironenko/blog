import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router-dom'

import СonfirmationOfDeletionElement from '../Сonfirmation-of-deletion-element'
import BodyBlog from '../Body-blog'
import BlogFullElement from '../Blog-full-element'
// import CreateEditBlogElement from '../CreateEditBlogElement'
import CreateBlogElement from '../Create-blog-element'
import EditBlogElement from '../Edit-blog-element'
import ProfileUser from '../Profile-user'
import SignUp from '../Sign-up'
import SignIn from '../Sign-in'
import Head from '../Head'
import Transition from '../Transition'
import history from '../history'
import Loading from '../Loading'
import Error from '../Error'
import Offline from '../Offline'
import actions from '../../redux/actions'

import style from './index.module.scss'

const App = ({ store, getPosts, getToken, listenerOnline, listenerOffline, sizeMonitor }) => {
  const { authorized, posts, page, loading, offline, error } = store

  useEffect(() => {
    getPosts(page)
  }, [getPosts, page])

  useEffect(() => {
    getToken()
  }, [getToken])

  useEffect(() => {
    listenerOnline()
    listenerOffline()
  }, [listenerOnline, listenerOffline])

  //если нужно будет добавить мобильные экраны
  const size = useCallback(() => {
    sizeMonitor(window.innerWidth)
  }, [sizeMonitor])
  useEffect(() => {
    size()
    window.addEventListener('resize', size)
    return () => {
      window.removeEventListener('resize', size)
    }
  }, [size])

  return (
    <Router history={history}>
      {offline ? (
        <Offline />
      ) : (
        <div className={style.app}>
          <Head />

          {error ? (
            <Error />
          ) : loading ? (
            <Loading />
          ) : (
            <Switch>
              <Route path="/profile" exact component={ProfileUser} />

              <Route path="/new-article" exact component={CreateBlogElement} />

              <Route path="/sign-in" exact component={SignIn} />

              <Route path="/sign-up" exact component={SignUp} />

              <Route
                path="/articles/:id/edit"
                render={({ match }) => {
                  const id = match.params.id
                  return authorized ? <EditBlogElement {...posts[id]} /> : <Redirect to="/articles" />
                }}
              />

              <Route
                path="/articles/:id/delete"
                exact
                render={({ match }) => {
                  const id = match.params.id

                  return (
                    <>
                      <BlogFullElement {...posts[id]} />
                      <СonfirmationOfDeletionElement {...posts[id]} />
                    </>
                  )
                }}
              />

              <Route
                path="/articles/:id"
                exact
                render={({ match }) => {
                  const id = match.params.id
                  return <BlogFullElement {...posts[id]} />
                }}
              />

              <Route path="/articles" exact component={BodyBlog} />

              <Route path="/" component={Transition} />

              <Redirect to="/articles" />
            </Switch>
          )}
        </div>
      )}
    </Router>
  )
}

const mapStateToProps = (state) => ({ store: state })
export default connect(mapStateToProps, actions)(App)
