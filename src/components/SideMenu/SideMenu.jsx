import { Button, Menu, Drawer } from 'antd'
import useMoleculeStore from '../../store/useMoleculeStore.js'
import './SideMenu.css'

const MENU_ITEMS = {
  finance: [
    { key: 'overview',   label: 'Обзор финансов' },
    { key: 'cashflow',   label: 'Денежные потоки' },
    { key: 'budget',     label: 'Бюджет' },
    { key: 'forecast',   label: 'Прогноз' },
  ],
  data: [
    { key: 'structure',  label: 'Оргструктура' },
    { key: 'projects',   label: 'Проекты' },
    { key: 'contractors',label: 'Контрагенты' },
    { key: 'kpi',        label: 'KPI / Метрики' },
  ],
}

export default function SideMenu() {
  const sideMenuOpen    = useMoleculeStore(s => s.sideMenuOpen)
  const activeMenuTab   = useMoleculeStore(s => s.activeMenuTab)
  const toggleSideMenu  = useMoleculeStore(s => s.toggleSideMenu)
  const setActiveMenuTab = useMoleculeStore(s => s.setActiveMenuTab)

  const items = MENU_ITEMS[activeMenuTab] || []

  return (
    <>
      {/* Фиксированные кнопки слева */}
      <div className="side-buttons">
        <Button
          className={activeMenuTab === 'finance' && sideMenuOpen ? 'active' : ''}
          onClick={() => setActiveMenuTab('finance')}
        >
          Ф
        </Button>
        <Button
          className={activeMenuTab === 'data' && sideMenuOpen ? 'active' : ''}
          onClick={() => setActiveMenuTab('data')}
        >
          Д
        </Button>
      </div>

      {/* Выдвижная боковая панель */}
      <Drawer
        title={activeMenuTab === 'finance' ? 'Финансы' : 'Данные'}
        placement="left"
        open={sideMenuOpen}
        onClose={toggleSideMenu}
        mask={false}
        width={220}
        className="side-drawer"
      >
        <Menu
          mode="inline"
          theme="dark"
          items={items}
          style={{ background: 'transparent', border: 'none' }}
        />
      </Drawer>
    </>
  )
}
