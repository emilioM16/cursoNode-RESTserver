const express = require('express');

let app = express();
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categoriasDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    mensaje: 'Ocurrió un error en el servidor al obtener los datos'
                }
            });
        }
        res.json({
            ok: true,
            categoriasDB
        });
    });
});


//Mostrar una categoria por ID
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById({_id: id}, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                    mensaje: 'Ocurrió un error en el servidor al obtener los datos'
                }
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    mensaje: 'El id no existe'
                }
            });
        }
        return res.json({
            ok:true,
            categoriaDB
        });
    });
});


//Crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let categoria = new Categoria({
            descripcion: req.body.descripcion,
            usuario: req.usuario._id
        })
    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }    
        res.json({
            ok:true,
            mensaje: 'Se creó la nueva categoria',
            categoriaDB
        })
    });
});

//Actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    const config = {
        new: true, //devuelve el documento modificado
        runValidators: true
    }
    Categoria.findByIdAndUpdate(id, body, config, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            });
        }
        res.status(200).json({
            ok:true,
            categoriaDB
        });
    });
});


//Borra una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id,(err, categoriaBorrada) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no existe'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoriaBorrada
        });
    });
});

module.exports = app;