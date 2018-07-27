const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


app.post('/producto', verificaToken, (req, res) => {
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoCreado) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.status(200).json({
            ok:true,
            productoCreado
        });
    });
});


app.get('/productos', (req, res)=>{
    let limite = req.query.limite || 5;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    limite = Number(limite);
    
    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre')
    .populate('categoria', 'descripcion')

    .exec((err, productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.status(200).json({
            ok:true,
            productos
        });
    });
});


app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id,(err, producto)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!producto){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            }); 
        }
        res.status(200).json({
            ok:true,
            producto
        });   
    });
});


//Buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            productos
        });
    });
});


app.put('/productos/:id', verificaToken, (req, res) =>{
    let id = req.params.id;
    let producto = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    };
    const config = {
        new: true, //devuelve el documento modificado
        runValidators: true
    }
    Producto.findByIdAndUpdate(id, producto, config, (err, productoActualizado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!producto){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            }); 
        }
        res.status(200).json({
            ok:true,
            productoActualizado
        });
    });
});


app.delete('/productos/:id', (req, res)=>{
    let id = req.params.id;
    producto = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, producto, {new: true}, (err, productoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!producto){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            }); 
        }
        res.status(200).json({
            ok:true,
            productoBorrado
        });
    });
});

module.exports = app;