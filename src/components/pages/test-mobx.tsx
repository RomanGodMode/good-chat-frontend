import { observer } from 'mobx-react-lite'
import { testMobxStore } from '../../store/test-mobx-store'
import { useEffect } from 'react'

const a = {}
if (a) {

}
export const TestMobx = observer(() => {
  useEffect(() => testMobxStore.fetchData(), [])

  return (
    <div>
      {
        testMobxStore.data.map(d => d.isLoading
          ? <span>загрузка...</span>
          : <button onClick={() => testMobxStore.sendUsefulMutation(d)}>
            {d.value}
          </button>)
      }
    </div>
  )
})
