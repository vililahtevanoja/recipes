import Link from 'next/link'
import styles from './styles.module.scss'

export default function RecipeHeader() {
  return (
    <div className="flex flex-row">
      <div className="basis-1/6">
        <Link className="no-underline txt-lg text-blue-300" href="/">
          Home
        </Link>
      </div>
    </div>
  )
}
