import { expect } from 'chai';
import AerospikeCache from '../src/AerospikeCache';

describe('AerospikeCache', () => {
    let asCache;

    before(() => {
        asCache = new AerospikeCache({
            namespace: 'test',
            set: 'entity-cache',
            valueBinName: 'cache-value',
            defaultTTL: 300,
            cluster: {
                hosts: [
                    {
                        "addr": "localhost",
                        "port": 3000
                    }
                ],
                log: {
                    level: aerospike.log.INFO
                }
            }
        });
    });
    it('should have instance', async () => {
        expect(asCache).to.be.not.null;
    });
});