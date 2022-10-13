import db from '../options/configDB.js';

const dbController = {

  async getAll(table) {
    return await db(table).select('*');
  },

  async save(object, table) {
    return await db(table).insert(object);
  }
}

export default dbController;
