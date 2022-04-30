import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import http from 'http'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { reset, list, add, toggle } from '../interface/mysql.js'

const app = express()
app.use(cors())
app.get('/', (_, response) => response.send('GraphQL running under /graphql.'))
const httpServer = http.createServer(app)

const typeDefs = gql`
  type Task {
    id: ID!
    name: String!
    done: Boolean!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    addTask(name: String!): Task
    setTaskDone(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    tasks: async () => await list(),
  },
  Mutation: {
    addTask: async (_, { name }) => {
      return add(name)
    },
    setTaskDone: async (_, { id }) => {
      return toggle(id)
    },
  },
}

const startApolloServer = async (app, httpServer) => {
  // await reset()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    debug: true,
    plugins: [
      // ApolloServerPluginDrainHttpServer({ httpServer }), // No effect noticed.
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })
}

await startApolloServer(app, httpServer)

export default httpServer
