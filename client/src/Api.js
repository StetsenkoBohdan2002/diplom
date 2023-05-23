import axios from 'axios'

export function createNewQuery(data) {
  return axios.post('http://localhost:3000/api/queries', data)
}
export function getSavedQueries() {
  return axios.get('http://localhost:3000/api/queries')
}
export function getData(data) {
  return axios.post('http://localhost:3000/api/queries/data', data)
}
export function deleteSavedQuery(id) {
  return axios.delete(`http://localhost:3000/api/queries/data/${id}`)
}
export function getDatabaseList() {
  return axios.get(`http://localhost:3000/api/queries/databases-list`)
}
export function getLabelsList(collectionName) {
  return axios.get(
    `http://localhost:3000/api/queries/labels-list/${collectionName}`
  )
}
