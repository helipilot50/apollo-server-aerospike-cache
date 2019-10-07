var { expect } = require('chai');
var { AerospikeCache } = require('../src/AerospikeCache');

describe('AerospikeCache', () => {
    let asCache;

    before(() => {
        asCache = new AerospikeCache(
            'test',
            'entity-cache',
            'cache-value',
            300,
            {
                hosts: [
                    { addr: "localhost", port: 3000 }
                ]
            });
    });

    it('should have instance', async () => {
        expect(asCache).to.be.not.null;
    });

    it('should put', async () => {
        asCache.put('cats-1234',
            {
                pi: 3.14159,
                name: 'cats'
            });
    });

    it('should get', async () => {
        expect(asCache.get('cats-1234')).to.be.not.null;
    });

    it('should delete', async () => {
        expect(asCache.delete('cats-1234')).to.be.true;
    });
});