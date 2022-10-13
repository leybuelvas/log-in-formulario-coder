import knex from 'knex';

const sqliteOptions = {
    client: 'sqlite3',
    connection: {
        filename: '../database/ecommerce.sqlite'
    },
    useNullAsDefault: true,
}

const mariaDBOptions = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user:'root',
        password: '',
        database: 'mibase'
    }
}
  
let db = knex(mariaDBOptions);

try {
    let exists = await db.schema.hasTable('products');
    if(exists) {
        //Persistencia
        // await db('products').del();
    }
    else {
        await db.schema.createTable('products', table => {
            table.increments('id');
            table.string('title');
            table.string('thumbnail');
            table.float('price');
        })
        .then(() => console.log("Tabla products creada."))
        .catch(err => { console.log(err); throw err; });
    }
}catch(error) {
    console.log(error);
}

try {
    let exists = await db.schema.hasTable('chat');
    if(exists) {
        //Persistencia
        //  await db('chat').del();
    }
    else {
        await db.schema.createTable('chat', table => {
            table.increments('id');
            table.string('email',50);
            table.string('message',300);
            table.string('date',30);
        })
        .then(() => console.log("Tabla chat creada."))
        .catch(err => { console.log(err); throw err; });
    }
}catch(error) {
    console.log(error);
}
export default db;