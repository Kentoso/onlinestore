class Cart {
    constructor() {
        this.items = [];
    }
}
class CartItem {
    constructor(product) {
        this.product = product;
        this.amount = 1;
    }
}
var PageCart = new Cart();
function initializeCart() {
    if (localStorage.getItem("cart") == null) {
        PageCart = new Cart();
        return;
    }
    let json = localStorage.getItem("cart");
    PageCart = JSON.parse(json);
    createCart();
}

function openCart() {
    let cart = document.getElementById("cart");
    cart.className = cart.className == "disabled" ? cart.className = "": cart.className = "disabled";
}
function closeCart() {
    let cart = document.getElementById("cart");
    cart.className = "disabled";
}
function createCart() {
    i = 0;
    PageCart.items.forEach(cartItem => {
        createCartItem(cartItem, i);
        i++;
    });
    localStorage.setItem("cart", JSON.stringify(PageCart));
}
function clearCart() {
    let cart = document.getElementById("cart-items");
    let cartItems = Array.from(cart.childNodes);
    cartItems.forEach( item => {
        cart.removeChild(item);
    });
}
function deleteCart() {
    clearCart();
    localStorage.clear("cart");
}
function createCartItem(cartItem, index) {
    let parentNode = document.getElementById("cart-items");
    let itemContainer = document.createElement("div");
    itemContainer.className = "cart-item";
    let itemImage = document.createElement("img");
    itemImage.src = cartItem.product.imagePath;
    let itemName = document.createElement("p");
    itemName.innerHTML = cartItem.product.name;
    let itemCost = document.createElement("p");
    itemCost.innerHTML = "$" + cartItem.product.cost;
    let itemCount = document.createElement("input");
    itemCount.className = "item-count";
    itemCount.value = cartItem.amount;
    itemCount.id = Products.findIndex(x => x.name == cartItem.product.name);
    itemCount.dataset.itemId = index;
    itemCount.disabled = true;
    let itemCountDecrement = document.createElement("button");
    itemCountDecrement.innerHTML = "-";
    itemCountDecrement.addEventListener('click', decrementItemCount);
    let itemCountIncrement = document.createElement("button");
    itemCountIncrement.innerHTML = "+";
    itemCountIncrement.addEventListener('click', incrementItemCount);
    let itemCountContainer = document.createElement("div");
    itemCountContainer.appendChild(itemCountDecrement);
    itemCountContainer.appendChild(itemCount);
    itemCountContainer.appendChild(itemCountIncrement);
    itemContainer.appendChild(itemImage);
    itemContainer.appendChild(itemName);
    itemContainer.appendChild(itemCost);
    itemContainer.appendChild(itemCountContainer);
    parentNode.appendChild(itemContainer);
}
function incrementItemCount(ev) {
    let id = findCartItemId(ev);
    console.log(id);
    let itemId = document.getElementById(id).dataset.itemId;
    changeItemCount(itemId, 1);
}
function decrementItemCount(ev) {
    let id = findCartItemId(ev);
    let itemId = document.getElementById(id).dataset.itemId;
    changeItemCount(itemId, -1);
}

function changeItemCount(id, increment) {
    if (increment < 0 && PageCart.items[id].amount - 1<= 0) {
        if (confirm("This will delete the item from cart")) {
            PageCart.items.splice(id, 1);
            clearCart();
            createCart();
        }
        return;
    }
    PageCart.items[id].amount += increment;
    clearCart();
    createCart();
}
function findCartItemId(ev) {
    let button = ev.toElement;
    let children = button.parentNode.childNodes;
    let input;
    for (let i = 0; i < children.length; i++) {
        if (children[i].nodeName == "INPUT") {
            input = children[i];
        }
    }
    if (PageCart.items[input.dataset.itemId] === undefined) {
        return;
    }
    return input.id;
}