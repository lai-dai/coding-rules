/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

export const useUpdateEffect: typeof React.useEffect = (
  effect, deps
) => {
  const renderCycleRef = React.useRef(false)
  const effectCycleRef = React.useRef(false)

  React.useEffect(
    () => {
      const isMounted = renderCycleRef.current
      const shouldRun = isMounted && effectCycleRef.current

      if (shouldRun) {
        return effect()
      }
      effectCycleRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps
  )

  React.useEffect(
    () => {
      renderCycleRef.current = true

      return () => {
        renderCycleRef.current = false
      }
    }, []
  )
}
