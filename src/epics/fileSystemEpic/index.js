import { partition, of, merge } from "rxjs"
import { flatMap, debounceTime, tap } from "rxjs/operators"
import { ofType } from "redux-observable"
import * as FileSystem from "expo-file-system"
import _ from "lodash/fp"

import { CLEAR_IMAGE_STORAGE } from "epics/fileSystemEpic/actions"
import { STORE_IMAGE_PATH, STORE_QUOTA } from "epics/fileSystemEpic/common"

const cleanStorage = async (pathUri, quota) => {
  const dirInfo = await FileSystem.getInfoAsync(pathUri)
  if (dirInfo.exists) {
    const files = await FileSystem.readDirectoryAsync(pathUri)
    const infoFiles = []
    for (const f of files) {
      infoFiles.push(await FileSystem.getInfoAsync(pathUri + f))
    }
    const sortedItems = _.reverse(_.sortBy(o => o.modificationTime, infoFiles))

    const calcSize = files => files.reduce((acc, file) => acc + file.size, 0)
    while (calcSize(sortedItems) > quota) {
      const file = sortedItems.pop()
      FileSystem.deleteAsync(file.uri, { idempotent: true })
    }
  }
}

const mkSubmitIntent = () => {
  return of({ type: "fileSystem/addIntent", intent: "submit" }).pipe(debounceTime(2000))
}

const fileSystemClearStorage = action$ => {
  return action$.pipe(
    ofType(CLEAR_IMAGE_STORAGE),
    flatMap(mkSubmitIntent)
  )
}

const isSubmitAction = action =>
  action.type === "fileSystem/addIntent" && action.intent === "submit"

const fileSystemEpic = (action$, store) => {
  const fileSystemEntry$ = fileSystemClearStorage(action$, store)

  const [submitAction$, rest$] = partition(fileSystemEntry$, isSubmitAction)
  return merge(
    rest$,
    submitAction$.pipe(
      debounceTime(2000),
      tap(() =>
        cleanStorage(FileSystem.documentDirectory + STORE_IMAGE_PATH, STORE_QUOTA)
      )
    )
  )
}

export default fileSystemEpic
