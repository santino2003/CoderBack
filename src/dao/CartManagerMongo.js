const cartModel = require("../dao/models/cart.model")
class CartManagerMongo{

    async getProductsCart(id){
        try {
            const cart = await cartModel.findOne({_id: id},{products:1})
        
            return (cart.products)
        } catch (error) {
            console.log(error)
        }
      
    }
    async createCart(){
       try {
            const newCart = await cartModel.create({
                products: []
            })
        return newCart._id
       } catch (error) {
            console.log(error)
       }
    }
    async addProductToCart(idCart,idProduct){
        const cart = await cartModel.findOne({_id: idCart})
        
        if (cart){
            const product = cart.products.find(product => product.Prodid === idProduct)
            
            if (product){
                const nuevaCantidad = (product.quantity += 1)
                await cartModel.findOneAndUpdate(
                    { _id: idCart, 'products.Prodid': idProduct},
                    { $set: { 'products.$.quantity': nuevaCantidad } },
                    {new: true}
                )   
            }else{
                const productoNuevo = {
                    Prodid: idProduct,
                    quantity: 1
                }


                await cartModel.findOneAndUpdate(
                    { _id: idCart },
                    { $push: { products: productoNuevo } },
                    { new: true }
                )

                
            }
        }else{
            return(error(404))
        }
    }
}
module.exports = CartManagerMongo
