// @ts-check
const path = require('path');
const sqlite = require('sqlite');
const { Client } = require('pg');
const { assert } = require('chai');



describe('Row counts across sqlite and pg database are identical', () => {
  
  let sqdb;
  let pgdb;
  before(async () => {
    sqdb = await sqlite.open(path.join(__dirname, '..', 'master.sqlite'));
    pgdb = new Client({
      host: 'localhost',
      port: 5432,
      database: 'nw_postgresql',
      user: 'northwind_user',
      password: 'thewindisblowing'
    });
    await pgdb.connect();
  });
  function validateEquivalentResult(query, valueextractor) {
    it(query, async () => {
      let sqliteResult = await sqdb.all(query);
      let pgResult = await pgdb.query(query)
      assert.equal(valueextractor(sqliteResult[0]), valueextractor(pgResult.rows[0]));
    });
  }

  validateEquivalentResult('SELECT count(id) as employee_count from Employee', (x) => x.employee_count);
  validateEquivalentResult('SELECT count(id) as customer_count from Customer', (x) => x.customer_count);
  validateEquivalentResult('SELECT count(id) as product_count from Product', (x) => x.product_count);
  validateEquivalentResult('SELECT count(id) as order_count from "order"', (x) => x.order_count);
  validateEquivalentResult('SELECT count(id) as od_count from OrderDetail', (x) => x.od_count);
  validateEquivalentResult('SELECT count(id) as supplier_count from Supplier', (x) => x.supplier_count);
  validateEquivalentResult('SELECT count(id) as region_count from Region', (x) => x.region_count);
  validateEquivalentResult('SELECT count(id) as shipper_count from Shipper', (x) => x.shipper_count);
  validateEquivalentResult('SELECT count(id) as category_count from Category', (x) => x.category_count);
  validateEquivalentResult('SELECT count(id) as territory_count from EmployeeTerritory', (x) => x.territory_count);
});