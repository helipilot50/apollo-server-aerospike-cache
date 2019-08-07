import { KeyValueCache } from 'apollo-server-caching';
import  aerospike from 'aerospike';


export class AerospikeCache implements KeyValueCache {

  constructor(conf) {
    const { cluster, namespace, set, defaultTTL, valueBinName } = conf;
    this.namespace = namespace;
    this.set = set;
    this.meta = { ttl: defaultTTL};
    this.valueBinName = valueBinName;
    this.client = await aerospike.connect(cluster);
  }
  
  makeKey(key) {
    return new Aerospike.Key(this.namespace, this.set, key)
  }

  async set(
    key, // string 
    data, // string
    options, // { ttl: number }
  ) {
    let bins = {}
    bins[this.valueBinName] = data;
    let meta;
    if (options.ttl)
      meta = { ttl: options.ttl };
    else
      meta = this.meta;
    await this.client.put(makeKey(key), bins, meta);
    return;
  }

  async get(key) {
    let record = await this.client.get(makeKey(key));
    return record.bins[this.valueBinName];
  }

  async delete(key) {
    this.client.remove(makeKey(key));
    return true;
  }

  async flush(): {
    var scan = client.scan('test', 'demo')
scan.concurrent = true
scan.nobins = false

var recordCount = 0
var stream = scan.foreach()
stream.on('data', function (record) {
  recordCount++
  if (recordCount % 1000 === 0) {
    console.log('%d records scanned', recordCount)
  }
})
stream.on('error', function (error) {
  console.error('Error while scanning: %s [%d]', error.message, error.code)
})
stream.on('end', function () {
  console.log('Total records scanned: %d', recordCount)
})
  }

  async close() {
    await this.client.close();
    return;
  }
}
