const cart = JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));

};
const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if(existingItem) {
        existingItem.quantity *= 1;
    } else {
        cart.push({ ...product, quantity: 1});
    }
    saveCart();
    alert(`${product.name} added to cart!`);
};
