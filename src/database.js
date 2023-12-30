import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data  = this.#database[table] ?? []

    // if (search) {
    //   data = data.filter(row => {
    //     return Object.entries(search).some(([key, value]) => {
    //       return row[key].includes(value)
    //     })
    //   })
    // }

    return data
  }

  insert(table, data) {
    Array.isArray(this.#database[table])
    ? this.#database[table].push(data)
    : this.#database[table] = [data]

    this.#persist()

    return data
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id)

    if (index > -1) {
      const task = this.#database[table][index]

      Object.assign(task, data)
      task.updated_at = new Date()
      
      this.#database[table][index] = task
      this.#persist()
    }
  }

  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id)
    
    if (index > -1) {
      this.#database[table].splice(index, 1)
      this.#persist()
    }
  }

  complete(table, id) {
    const index = this.#database[table].findIndex(row => row,id === id)

    if (index > -1) {
      const task = this.#database[table][index]

      task.completed_at = new Date()

      this.#database[table][index] = task
      this.#persist()
    }
  }
}