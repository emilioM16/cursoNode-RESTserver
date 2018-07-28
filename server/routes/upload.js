const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Ningún archivo fue seleccionado.'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Los tipos permitidos son ${ tiposValidos.join(', ')}`
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreSeparado = archivo.name.split('.');
    let extension = nombreSeparado[nombreSeparado.length - 1];
    //Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Las extensiones permitidas son ${ extensionesValidas.join(', ')}` 
            }
        })
    }

    //Cambiar nombre archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`../uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err){
          return res.status(500).json({
              ok:false,
              err
          });
        }
     
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            default:
                break;
        }

    });
});


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    } 
}


function imagenUsuario(id, res, nombreArchivo) {//Actualiza la imagen del usuario
    Usuario.findById(id, (err, usuario)=>{
        if (err){
            borraArchivo(nombreArchivo, 'usuarios'); //borrar la imagen recien subida
            return res.status(500).json({
                ok:false,
                err
            });
        } 
        if(!usuario){
            borraArchivo(nombreArchivo, 'usuarios'); //borrar la imagen recien subida
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El usuario no existe'
                }
            });   
        }

        if(!usuario.img !== null){
            borraArchivo(usuario.img, 'usuarios');
        }

        usuario.img = nombreArchivo;
        usuario.save((err, usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado
            });
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, producto)=>{
        if (err){
            borraArchivo(nombreArchivo, 'productos'); //borrar la imagen recien subida
            return res.status(500).json({
                ok:false,
                err
            });
        } 
        if(!producto){
            borraArchivo(nombreArchivo, 'productos'); //borrar la imagen recien subida
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El producto no existe'
                }
            });   
        }

        if(producto.img !== null){
            borraArchivo(producto.img, 'productos'); //borrar la imagen previa
        }
        
        producto.img = nombreArchivo;
        producto.save((err, productoGuardado) =>{
            if(err){
                res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto: productoGuardado
            });
        })
    });
}

module.exports = app;