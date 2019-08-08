import aerospike from 'aerospike';
// const aerospike = require('aerospike');

export default class AerospikeCache {

  constructor(conf) {
    const { cluster, namespace, set, defaultTTL, valueBinName } = conf;
    this.namespace = namespace;
    this.set = set;
    this.meta = { ttl: defaultTTL };
    this.valueBinName = valueBinName;
    
    return (async () => {
      this.client = await aerospike.connect(cluster);
      return this; 
    })();
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

  async flush() {
    var scan = client.scan(this.namespace, this.set)
    scan.concurrent = true;
    scan.nobins = true;

    var recordCount = 0
    var stream = scan.foreach()
    stream.on('data', function (record) {
      this.client.remove(record.key.digest);
      recordCount++
      if (recordCount % 1000 === 0) {
        console.log('%d records deleted', recordCount)
      }
    })
    stream.on('error', function (error) {
      console.error('Error while deleting: %s [%d]', error.message, error.code)
    })
    stream.on('end', function () {
      console.log('Total records deleted: %d', recordCount)
    })
  }

  async close() {
    await this.client.close();
    return;
  }
}
