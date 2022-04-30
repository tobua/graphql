import { createConnection, escape } from 'mysql2/promise'

// Destructuring connection will cause issues.
const connection = await createConnection({
  host: 'v148573.kasserver.com',
  user: 'd03999ef',
  password: process.env.PASSWORD,
  database: 'd03999ef',
})

export const reset = async () => {
  await connection.query('DELETE FROM tasks')
  await connection.query(
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape('First task.')}, false);`
  )
  await connection.query(
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape('Second task.')}, true);`
  )
}

export const list = async () => {
  const [result] = await connection.query('SELECT * FROM tasks')
  return result
}

export const add = async (name) => {
  const [result] = await connection.query(
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape(name)}, false);`
  )
  return {
    id: result.insertId,
    name,
    done: false,
  }
}

export const toggle = async (id) => {
  await connection.query(`UPDATE tasks SET done = true WHERE id=${escape(id)}`)
  return true
}
