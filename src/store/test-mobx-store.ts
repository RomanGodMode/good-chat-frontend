import { action, makeAutoObservable } from 'mobx'

type Data = {
  value: number
}

type StoreData = Data & { isLoading?: boolean }

const getData = async (): Promise<Data[]> => [
  { value: 1 },
  { value: 2 },
  { value: 3 }
]

class TestMobxStore {
  data: StoreData[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  fetchData() {
    getData().then(action('dataLoaded', data => this.data = data))
  }

  sendUsefulMutation(data: StoreData) {
    data.isLoading = true
    setTimeout(action('mutate', () => {
      data.value += 100
      data.isLoading = false
    }), 2000)
  }

}

export const testMobxStore = new TestMobxStore()
