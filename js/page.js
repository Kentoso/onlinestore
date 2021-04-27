var Products;
function initializeProducts(_products) {
    Products = _products;
}

function createCategorySelector(categories) {
    let select = document.getElementById("categorySelector");
    let all = document.createElement("option");
    all.text = "All";
    select.add(all);
    categories.forEach(tag => {
        let option = document.createElement("option");
        option.text = tag;
        select.add(option);
    });
}
function createCategoryButton() {
    let categoryButton = document.getElementById("categoryButton");
    let select = document.getElementById("categorySelector");
    categoryButton.onclick = `createProductsWithCategory(${select.value})`;
}
function createProducts() {
    let i = 0;
    Products.forEach(product => {
        createProduct(product, i);
        i++;
    });
}
function createProduct(product, index) {
    let productNode = document.createElement("div");
    productNode.id = "product" + `${index}`;
    productNode.className = "product";

    let productImage = document.createElement("img");
    productImage.src = product.imagePath;

    let productName = document.createElement("p");
    productName.innerHTML = product.name;

    let productCost = document.createElement("p");
    productCost.innerHTML =  "$" + product.cost;
    
    let productCart = document.createElement("button");
    productCart.addEventListener("click", addToCart);
    productCart.innerHTML = "Add to cart";

    productNode.appendChild(productImage);
    productNode.appendChild(productName);
    productNode.appendChild(productCost);
    productNode.appendChild(productCart);
    
    document.getElementById("products").appendChild(productNode);
} 

function createProductsWithCategory(category) {
    removeProducts();
    if (category == "All") {
        createProducts();
        return;
    }
    let i = 0;
    Products.forEach(product => {
        if (product.categories.split(" ").includes(category)) {
            createProduct(product, i);
            i++;
        }
    });
}
function hideProductsWithoutCategory(category) {
    if (category == "All") {
        showAllProducts();
        return;
    }
    showAllProducts();
    Products.forEach(product => {
        if (!product.categories.split(" ").includes(category)) {
            let productNode = document.getElementById("product" + Products.indexOf(product));
            productNode.className = "product disabled";
        }
    });
}
function showAllProducts() {
    let children = Array.from(document.getElementById("products").childNodes);
    children.forEach(child => {
        child.className = "product";
    });
}
function removeProducts() {
    let products = Array.from(document.getElementsByClassName("product"));
    let productContainer = document.getElementById("products");
    products.forEach( p => {
        productContainer.removeChild(p);
    });
}
function addToCart(ev) {
    let button = ev.toElement;
    let id = button.parentNode.id.slice(7);
    let cartItem = new CartItem(Products[id]);
    if (PageCart.items !== undefined) {
        if (!PageCart.items.find(x => x.product.name == Products[id].name)) {
            PageCart.items.push(cartItem);
            clearCart();
            createCart();
            return;
        }
        if (confirm("You arleady have this product in you cart. We will add it again")) {
            let itemId = document.getElementById(id).dataset.itemId;
            changeItemCount(itemId, 1);
        }
    }
}
function confirmOrder() {
    let order = document.forms["order"];
    let name = order["orderName"].value;
    let lastName = order["orderLastName"].value;
    console.log(name);
    if (name.length > 1 && lastName.length > 1 && PageCart.items.length > 0) {
        document.getElementById("modal").classList.add("disabled");
        document.getElementById("order-accepted").classList.remove("disabled");
        deleteCart();
    }
}