import { useState } from 'react'
import { Button, Modal } from 'antd'
import './HelpButton.css'

const HELP_TEXT = `
**Управление графом**
- Вращение: зажмите левую кнопку мыши и перетащите
- Масштаб: колёсико мыши
- Перемещение: зажмите правую кнопку мыши

**Узлы**
- Кликните на любой узел, чтобы увидеть детальную информацию
- Размер узла отражает величину финансового потока
- Цвет узла — тип сущности (компания, проект, ресурс и т.д.)

**Рёбра**
- Толщина ребра пропорциональна сумме потока
- Движущиеся точки показывают направление потока
- Подпись — сумма в рублях

**Временная шкала**
- Перетащите слайдер, чтобы изменить отображаемый период
- Переключайте сценарии: Пессимистичный / Нейтральный / Оптимистичный

**Боковое меню**
- Кнопка Ф — финансовый раздел
- Кнопка Д — данные и структура
`

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className="help-btn"
        shape="circle"
        onClick={() => setOpen(true)}
      >
        ?
      </Button>

      <Modal
        title="Справка — Молекула Бизнеса"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="help-modal"
      >
        <div className="help-content">
          {HELP_TEXT.trim().split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**'))
              return <h4 key={i}>{line.replace(/\*\*/g, '')}</h4>
            if (line.startsWith('- '))
              return <p key={i} className="help-item">• {line.slice(2)}</p>
            if (line === '')
              return <br key={i} />
            return <p key={i}>{line}</p>
          })}
        </div>
      </Modal>
    </>
  )
}
