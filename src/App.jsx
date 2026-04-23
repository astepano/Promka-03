import { Component } from 'react'
import MoleculeGraph from './components/MoleculeGraph/MoleculeGraph.jsx'
import SideMenu from './components/SideMenu/SideMenu.jsx'
import TimelineSlider from './components/TimelineSlider/TimelineSlider.jsx'
import NodeDetailPanel from './components/NodeDetailPanel/NodeDetailPanel.jsx'
import HelpButton from './components/HelpButton/HelpButton.jsx'
import './App.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#000',
          color: '#ff4d4f', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', padding: 32, gap: 16,
        }}>
          <h2 style={{ color: '#ff4d4f', margin: 0 }}>Ошибка загрузки</h2>
          <pre style={{ color: '#aaa', fontSize: 12, maxWidth: 800, overflow: 'auto' }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <MoleculeGraph />
        <SideMenu />
        <NodeDetailPanel />
        <TimelineSlider />
        <HelpButton />
      </div>
    </ErrorBoundary>
  )
}
