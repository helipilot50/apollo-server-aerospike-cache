
                                                      
                                                          
# Apollo Server cache using Aerospike
This package exports an implementation of KeyValueCache using Aerospike as the cache for resource caching in [Apollo Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/).

[![Build Status](https://cloud.drone.io/api/badges/helipilot50/apollo-server-aerospike-cache/status.svg)](https://cloud.drone.io/helipilot50/apollo-server-aerospike-cache)

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
