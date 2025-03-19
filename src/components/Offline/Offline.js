import style from './index.module.scss'
const Offline = () => {
  return (
    <div className={style.offline}>
      <div className={style.offline__text}>Интернет отсутствует</div>
    </div>
  )
}
export default Offline
