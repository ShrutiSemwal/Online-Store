const Store = require('../../models/store')

function homeController() {
    //factory functions- pattern for programming to return object
    return {

        async index (req,res) {
            
            const items = await Store.find()
            console.log(items)
            return res.render('home', {items: items})

           //Store.find().then(function(items) {
               //console.log(items)
            //return res.render('home', {items: items})
           //})
          
        }
    }
}

module.exports = homeController