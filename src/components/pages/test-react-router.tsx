import { useSearchParams } from 'react-router-dom'

const tags = ['aboba', 'ez', 'papasha-chel']

export const TestReactRouter = () => {
  const [query, setQuery] = useSearchParams()
  const queryTags = query.getAll('tags')

  // query.
  const addTag = (tag: string) => {
    setQuery({ tags: [...queryTags, tag] })
  }
  const removeTag = (tag: string) => {
    setQuery({ tags: queryTags.filter(t => t !== tag) })
  }

  return (
    <div>
      {
        tags.map(tag => {
          const isActive = queryTags.includes(tag)
          return (
            <button
              key={tag}
              className={isActive ? 'active' : ''}
              onClick={() => isActive ? removeTag(tag) : addTag(tag)}
            >
              {tag}
            </button>
          )
        })
      }
    </div>
  )
}
