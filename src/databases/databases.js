const { Pool } = require('pg');

const controlchile = new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'controlchile',
    port: '5432'
});

const control = new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'control',
    port: '5432'
});
const sgochile = new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'sgochile',
    port: '5432'
});


module.exports = {controlchile,control,sgochile};