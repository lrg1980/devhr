const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
     upload(req, res, function(error) {
          if (error) {
               // console.log(error);
               if (error instanceof multer.MulterError) {
                    if (error.code === 'LIMIT_FILE_SIZE') {
                         req.flash('error', 'El archivo es muy grande: Máximo 100KB');
                    } else {
                         req.flash('error', error.message)
                    }
                    // return next();
               } else {
                    // console.log(error.message)
                    req.flash('error', error.message);
               }          
               res.redirect('/administracion');
               return;
          } else {
               return next();
         }
     });
}

// Opciones de Multer
const configuracionMulter = {
     limits: { fileSize: 100000 },
     storage: fileStorage = multer.diskStorage({
          destination : (req, file, cb) => {
               cb(null, __dirname+'../../public/uploads/perfiles');
          }, 
          filename : (req, file, cb) => {
               const extension = file.mimetype.split('/')[1];
               cb(null, `${shortid.generate()}.${extension}`);
          }
     }),
     fileFilter(req, file, cb) {
          if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
               cb(null, true);
          } else {
               cb(new Error('Formato no válido'), false);
          }
     }
}
const upload = multer(configuracionMulter).single('imagen');

exports.formCrearCuenta = (req, res) => {
     res.render('crear-cuenta', {
          nombrePagina: 'Crea tu cuenta en DevHR',
          tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
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

// formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
     res.render('iniciar-sesion', {
          nombrePagina: 'Iniciar Sesión DevHr'
     })
}

// Form editar el perfil
exports.formEditarPerfil = (req, res) => {
     res.render('editar-perfil', {
          nombrePagina: 'Edita tu perfil en devJobs',
          usuario: req.user,
          cerrarSesion: true,
          nombre: req.user.nombre,
          imagen: req.user.imagen
     })
}

// Guardar cambios Editar perfil
exports.editarPerfil = async (req, res) => {
     const usuario = await Usuarios.findById(req.user._id);

     usuario.nombre = req.body.nombre;
     usuario.email = req.body.email;
     if (req.body.password) {
          usuario.password = req.body.password
     }
     // console.log(req.file);
     if (req.file) {
          usuario.imagen = req.file.filename;
     }
     await usuario.save();

     req.flash('correcto', 'Cambios guardados correctamente');
     // redirect
     res.redirect('/administracion');
}

// sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
     // sanitizar
     req.sanitizeBody('nombre').escape();
     req.sanitizeBody('email').escape();
     if (req.body.password) {
          req.sanitizeBody('password').escape();
     }

     // validar
     req.checkBody('nombre', 'El nombre no puede estar vacío').notEmpty();
     req.checkBody('email', 'El correo electrónico no puede estar vacío').notEmpty();

     const errores = req.validationErrors();

     if (errores) {
          req.flash('error', errores.map(error => error.msg));

          res.render('editar-perfil', {
               nombrePagina: 'Edita tu perfil en devJobs',
               usuario: req.user,
               cerrarSesion: true,
               nombre: req.user.nombre,
               imagen: req.user.imagen,
               mensajes: req.flash()
          })
     }
     next(); // siguiente middleware
}