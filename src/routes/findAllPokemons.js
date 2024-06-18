const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

  
module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {
    if(req.query.name){  
      const limite = parseInt(req.query.limit) || 5
      const name = req.query.name
      if(name.length < 2){
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
        return res.status(400).json({message})
      }
      return Pokemon.findAndCountAll({  
        where: {  
          name: {
            [Op.like]: `%${name}%`   
          }  
        },
        order: ['name'], 
        limit: limite
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`
        res.json({ message, data: rows})
      })
    }
    Pokemon.findAll({ order: ['name'] })
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instats.`
        res.status(500).json({message, data: error})
      })
  })
}