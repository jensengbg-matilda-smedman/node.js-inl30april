/* Database */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

/* Products db */
const adapter1 = new FileSync('products.json');
const products = low(adapter1);
const product = products.get('products').value();

/* Cart db */
const adapter2 = new FileSync('cart.json');
const cart = low(adapter2);
let carts = cart.get('cart').value();

/* Express */
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

/* .json defaults */
products.defaults({ products: [] }).write();
cart.defaults({ cart: [] }).write();

/* Show all products */
app.get('/products', async (req, res) => {
    let data = await products.get('products');
    res.send(data);
});


/* Show products in cart */
app.get('/cart', async (req, res) => {
    let data = await cart.get('cart');
    res.send(data);
});



/* Add product to cart */
function addItem(item) {
    cart.get('cart').push(item).write();
}

app.post('/products/addItem/:id', (req, res) => {
    let ID = parseInt(req.params.id);
    let carts = cart.get('cart').value();
    const products = product.filter(products => products.id === parseInt(req.params.id));
    
    if (products.length === 0) {
        res.send(JSON.stringify('This product does not exist!'));
    } else {
        let cartItem = carts.filter(item => item.id === parseInt(req.params.id));
        if (cartItem.length === 0) {
            addItem(products[0]);
            res.send(JSON.stringify('Product added to cart!'));
        } else if (ID === cartItem[0].id) {
            res.send(JSON.stringify('This product already exist in cart and will not be added!'));
        }
    }
});



/* Remove product from cart */
function deleteProduct(item) {
    cart.get('cart').remove(item).write();
}

app.delete('/cart/deleteitem/:id', (req, res) => {
    let ID = parseInt(req.params.id);
    let cartItem = carts.filter(item => item.id === parseInt(req.params.id));

    if (cartItem.length === 0) {
        res.send(JSON.stringify('This product does not exist!'));
    } else {
        if (ID === cartItem[0].id) {
            deleteProduct(cartItem[0]);
            res.send(JSON.stringify('Product removed from cart!'));
        }
    }
});



/* Server listener on port */
app.listen(3000, () => {
    console.log('Server is running');
});