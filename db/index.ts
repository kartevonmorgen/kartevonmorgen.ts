import sqlite3 from 'sqlite3'


const DB_PATH = `./db/${process.env.DB_NAME}`


let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log(`connected to db: ${DB_PATH}`)
    db.run(`CREATE TABLE tag_frequency (
            tag VARCHAR NOT NULL,
            frequency INTEGER,
            PRIMARY KEY (tag)
            )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          const insert = 'INSERT INTO tag_frequency (tag, frequency) VALUES (?,?)'
          db.run(insert, ['testfromfront', 1])
        }
      })
  }
})


export default db