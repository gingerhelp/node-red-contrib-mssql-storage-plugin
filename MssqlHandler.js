/* eslint-disable no-await-in-loop */
const when = require('when');
const Promise = when.promise;
const sql = require('mssql');

const MssqlHandler = class MssqlHandler {
  constructor(sqlConfig) {
    this.sqlConfig = sqlConfig;
    this.connectionPool = null;
  }

  connect() {
    return Promise((resolve, reject) => {
      try {
        this.connectionPool = new sql.ConnectionPool(this.sqlConfig).connect();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  findAll(tableName) {
    return Promise(async (resolve, reject) => {
      await this.connectionPool
        .then(pool => pool.request().query(`SELECT JsonData FROM ${tableName}`))
        .then(result => {
          if (result.recordset.length > 0) {
            resolve(JSON.parse(result.recordset[0].JsonData));
          } else {
            resolve([]);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  saveAll(tableName, objects) {
    return Promise(async (resolve, reject) => {
      try {
        await this.connectionPool
          .then(pool => {
            pool.request().query(`DELETE FROM ${tableName}`);
            pool
              .request()
              .input('JsonData', sql.NVarChar, JSON.stringify(objects))
              .query(`INSERT INTO ${tableName} (JsonData) VALUES (@JsonData)`);
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  findLibraryEntry(tableName, type, path) {
    return Promise(async (resolve, reject) => {
      try {
        this.connectionPool
          .then(pool =>
            pool
              .request()
              .input('Type', sql.NVarChar, type)
              .query(`SELECT * FROM ${tableName} WHERE [Type] = @Type`)
          )
          .then(result => {
            const returnStructure = [];
            for (let i = 0; i < result.recordset.length; i += 1) {
              const entry = result.recordset[i];

              if (entry.Path.indexOf('/') === -1 && path === '') {
                returnStructure.push({
                  fn: entry.Path,
                  meta: entry.Meta,
                  body: entry.JsonData
                });
              } else if (path === '') {
                returnStructure.push(entry.Path.split('/')[0]);
              } else if (entry.Path.indexOf(path) !== -1) {
                const subpath = entry.Path.split(path)[1];
                if (subpath.indexOf('/') === -1) {
                  returnStructure.push({
                    fn: subpath,
                    meta: entry.Meta,
                    body: entry.JsonData
                  });
                } else {
                  for (let x = 0; x < subpath.split('/').length - 1; x += 1) {
                    returnStructure.push(subpath.split('/')[x]);
                  }
                }
              }
            }
            resolve(returnStructure);
          })
          .catch(err => {
            reject(err);
          });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  saveLibraryEntry(tableName, type, path, meta, body) {
    return Promise((resolve, reject) => {
      try {
        this.connectionPool
          .then(pool => {
            pool
              .request()
              .input('Type', sql.NVarChar, type)
              .input('Path', sql.NVarChar, path)
              .query(
                `DELETE FROM ${tableName} WHERE [Type] = @Type AND Path = @Path`
              );
            pool
              .request()
              .input('Type', sql.NVarChar, type)
              .input('Path', sql.NVarChar, path)
              .input('Meta', sql.NVarChar, JSON.stringify(meta))
              .input('JsonData', sql.NVarChar, body)
              .query(
                `INSERT INTO ${tableName} ([Type], Path, Meta, JsonData) VALUES (@Type, @Path, @Meta, @JsonData)`
              );
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } catch (ex) {
        reject(ex);
      }
    });
  }
};

module.exports = MssqlHandler;
