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
const sgo2 =  new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'sgo2',
    port: '5432'
});
const venus =  new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'venus',
    port: '5432'
});
const urano =  new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'urano',
    port: '5432'
});
const saturno =  new Pool({
    user: 'postgres',
    host: '18.224.41.166',
    password: 'Hj12JbncBg',
    database: 'gruposaesa',
    port: '5432'
});

module.exports = {controlchile,control,sgochile,sgo2,venus,saturno,urano};