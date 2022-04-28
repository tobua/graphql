import server from './api/index.js'

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
