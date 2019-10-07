const Aerospike = require('aerospike');
class AerospikeCache {
  
  constructor(options) {
    this.namespace = options.namespace;
    this.setname = options.set;
    this.meta = { ttl: options.defaultTTL };
    this.valueBinName = options.valueBinName;
    this.cluster = options.cluster;

    return (async () => {
      this.client = await Aerospike.connect(this.cluster);
      return this;
    })();
  }

  makeKey(key) {
    console.log(`.....makeKey ${key}`)
    return new Aerospike.Key(this.namespace, this.set, key)
  }

  async set(
    key,
    data,
    options
  ) {
    console.log(`.....set ${key}:${data}`);
    let bins;
    bins[this.valueBinName] = data;
    let meta;
    if (options && options.ttl)
      meta = { ttl: options.ttl };
    else
      meta = this.meta;
    await this.client.put(this.makeKey(key), bins, meta);
    return;
  }

  async get(key) {
    console.log(`.....get ${key}`);
    let record = await this.client.get(this.makeKey(key));
    return record.bins[this.valueBinName];
  }

  async delete(key) {
    console.log(`.....delete ${key}`);
    await this.client.remove(this.makeKey(key));
    return true;
  }

  async flush() {
    console.log(`.....flush`);
    var scan = this.client.scan(this.namespace, this.set)
    scan.concurrent = true;
    scan.nobins = true;

    var recordCount = 0
    var stream = scan.foreach()
    stream.on('data', (record) => {
      this.client.remove(record.key.digest);
      recordCount++
      if (recordCount % 1000 === 0) {
        console.log('%d records deleted', recordCount)
      }
    })
    stream.on('error', (error) => {
      console.error('Error while deleting: %s [%d]', error.message, error.code)
    })
    stream.on('end', () => {
      console.log('Total records deleted: %d', recordCount)
    })
  }

  async close() {
    await this.client.close();
    return;
  }
}

module.exports = {
  AerospikeCache,
}