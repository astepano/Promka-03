import axios from 'axios'
import { getMockGraph, NODE_DETAILS } from '../mocks/graphData.js'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
})

export async function getGraph(date, scenario) {
  if (!import.meta.env.VITE_API_URL) {
    // Используем моковые данные пока нет бекенда
    return getMockGraph(date, scenario)
  }
  const { data } = await client.get('/api/graph', { params: { date, scenario } })
  return data
}

export async function getNodeDetail(id) {
  if (!import.meta.env.VITE_API_URL) {
    return { markdown: NODE_DETAILS[id] || `## Узел ${id}\n\nДетальная информация недоступна.` }
  }
  const { data } = await client.get(`/api/nodes/${id}`)
  return data
}
