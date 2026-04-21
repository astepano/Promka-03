import { Slider, Radio } from 'antd'
import useMoleculeStore from '../../store/useMoleculeStore.js'
import './TimelineSlider.css'

// Временные точки: Dec 2025 → Apr 2026
const TIME_POINTS = [
  { label: 'Дек. 2025 г.', value: '2025-12-01' },
  { label: 'Янв. 2026 г.', value: '2026-01-01' },
  { label: 'Фев. 2026 г.', value: '2026-02-01' },
  { label: 'Март 2026 г.', value: '2026-03-01' },
  { label: 'Апр. 2026 г.', value: '2026-04-01' },
]

const SCENARIO_OPTIONS = [
  { label: 'Пессимистичный', value: 'pessimistic' },
  { label: 'Нейтральный',    value: 'neutral' },
  { label: 'Оптимистичный',  value: 'optimistic' },
]

export default function TimelineSlider() {
  const currentDate = useMoleculeStore(s => s.currentDate)
  const scenario    = useMoleculeStore(s => s.scenario)
  const setDate     = useMoleculeStore(s => s.setDate)
  const setScenario = useMoleculeStore(s => s.setScenario)

  const currentIndex = TIME_POINTS.findIndex(p => p.value === currentDate)
  const sliderValue  = currentIndex >= 0 ? currentIndex : TIME_POINTS.length - 1

  const marks = Object.fromEntries(
    TIME_POINTS.map((p, i) => [i, { label: <span className="timeline-mark">{p.label}</span> }])
  )

  const handleSliderChange = (val) => {
    const point = TIME_POINTS[val]
    if (point) setDate(point.value)
  }

  return (
    <div className="timeline-panel">
      <div className="timeline-scenario">
        <span className="timeline-label">Прогноз:</span>
        <Radio.Group
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          size="small"
        >
          {SCENARIO_OPTIONS.map(opt => (
            <Radio.Button
              key={opt.value}
              value={opt.value}
              className={`scenario-btn scenario-${opt.value}`}
            >
              {opt.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Slider
        min={0}
        max={TIME_POINTS.length - 1}
        value={sliderValue}
        marks={marks}
        step={1}
        tooltip={{ formatter: (v) => TIME_POINTS[v]?.label }}
        onChange={handleSliderChange}
        className="timeline-slider"
      />
    </div>
  )
}
