import { ApolloServer, gql } from 'apollo-server-express'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core'
import http from 'http'
import express from 'express'
import cors from 'cors'

// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
// https://vercel.com/guides/using-express-with-vercel#standalone-express
// https://github.com/stephanepericat/apollo-server-vercel/blob/master/api/index.js

const app = express()
app.use(cors())
app.use(express.json())
const httpServer = http.createServer(app)

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const startApolloServer = async (app, httpServer) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    debug: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })
}

startApolloServer(app, httpServer)

export default httpServer
