import { useEffect, useState } from 'react'
import { Drawer, Spin } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useMoleculeStore from '../../store/useMoleculeStore.js'
import { getNodeDetail } from '../../api/moleculeApi.js'
import './NodeDetailPanel.css'

export default function NodeDetailPanel() {
  const selectedNode    = useMoleculeStore(s => s.selectedNode)
  const detailPanelOpen = useMoleculeStore(s => s.detailPanelOpen)
  const closePanel      = useMoleculeStore(s => s.closeDetailPanel)

  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!selectedNode) return
    setLoading(true)
    setMarkdown('')
    getNodeDetail(selectedNode.id)
      .then(({ markdown: md }) => setMarkdown(md || ''))
      .catch(() => setMarkdown('## Ошибка\n\nНе удалось загрузить данные.'))
      .finally(() => setLoading(false))
  }, [selectedNode])

  const title = selectedNode
    ? `${selectedNode.label || selectedNode.id} — детали`
    : 'Детали узла'

  return (
    <Drawer
      title={title}
      placement="right"
      open={detailPanelOpen}
      onClose={closePanel}
      width={340}
      mask={false}
      className="detail-drawer"
    >
      {loading ? (
        <div className="detail-loading"><Spin /></div>
      ) : (
        <div className="detail-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </Drawer>
  )
}
