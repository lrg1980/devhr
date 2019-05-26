exports.mostrarTrabajos = (req, res) => {
     res.render('home', {
          nombrePagina: 'devHR',
          tagline: 'Encuentra y publica búsquedas laborales para desarrolladores',
          barra: true,
          boton: true
     })
}