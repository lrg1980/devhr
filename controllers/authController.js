const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local', {
     successRedirect: '/administracion',
     failureRedirect: '/iniciar-sesion',
     failureFlash: true, 
     badRequestMessage: 'Ambos campos son obligatorios'
});

// Revisar si el usuario está autenticado o no
exports.verificarUsuario = (req, res, next) => {

     // revisar el usuario
     if (req.isAuthenticated()) {
          return next(); // están autenticados
     }

     // redireccionar
     res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req, res) => {

     // consultar el usuario autenticado
     const vacantes = await Vacante.find({ autor: req.user._id });

     
     res.render('administracion', {
          nombrePagina: 'Panel de Administración',
          tagline: 'Crea y Administra tus vacantes desde aqui',
          cerrarSesion: true,
          nombre: req.user.nombre,
          imagen : req.user.imagen,
          vacantes
     })
}

exports.cerrarSesion = (req, res) => {
     req.logout();
     req.flash('correcto', 'Cerraste sesión correctamente');

     return res.redirect('/iniciar-sesion');
}

/** Formulario para reiniciar el password */
exports.formReestablecerPassword = (req, res) => {
     res.render('reestablecer-password', {
          nombrePagina: 'Reestablecer tu contraseña',
          tagline: 'Si ya tienes una cuenta, pero olvidaste tu contraseña, coloca tu email aqui'
     })
}