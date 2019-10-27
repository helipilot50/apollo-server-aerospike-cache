const Aerospike = require('aerospike');
export default class ApolloCacheAerospike {

  constructor(options) {
    this.options = options;
    this.hits = 0;
    this.misses = 0;
  }

  async asClient() {
    if (this.client == null)
      this.client = await Aerospike.connect(this.options.cluster);
    return this.client;

  }

  makeKey(key) {
    return new Aerospike.Key(this.options.namespace, this.options.set, key)
  }

  async set(
    key,
    data,
    options
  ) {
    const client = await this.asClient();
    let bins = {};
    bins[this.valueBinName] = data;
    let meta;
    if (options && options.ttl)
      meta = { ttl: options.ttl };
    else
      meta = this.meta;
    await client.put(this.makeKey(key), bins, meta);
    return;

  }

  async get(key) {
    try {
      const client = await this.asClient();
      let record = await client.get(this.makeKey(key));
      this.hits += 1;
      return record.bins[this.valueBinName];
    } catch (err) {
      if (err.code === Aerospike.status.ERR_RECORD_NOT_FOUND)
        this.misses += 1;
      return;
      throw err;
    }
  }

  async delete(key) {
    try {
      const client = await this.asClient();
      await client.remove(this.makeKey(key));
      return true;
    } catch (err) {
      if (err.code === Aerospike.status.ERR_RECORD_NOT_FOUND)
        return true;
      throw err;
    }
  }

  async flush() {
    const client = await this.asClient();
    var scan = await client.scan(this.namespace, this.set)
    scan.concurrent = true;
    scan.nobins = true;

    var recordCount = 0
    var stream = scan.foreach()
    stream.on('data', (record) => {
      client.remove(record.key.digest);
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

