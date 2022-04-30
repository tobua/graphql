import { createConnection, escape } from 'mysql2/promise'

const query = async (queries) => {
  // Destructuring connection will cause issues.
  const connection = await createConnection({
    host: 'v148573.kasserver.com',
    user: 'd03999ef',
    password: process.env.PASSWORD,
    database: 'd03999ef',
  })

  if (!Array.isArray(queries)) {
    queries = [queries]
  }

  let results = await Promise.all(queries.map((query) => connection.query(query)))

  results = results.map((result) => result[0])

  connection.end()

  if (results.length === 1) {
    return results[0]
  }

  return results
}

export const reset = () =>
  query([
    'DELETE FROM tasks',
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape('Learn about GraphQL')}, true)`,
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape('Party')}, false)`,
  ])

export const list = () => query('SELECT * FROM tasks')

export const add = async (name) => {
  const result = await query(
    `INSERT INTO \`tasks\` (\`name\`, \`done\`) VALUES (${escape(name)}, false);`
  )
  return {
    id: result.insertId,
    name,
    done: false,
  }
}

export const toggle = async (id) => {
  await query(`UPDATE tasks SET done = true WHERE id=${escape(id)}`)
  return true
}
