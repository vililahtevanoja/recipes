import md5 from 'crypto-js/md5'

const colorClasses = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

const getColorClass = (tag: string): string => {
  const hash = md5(tag).toString()
  const xored = [...hash.split('')].reduce((acc, curr) => acc ^ curr.codePointAt(0)!, 0)
  const colorClass = colorClasses[xored % colorClasses.length]
  console.log(`colorclass: ${tag} -> ${xored} -> ${colorClass}`)
  return colorClass
}

export const TagPill = ({ tag }: { tag: string }) => {
  const colorClass = getColorClass(tag)
  return (
    <div className="flex flex-row">
      <a
        className={`no-underline txt-lg text-${colorClass}-300 bg-${colorClass}-700 rounded-full`}
        href={`/?tag=${tag}`}
      >
        {tag}
      </a>
    </div>
  )
}
