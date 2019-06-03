const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
     email: {
          type: String,
          unique: true,
          lowercase: true,
          trim: true
     },
     nombre: {
          type: String,
          required: true
     },
     password: {
          type: String,
          required: true,
          trim: true
     },
     token: String,
     expira: Date
});

// Método para hashear los passwords
usuariosSchema.pre('save', async function (next) {
     // Si el password ya está hasheado
     if (!this.isModified('password')) {
          return next(); // deten la ejecución
     }
     // Si no está hasheado
     const hash = await bcrypt.hash(this.password, 12);
     this.password = hash;
     next();
});
// Verificar que el correo electrónico ya está registrado y mostrar alerta.
usuariosSchema.post('save', function (error, doc, next) {
     if (error.name === 'MongoError' && error.code === 11000) {
          next('Ese correo electrónico ya está registrado');
     } else {
          next(error);
     }   
});


module.exports = mongoose.model('Usuarios', usuariosSchema);