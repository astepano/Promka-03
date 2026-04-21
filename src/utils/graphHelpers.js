import * as THREE from 'three'
import SpriteText from 'three-spritetext'

// Минимальная и максимальная толщина рёбер
const LINK_WIDTH_MIN = 0.5
const LINK_WIDTH_MAX = 8

export function calcLinkWidth(value, maxValue) {
  if (!value || !maxValue) return LINK_WIDTH_MIN
  return LINK_WIDTH_MIN + (value / maxValue) * (LINK_WIDTH_MAX - LINK_WIDTH_MIN)
}

export function calcNodeSize(val) {
  return Math.max(4, val)
}

export function getNodeColor(type) {
  const map = {
    company:    '#2d9c2d',
    budget:     '#3ab83a',
    project:    '#e07b00',
    manager:    '#c97fd4',
    resource:   '#cc2a2a',
    contractor: '#8b6b5a',
    account:    '#7b5fc0',
    satellite:  '#f5c518',
  }
  return map[type] || '#888888'
}

// Three.js объект для узла
export function makeNodeObject(node) {
  const group = new THREE.Group()

  const radius = Math.max(3, node.val * 0.8)
  const geo    = new THREE.SphereGeometry(radius, 32, 32)
  const mat    = new THREE.MeshLambertMaterial({
    color: node.color || getNodeColor(node.type),
    transparent: true,
    opacity: 0.92,
  })
  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  // Текстовая метка поверх сферы (только для не-сателлитов)
  if (node.label) {
    const sprite = new SpriteText(node.label)
    sprite.color = '#ffffff'
    sprite.textHeight = Math.max(3, radius * 0.55)
    sprite.fontWeight = 'bold'
    group.add(sprite)
  }

  // Сохраняем радиус для расчёта столкновений
  node.__radius = radius
  return group
}

// Three.js объект для метки на ребре
export function makeLinkLabel(link) {
  if (!link.label) return null
  const sprite = new SpriteText(link.label)
  sprite.color = 'rgba(200,200,200,0.85)'
  sprite.textHeight = 2.8
  sprite.backgroundColor = 'rgba(0,0,0,0)'
  return sprite
}

// Цвет ребра по весу
export function getLinkColor(value, maxValue) {
  if (!value || !maxValue) return 'rgba(120,120,120,0.3)'
  const ratio = value / maxValue
  if (ratio > 0.5) return 'rgba(80,80,80,0.9)'
  if (ratio > 0.1) return 'rgba(100,100,100,0.7)'
  return 'rgba(140,140,140,0.4)'
}

export function getMaxLinkValue(links) {
  return Math.max(1, ...links.map(l => l.value || 0))
}
