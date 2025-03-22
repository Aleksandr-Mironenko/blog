import style from './index.module.scss'

const AddTag = ({ item, index, addTags, deleteTags }) => {
  return (
    <div className={style.tag}>
      <input
        type="text"
        id={item + index}
        name={item + index}
        value={item}
        placeholder="Tag"
        onChange={(e) => addTags(index, e.target.value)}
        className={style.input_tag}
      />
      <button type="button" className={style.button_del} onClick={() => deleteTags(index)}>
        Delete
      </button>
    </div>
  )
}
export default AddTag
