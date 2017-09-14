import queryBuilder from '../query_builder.es6';

describe('lib/query_builder', () => {

  describe('#queryBuilder', () => {

    it('converts a list of filters into a query for type string', () => {
      const filters = [
        { name: 'hmdmc', comparator: 'is', value: '123', type: 'string' },
        { name: 'hmdmc', comparator: 'is', value: '456', type: 'string' },
        { name: 'donor_id', comparator: 'is not', value: 'xyz', type: 'string' },
        { name: 'donor_id', comparator: 'is', value: 'zyx', type: 'string' }
      ]

      const result = JSON.stringify(queryBuilder(filters));
      expect(result).to.equal(
        `{"hmdmc":{"$in":["123","456"]},"donor_id":{"$nin":["xyz"],"$in":["zyx"]}}`
      );
    });

    it('converts a list of filters into a query for type date', () => {
      const filters = [
        { name: 'date_of_receipt', comparator: 'before', value: '10/01/15', type: 'date' },
        { name: 'date_of_receipt', comparator: 'after', value: '10/01/11', type: 'date' },
        { name: 'date_of_receipt', comparator: 'on', value: '10/01/13', type: 'date' },
      ]

      const result = JSON.stringify(queryBuilder(filters));
      const beforeDate = new Date(filters[0].value).toUTCString();
      const afterDate = new Date(filters[1].value).toUTCString();
      const onDate = new Date(filters[2].value).toUTCString();
      expect(result).to.equal(
        `{"date_of_receipt":{"$lt":["${beforeDate}"],"$gt":["${afterDate}"],"$in":["${onDate}"]}}`
     );
    });

    it('converts a list of filters into a query for type list', () => {
      const filters = [
        { name: 'material_type', comparator: 'is', value: 'dna', type: 'list'},
        { name: 'material_type', comparator: 'is not', value: 'blood', type: 'list'},
        { name: 'gender', comparator: 'is not', value: 'male', type: 'list' },
        { name: 'scientific_name', comparator: 'is not', value: 'Homo sapiens', type: 'list' },
      ]

      const result = JSON.stringify(queryBuilder(filters));
      expect(result).to.equal(
        `{"material_type":{"$in":["dna"],"$nin":["blood"]},"gender":{"$nin":["male"]},"scientific_name":{"$nin":["Homo sapiens"]}}`
      );
    });

    it('converts a list of filters into a query for type boolean', () => {
      const filters = [
        { name: 'available', comparator: 'equals', value: 'true', type: 'boolean'},
        { name: 'available', comparator: 'equals', value: 'false', type: 'boolean'},
      ]

      const result = JSON.stringify(queryBuilder(filters));
      expect(result).to.equal(
        `{"available":{"$in":[true,false]}}`
      );
    });

  })

})

