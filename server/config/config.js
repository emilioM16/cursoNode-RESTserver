// ================================
// PUERTO  
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// ENTORNO  
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// BASE DE DATOS  
// ================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb://cafe_user:cafenode18@ds147461.mlab.com:47461/cafe_node';
}

process.env.URLDB = urlDB;

