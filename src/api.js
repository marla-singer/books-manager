export const FIREBASE_DATABASE = 'https://books-manager-f8c37.firebaseio.com'
export const COLLECTION = 'library'
const headers = { 'Content-Type': 'application/json'}

// GET FIREBASE_DATABASE/COLLECTION.json -- return whole collection data

// PATCH FIREBASE_DATABASE/COLLECTION/book.id.json -- create/edit the book data
// body -- json (book data)

export const allBooks = () =>
  fetch(`${FIREBASE_DATABASE}/${COLLECTION}.json`)
    .then(r => r.json()).then(books => Object.values(books))

export const upsertBook = (book) =>
  fetch(`${FIREBASE_DATABASE}/${COLLECTION}/${book.id}.json`, {method: 'PATCH', body: JSON.stringify(book)})
    .then(r => r.json())


