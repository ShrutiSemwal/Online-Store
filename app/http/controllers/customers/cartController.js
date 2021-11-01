function cartController(){
    return {
        index(req,res) {
            res.render('customers/cart')
        },
        update(req, res){
            //let cart = {
               // objects(object):{
                   // itemId(key): {object: itemObject, qty:0},
                //},
                //totalQty: 0,
                //totalPrice:0

            //}

            //for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
               req.session.cart = {
                   objects: {},
                   totalQty: 0,
                   totalPrice:0
               }
            }
            let cart =  req.session.cart
           
            //check if object doesn't exist in cart
            if(!cart.objects[req.body._id]){
                   cart.objects[req.body._id] ={
                       object: req.body,
                       qty: 1
                   }
                   cart.totalQty = cart.totalQty + 1
                   cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.objects[req.body._id].qty = cart.objects[req.body._id].qty + 1
                cart.totalQty =   cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({totalQty: req.session.cart.totalQty})
        }
    }
}

module.exports= cartController