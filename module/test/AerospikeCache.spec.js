var { expect } = require('chai');
var AerospikeCache = require('../src/AerospikeCache');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

describe('AerospikeCache', () => {
    let asCache;

    before(() => {
        asCache = new AerospikeCache(

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
        );
    });

    it('should have instance', async () => {
        expect(asCache).to.be.not.null;
    });

    it('can do a basic get and set', async () => {
        await asCache.set('hello', 'world');
        expect(await asCache.get('hello')).to.equal('world');
        expect(await asCache.get('missing')).to.be.undefined;
    });

    it('can do a basic set and delete', async () => {
        await asCache.set('hello', 'world');
        expect(await asCache.get('hello')).to.equal('world');
        await asCache.delete('hello');
        expect(await asCache.get('hello')).to.be.undefined;
    });

    it('is able to expire keys based on ttl', async () => {
        await asCache.set('short', 's', { ttl: 1 });
        await asCache.set('long', 'l', { ttl: 5 });
        expect(await asCache.get('short')).to.equal('s');
        expect(await asCache.get('long')).to.equal('l');
        await sleep(3000);
        expect(await asCache.get('short')).to.be.undefined;
        expect(await asCache.get('long')).to.equal('l');
        await sleep(4000);
        expect(await asCache.get('short')).to.beundefined;;
        expect(await asCache.get('long')).to.beundefined;;
      });
});