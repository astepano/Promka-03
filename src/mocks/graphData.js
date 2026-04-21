// Базовый граф — оптимистичный сценарий
const baseNodes = [
  { id: 'company',     label: 'Ф',   type: 'company',    val: 50, color: '#2d9c2d' },
  { id: 'budget',      label: 'Б',   type: 'budget',     val: 18, color: '#3ab83a' },
  { id: 'project1',   label: 'П1',  type: 'project',    val: 30, color: '#e07b00' },
  { id: 'project2',   label: 'П2',  type: 'project',    val: 22, color: '#e07b00' },
  { id: 'manager',    label: 'М',   type: 'manager',    val: 16, color: '#c97fd4' },
  { id: 'resource',   label: 'Р',   type: 'resource',   val: 14, color: '#cc2a2a' },
  { id: 'contractor1',label: 'Пр1', type: 'contractor', val:  8, color: '#8b6b5a' },
  { id: 'contractor2',label: 'Пр2', type: 'contractor', val:  8, color: '#8b6b5a' },
  { id: 'account',    label: 'Сн',  type: 'account',    val: 12, color: '#7b5fc0' },
  // сателлиты вокруг компании
  { id: 'sat1',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat2',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat3',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat4',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat5',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat6',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat7',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat8',  label: '', type: 'satellite', val: 4, color: '#f5c518' },
  { id: 'sat9',  label: '', type: 'satellite', val: 3, color: '#f5c518' },
  { id: 'sat10', label: '', type: 'satellite', val: 3, color: '#f5c518' },
  { id: 'sat11', label: '', type: 'satellite', val: 3, color: '#f5c518' },
]

const baseLinks = [
  { source: 'company',  target: 'budget',      value: 1000000,  label: '1 000 000 Р' },
  { source: 'company',  target: 'project1',    value: 10000000, label: '10 000 000 Р' },
  { source: 'company',  target: 'project2',    value: 9000000,  label: '9 000 000 Р' },
  { source: 'company',  target: 'manager',     value: 1000000,  label: '1 000 000 Р' },
  { source: 'company',  target: 'resource',    value: 42000000, label: '42 000 000 Р' },
  { source: 'company',  target: 'account',     value: 6000000,  label: '6 000 000 Р' },
  { source: 'resource', target: 'contractor1', value: 500000,   label: '500 000 Р' },
  { source: 'resource', target: 'contractor2', value: 500000,   label: '500 000 Р' },
  { source: 'budget',   target: 'project2',    value: 3000000,  label: '3 000 000 Р' },
  // сателлиты
  { source: 'company', target: 'sat1',  value: 0, label: '' },
  { source: 'company', target: 'sat2',  value: 0, label: '' },
  { source: 'company', target: 'sat3',  value: 0, label: '' },
  { source: 'company', target: 'sat4',  value: 0, label: '' },
  { source: 'company', target: 'sat5',  value: 0, label: '' },
  { source: 'company', target: 'sat6',  value: 0, label: '' },
  { source: 'company', target: 'sat7',  value: 0, label: '' },
  { source: 'company', target: 'sat8',  value: 0, label: '' },
  { source: 'company', target: 'sat9',  value: 0, label: '' },
  { source: 'company', target: 'sat10', value: 0, label: '' },
  { source: 'company', target: 'sat11', value: 0, label: '' },
]

// Множители для сценариев
const SCENARIO_MULTIPLIERS = {
  pessimistic: 0.6,
  neutral:     1.0,
  optimistic:  1.4,
}

// Прогрессия по времени: чем позже дата, тем крупнее показатели
function getDateMultiplier(dateStr) {
  const start = new Date('2025-12-01').getTime()
  const end   = new Date('2026-04-01').getTime()
  const cur   = new Date(dateStr).getTime()
  const t = Math.max(0, Math.min(1, (cur - start) / (end - start)))
  return 0.5 + t * 0.7
}

export function getMockGraph(date = '2026-04-01', scenario = 'optimistic') {
  const sm = SCENARIO_MULTIPLIERS[scenario] ?? 1
  const dm = getDateMultiplier(date)
  const k  = sm * dm

  const nodes = baseNodes.map(n => ({
    ...n,
    val: n.type === 'satellite' ? n.val : Math.round(n.val * k),
  }))

  const links = baseLinks.map(l => ({
    ...l,
    value: Math.round(l.value * k),
    label: l.value > 0
      ? `${Math.round(l.value * k / 1000000).toLocaleString('ru-RU')} 000 000 Р`
      : '',
  }))

  return { nodes, links }
}

// Детали узла (для панели)
export const NODE_DETAILS = {
  company: `## Фонд (Ф)\n\nЦентральный узел компании. Управляет всеми финансовыми потоками.\n\n**Ключевые метрики:**\n- Оборот: 69 000 000 Р\n- Проектов активных: 2\n- Контрагентов: 2`,
  budget:  `## Бюджет (Б)\n\nОперационный бюджет компании.\n\n**Статус:** в норме\n- Выделено: 1 000 000 Р\n- Использовано: 650 000 Р`,
  project1:`## Проект П1\n\nОсновной производственный проект.\n\n**Срок:** Q1 2026\n- Финансирование: 10 000 000 Р\n- Готовность: 72%`,
  project2:`## Проект П2\n\nВспомогательный проект развития.\n\n**Срок:** Q2 2026\n- Финансирование: 9 000 000 Р\n- Готовность: 45%`,
  manager: `## Менеджер (М)\n\nРуководитель проектов.\n\n- Проектов в ведении: 2\n- KPI: 87%`,
  resource:`## Ресурсы (Р)\n\nФонд оплаты труда и материальных ресурсов.\n\n- ФОТ: 42 000 000 Р\n- Эффективность: 94%`,
  contractor1:`## Подрядчик 1 (Пр1)\n\nВнешний исполнитель.\n\n- Договор: 500 000 Р\n- Статус: активен`,
  contractor2:`## Подрядчик 2 (Пр2)\n\nВнешний исполнитель.\n\n- Договор: 500 000 Р\n- Статус: активен`,
  account: `## Счёт / Дебиторка (Сн)\n\nДебиторская задолженность.\n\n- Сумма: 6 000 000 Р\n- Ожидаемое погашение: апрель 2026`,
}
