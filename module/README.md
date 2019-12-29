[![npm package](https://img.shields.io/badge/npm%20package-0.5.1-brightgreen.svg)](https://www.npmjs.com/package/apollo-server-cache-aerospike)
                                                   
                                                          
# Apollo Server cache using Aerospike
This package exports an implementation of KeyValueCache using Aerospike as the cache for resource caching in [Apollo Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/).

## Usage

```javascript
const { ApolloCacheAerospike } = require('apollo-server-cache-aerospike');
const responseCachePlugin = require ('apollo-server-plugin-response-cache');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new ApolloCacheAerospike(
    {
      namespace: 'test',
      set: 'entity-cache',
      valueBinName: 'cache-value',
      cluster: {
        hosts: [
          { addr: "localhost", port: 3000 }
        ]
      }
    }
  ),
  cacheControl: {
    defaultMaxAge: 30,
  },
  plugins: [responseCachePlugin()],
  dataSources: () => ({
    moviesAPI: new MoviesAPI(),
  }),
});
```
# 
