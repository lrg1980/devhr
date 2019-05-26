const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req, res, next) => {

     const vacantes = await Vacante.find();

     if (!vacantes) return next();

     res.render('home', {
          nombrePagina: 'devHR',
          tagline: 'Encuentra y publica búsquedas laborales para desarrolladores',
          barra: true,
          boton: true,
          vacantes
     })
}