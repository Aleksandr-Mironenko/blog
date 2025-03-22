import React from 'react'
import { useForm } from 'react-hook-form'

import AddTag from '../../../AddTag'
import style from '../../index.module.scss'

const BlogElementForm = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues,
  })

  const tagsList = watch('tagList')

  const addTags = (index, value) => {
    const newTags = [...tagsList.slice(0, index), value, ...tagsList.slice(index + 1)]
    setValue('tagList', newTags)
  }

  const deleteTags = (index) => {
    const newTags = [...tagsList.slice(0, index), ...tagsList.slice(index + 1)]
    setValue('tagList', newTags)
  }

  const tagsElements = tagsList.map((item, index) => (
    <AddTag key={index} item={item} index={index} addTags={addTags} deleteTags={deleteTags} />
  ))

  const addTagInTagList = () => {
    const newTags = [...tagsList, '']
    setValue('tagList', newTags)
  }

  const fiterTagsList = tagsList.filter((item) => item !== '' && item !== ' ')

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, tagList: fiterTagsList })
  }

  return (
    <div className={style.create}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={style.create__form}>
        <div className={style.create__legend}>{defaultValues.slug ? 'Edit article' : 'Create new article'}</div>
        <label htmlFor="title" className={style.label}>
          Title
        </label>
        <input
          {...register('title', { required: 'Title cannot be empty' })}
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className={errors.title ? style['input-false'] : style.input}
          autoComplete="title"
        />
        {errors.title && <span className={style['error-message']}>{errors.title.message}</span>}

        <label htmlFor="description" className={style.label}>
          Short description
        </label>
        <input
          {...register('description', { required: 'Description cannot be empty' })}
          type="text"
          id="description"
          name="description"
          placeholder="Description"
          className={errors.description ? style['input-false'] : style.input}
          autoComplete="description"
        />
        {errors.description && <span className={style['error-message']}>{errors.description.message}</span>}

        <label htmlFor="text" className={style.label}>
          Text
        </label>
        <textarea
          {...register('text', { required: 'Text cannot be empty' })}
          id="text"
          name="text"
          rows="4"
          cols="500"
          placeholder="Text"
          className={errors.text ? style['input-false'] : style.input}
          autoComplete="text"
        />
        {errors.text && <span className={style['error-message']}>{errors.text.message}</span>}

        <div className={style.tags}>
          <div className={style.label}>Tags</div>
          <div className={style['create__tags-block']}>
            <div className={style.create__tags}>{tagsElements}</div>
            <button type="button" onClick={addTagInTagList} className={style['create__button-add']}>
              Add tag
            </button>
          </div>
        </div>
        <button disabled={!isValid} type="submit" className={style['create__button-send']}>
          Send
        </button>
      </form>
    </div>
  )
}

export default BlogElementForm
