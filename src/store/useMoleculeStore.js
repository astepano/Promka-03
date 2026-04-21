import { create } from 'zustand'

const useMoleculeStore = create((set) => ({
  nodes: [],
  links: [],
  selectedNode: null,
  loading: false,
  error: null,

  // Временная шкала
  currentDate: '2026-04-01',
  scenario: 'optimistic', // 'pessimistic' | 'neutral' | 'optimistic'

  // Панели
  sideMenuOpen: false,
  detailPanelOpen: false,
  activeMenuTab: 'finance', // 'finance' | 'data'

  // Действия
  setGraphData: (nodes, links) => set({ nodes, links }),
  setSelectedNode: (node) => set({ selectedNode: node, detailPanelOpen: !!node }),
  closeDetailPanel: () => set({ detailPanelOpen: false, selectedNode: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDate: (date) => set({ currentDate: date }),
  setScenario: (scenario) => set({ scenario }),
  toggleSideMenu: () => set((s) => ({ sideMenuOpen: !s.sideMenuOpen })),
  setActiveMenuTab: (tab) => set({ activeMenuTab: tab, sideMenuOpen: true }),
}))

export default useMoleculeStore
