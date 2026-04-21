import { useRef, useCallback, useMemo } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import useMoleculeStore from '../../store/useMoleculeStore.js'
import { useGraphData } from '../../hooks/useGraphData.js'
import {
  makeNodeObject,
  makeLinkLabel,
  calcLinkWidth,
  getLinkColor,
  getMaxLinkValue,
} from '../../utils/graphHelpers.js'
import './MoleculeGraph.css'

export default function MoleculeGraph() {
  useGraphData()
  const fgRef = useRef()

  const nodes         = useMoleculeStore(s => s.nodes)
  const links         = useMoleculeStore(s => s.links)
  const setSelected   = useMoleculeStore(s => s.setSelectedNode)

  const maxVal = useMemo(() => getMaxLinkValue(links), [links])

  const handleNodeClick = useCallback((node) => {
    setSelected(node)
    // Плавный зум к узлу
    if (fgRef.current) {
      const dist = 120
      const { x = 0, y = 0, z = 0 } = node
      fgRef.current.cameraPosition(
        { x: x + dist * 0.6, y: y + dist * 0.4, z: z + dist },
        { x, y, z },
        800,
      )
    }
  }, [setSelected])

  const nodeThreeObject = useCallback((node) => makeNodeObject(node), [])

  const linkThreeObjectExtend = useCallback(
    (link) => makeLinkLabel(link),
    [],
  )

  const linkWidth = useCallback(
    (link) => calcLinkWidth(link.value, maxVal),
    [maxVal],
  )

  const linkColor = useCallback(
    (link) => getLinkColor(link.value, maxVal),
    [maxVal],
  )

  return (
    <div className="molecule-graph">
      <ForceGraph3D
        ref={fgRef}
        graphData={{ nodes, links }}
        backgroundColor="#000000"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkThreeObject={linkThreeObjectExtend}
        linkThreeObjectExtend={true}
        linkWidth={linkWidth}
        linkColor={linkColor}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) =>
          link.value > 0 ? Math.max(1, calcLinkWidth(link.value, maxVal) * 0.3) : 0
        }
        linkDirectionalParticleSpeed={(link) =>
          link.value > 0 ? 0.002 + (link.value / maxVal) * 0.008 : 0
        }
        linkDirectionalParticleColor={() => 'rgba(255,255,255,0.7)'}
        onNodeClick={handleNodeClick}
        nodeLabel=""
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  )
}
