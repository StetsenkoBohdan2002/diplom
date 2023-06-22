import axios from 'axios'
/**
 * JavaScript файл, який містить набір функцій, що виконують HTTP-запити до сервера для отримання або надсилання даних.
 * @module Api
 */
/**
 * Зберігає новий запит, використовуючи передані дані. Він в свою чергу, може бути використаний повторно при необхідності.
 *
 * @param {Object} data - Дані для створення запиту.
 * @returns {Promise} - Об'єкт Promise, який повертається результатом POST-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function createNewQuery(data) {
  return axios.post('http://localhost:3000/api/queries', data)
}
/**
 * Функція, що повертає список збережених запитів для відображення в окремому розділі веб-сервісу.
 *
 * @returns {Promise} - Об'єкт Promise, який повертається результатом GET-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function getSavedQueries() {
  return axios.get('http://localhost:3000/api/queries')
}
/**
 * Функція, що повертає результат з бази даних відповідно до побудованого запиту.
 * @param {Array} data - Дані для створення операцій агрегування на стороні серверу та повернення результату відповідно до них.
 * @returns {Promise} - Об'єкт Promise, який повертається результатом POST-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function getData(data) {
  return axios.post('http://localhost:3000/api/queries/data', data)
}
/**
 * Функція, що видаляє збережений запит з бази даних.
 * @param {Number} id - Ідентифікатор збереженого запиту, по якому його буде видалено.
 * @returns {Promise} - Об'єкт Promise, який повертається результатом DELETE-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function deleteSavedQuery(id) {
  return axios.delete(`http://localhost:3000/api/queries/data/${id}`)
}
/**
 * Функція, що повертає список доступних колекцій з бази даних MongoDB, для відображення в інтерфейсі користувача.
 * @returns {Promise} - Об'єкт Promise, який повертається результатом GET-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function getDatabaseList() {
  return axios.get(`http://localhost:3000/api/queries/databases-list`)
}
/**
 * Функція, що повертає список доступних ієрархій полів з бази даних MongoDB, для відображення в інтерфейсі користувача.
 * @param {String} collectionName - Назва колекції, по якій буде відбуватися пошук для отримання ієрархій доступних полів.
 * @returns {Promise} - Об'єкт Promise, який повертається результатом GET-запиту.
 * @throws {Error} - Помилка, якщо сталася проблема під час відправлення запиту.
 */
export function getLabelsList(collectionName) {
  return axios.get(
    `http://localhost:3000/api/queries/labels-list/${collectionName}`
  )
}
