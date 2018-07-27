// ================================
// PUERTO  
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// ENTORNO  
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// VENCIMIENTO TOKEN
// ================================
// 60 seg
// 60 min
// 24 hs
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h';

// ================================
// SEED de autenticación 
// ================================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

// ================================
// BASE DE DATOS  
// ================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGOURI;
}

process.env.URLDB = urlDB;

// ================================
// GOOGLE CLIENT_ID  
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '152091183439-42b3spfk513jf6ksc8qaogl6afccd8na.apps.googleusercontent.com';