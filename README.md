[![npm version](https://badge.fury.io/js/apollo-server-aerospike-cache.svg)](https://badge.fury.io/js/apollo-server-aerospike-cache)
[![Build Status](https://circleci.com/gh/apollographql/apollo-server.svg?style=svg)](https://circleci.com/gh/apollographql/apollo-server)
                                                      
                                                          
# Apollo Server cache using Aerospike
This package exports an implementation of KeyValueCache using Aerospike as the cache for resource caching in [Apollo Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/).

## Usage

```javascript
const { ApolloServer } = require('apollo-server');
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
For documentation on the Aerospike cluster options bassed to the Aerocpike client, refer to [here](https://www.aerospike.com/docs/client/nodejs/usage/connect/)
