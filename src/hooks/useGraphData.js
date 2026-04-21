import { useEffect } from 'react'
import { getGraph } from '../api/moleculeApi.js'
import useMoleculeStore from '../store/useMoleculeStore.js'

export function useGraphData() {
  const { currentDate, scenario, setGraphData, setLoading, setError } = useMoleculeStore()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getGraph(currentDate, scenario)
      .then(({ nodes, links }) => {
        if (!cancelled) {
          setGraphData(nodes, links)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [currentDate, scenario])
}
