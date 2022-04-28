import { ApolloServer, gql } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
// https://vercel.com/guides/using-express-with-vercel#standalone-express

const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  debug: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

export default server.createHandler()
