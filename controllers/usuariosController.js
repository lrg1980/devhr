const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
     res.render('crear-cuenta', {
          nombrePagina: 'Crea tu cuenta en DevHR',
          tagline: 'Comienza a publicar tus vacaciones gratis, solo debes crear una cuenta'
     })
}

exports.validarRegistro = (req, res, next) => {

     // Sanitizar Cambiar los datos del request body
     req.sanitizeBody('nombre').escape();
     req.sanitizeBody('email').escape();
     req.sanitizeBody('password').escape();
     req.sanitizeBody('confirmar').escape();

     // validar
     req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
     req.checkBody('email', 'El email debe ser válido').isEmail();
     req.checkBody('password', 'El passwoord no puede ir vacío').notEmpty();
     req.checkBody('confirmar', 'Confirmar passwoord no puede ir vacío').notEmpty();
     req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

     const errores = req.validationErrors();

     if (errores) {
         // si hay errores
          req.flash('error', errores.map(error => error.msg));
          
          res.render('crear-cuenta', {
               nombrePagina: 'Crea tu cuenta en DevHR',
               tagline: 'Comienza a publicar tus vacaciones gratis, solo debes crear una cuenta',
               mensajes: req.flash()
          });
          return;
     }
     
     // Si toda la validación es correcta
     next();
}

exports.crearUsuario = async (req, res, next) => {
     // crear el usuario
     const usuario = new Usuarios(req.body);

     try {
          await usuario.save();
          res.redirect('/iniciar-sesion');
     } catch (error) {
          req.flash('error', error);
          res.redirect('crear-cuenta');
     }
}