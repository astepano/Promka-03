import MoleculeGraph from './components/MoleculeGraph/MoleculeGraph.jsx'
import SideMenu from './components/SideMenu/SideMenu.jsx'
import TimelineSlider from './components/TimelineSlider/TimelineSlider.jsx'
import NodeDetailPanel from './components/NodeDetailPanel/NodeDetailPanel.jsx'
import HelpButton from './components/HelpButton/HelpButton.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      {/* Уровень 0 — 3D-граф на весь экран */}
      <MoleculeGraph />

      {/* Уровень 1 — боковое меню */}
      <SideMenu />

      {/* Уровень 2 — панель деталей узла */}
      <NodeDetailPanel />

      {/* Уровень 3 — нижняя временная шкала */}
      <TimelineSlider />

      {/* Кнопка помощи */}
      <HelpButton />
    </div>
  )
}
