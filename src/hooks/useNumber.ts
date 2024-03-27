import React, {useDebugValue, useState} from 'react'

export const useNumber = () => {
  const [state, setState] = useState<number>()

  useDebugValue(state ? 'Has Value' : 'No Value')

  return {state, setState}
}
