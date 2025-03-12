import React from "react"

export function useMap<T, V>(initialState?: [T, V][]): Map<T, V> {
  const mapRef = React.useRef(new Map<T, V>(initialState))
  const [
    , forceUpdate,
  ] = React.useReducer(
    x => (x + 1) % 1_000_000, 0
  )

  mapRef.current.set = (...args) => {
    Map.prototype.set.apply(
      mapRef.current, args
    )
    forceUpdate()
    return mapRef.current
  }

  mapRef.current.clear = (...args) => {
    Map.prototype.clear.apply(
      mapRef.current, args
    )
    forceUpdate()
  }

  mapRef.current.delete = (...args) => {
    const res = Map.prototype.delete.apply(
      mapRef.current, args
    )
    forceUpdate()

    return res
  }

  return mapRef.current
}
