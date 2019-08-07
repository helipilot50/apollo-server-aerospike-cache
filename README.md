# Apollo Server cache using Aerospike
This package exports an implementation of KeyValueCache that allows using Aerospike as a backing store for resource caching in [Apollo Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/).

## Usage

```javascript
const { AerospikeCache } = require('apollo-server-cache-aerospike');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new AerospikeCache({
    namespace: 'test',
    set: 'apollo-cache',
    valueBinName: 'cache-value',
    defaultTTL: 300,
    cluster: {
      hosts: [
        { addr: "127.0.0.1", port: 3000 }
      ],
      log: {
        level: aerospike.log.INFO
      }
    }
  }),
  dataSources: () => ({
    moviesAPI: new MoviesAPI(),
  }),
});
```
