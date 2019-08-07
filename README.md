```
 _    _            _      _                                                 
| |  | |          | |    (_)                                                
| |  | | ___  _ __| | __  _ _ __    _ __  _ __ ___   __ _ _ __ ___  ___ ___ 
| |/\| |/ _ \| '__| |/ / | | '_ \  | '_ \| '__/ _ \ / _` | '__/ _ \/ __/ __|
\  /\  / (_) | |  |   <  | | | | | | |_) | | | (_) | (_| | | |  __/\__ \__ \
 \/  \/ \___/|_|  |_|\_\ |_|_| |_| | .__/|_|  \___/ \__, |_|  \___||___/___/
                                   | |               __/ |                  
                                   |_|              |___/                   
______ _____   _   _ _____ _____   _   _ _____ _____                        
|  _  \  _  | | \ | |  _  |_   _| | | | /  ___|  ___|                       
| | | | | | | |  \| | | | | | |   | | | \ `--.| |__                         
| | | | | | | | . ` | | | | | |   | | | |`--. \  __|                        
| |/ /\ \_/ / | |\  \ \_/ / | |   | |_| /\__/ / |___                        
|___/  \___/  \_| \_/\___/  \_/    \___/\____/\____/                        
                                                                            
```                                                          
                                                          
# Apollo Server cache using Aerospike
This package exports an implementation of KeyValueCache using Aerospike as the cache for resource caching in [Apollo Data Sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/).

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
