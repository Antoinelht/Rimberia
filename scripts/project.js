// === constantes ===
const MAX_QTY = 9;
const MIN_QTY = 0;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === variables globales === 
// le coût total des produits sélectionnés 
let total = 0;

// fonction appelée lorsque la page est chargée, elle effectue les initialisations 
let init = function () {
    createShop();
}
window.addEventListener("load", init);

// fonctions utiles
/*
* Crée et ajoute tous les éléments div.produit à l'élément div#boutique
* en fonction des objets de produit présents dans la variable 'catalog'
*/
let createShop = function () {
    let shop = document.getElementById("boutique");
    for (i = 0; i < catalog.length; i++) {
        shop.appendChild(createProduct(catalog[i], i));
    }
}

/*
* Crée l'élément div.produit correspondant au produit donné
* L'élément créé reçoit l'identifiant "index-product" où l'index est remplacé par la valeur du paramètre
* @param product (objet produit) = le produit pour lequel l'élément est créé
* @param index (entier) = l'index du produit dans le catalogue, utilisé pour définir l'identifiant de l'élément créé
*/
let createProduct = function (product, index) {
    // construit l'élément div pour le produit
    let block = document.createElement("div");
    block.className = "produit";
    // définit l'identifiant pour ce produit
    block.id = index + "-" + productIdKey;
    // construit la partie h4 de 'block'
    block.appendChild(createBlock("h4", product.name));
    // /!\ doit ajouter la figure du produit... ne fonctionne pas encore... /!\ 
    block.appendChild(createFigureBlock(product));
    // construit et ajoute la partie div.description de 'block' 
    block.appendChild(createBlock("div", product.description, "description"));
    // construit et ajoute la partie div.price de 'block'
    block.appendChild(createBlock("div", product.price, "prix"));
    // construit et ajoute le bloc div de contrôle à l'élément produit
    block.appendChild(createOrderControlBlock(index));
    return block;
}

/* retourne un nouvel élément de balise 'tag' avec le contenu 'content' et la classe 'cssClass'
 * @param tag (chaîne) = le type de l'élément créé (exemple : "p")
 * @param content (chaîne) = le contenu HTML de l'élément créé (exemple : "bla bla")
 * @param cssClass (chaîne) (facultatif) = la valeur de l'attribut 'class' pour l'élément créé
 */
let createBlock = function (tag, content, cssClass) {
    let element = document.createElement(tag);
    if (cssClass != undefined) {
        element.className = cssClass;
    }
    element.innerHTML = content;
    return element;
}

/*
* Construit l'élément de contrôle (div.controle) pour un produit
* @param index = l'index du produit considéré
*
* À FAIRE : ajouter la gestion des événements, 
*   /!\ dans cette version le bouton et l'input ne font rien /!\  
*/
let createOrderControlBlock = (index) => {
    let control = document.createElement("div");
    control.className = "controle";
    // crée l'élément input pour la quantité
    let input = document.createElement("input");
    input.id = index + '-' + inputIdKey;
    input.type = "number";
    input.value = "0";
    // ajoute la gestion des événements
    input.addEventListener("input", function () {
        let quantity = (input.value);
        if (quantity === RegExp("\D+") || quantity < MIN_QTY || quantity == 0 || quantity > MAX_QTY) {
            input.value = "0";
        }
        updateButtonState(button, quantity);
    });
    // crée le bouton de commande
    let button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + orderIdKey;
    // utilise le clic du bouton
    button.addEventListener("click", function () {
        let quantity = parseInt(input.value);
        if (quantity > 0) {
            addToCart(index, quantity);
            input.value = "0";
            updateTotal();
        } else {
            console.log("Ajouté un minimum de 1 en quantité !");
        }
        button.style.pointerEvents = quantity == 0 ? "none" : "auto"
        button.style.opacity = quantity == 0 ? 0.25 : 1;
    });

    control.appendChild(input);
    control.appendChild(button);
    return control;
};

// fonction pour le bouton 
let updateButtonState = function (button, quantity) {
    button.style.pointerEvents = quantity == 0 ? "none" : "auto"
    button.style.opacity = quantity == 0 ? 0.25 : 1;
};

// ajoute le produit au panier
let addToCart = (index, quantity) => {
    let product = catalog[index];
    let existingCartItem = document.getElementById("cartItem-" + index);
    if (existingCartItem) {
        let currentQuantity = parseInt(existingCartItem.querySelector(".quantite").textContent);
        quantity += currentQuantity;
        if (quantity > MAX_QTY) {
            quantity = MAX_QTY;
        }
        existingCartItem.querySelector(".quantite").textContent = quantity;
    } else {
        let cartItem = createBlock("div", "", "achat");
        cartItem.id = "cartItem-" + index;

        let itemName = createBlock("span", product.name, "nom");
        let itemQuantity = createBlock("span", quantity, "quantite");
        let itemImg = document.createElement("img");
        let itemPrice = createBlock("span", product.price, "price");

        itemImg.className = "cartImg";
        itemImg.src = product.image;
        itemImg.alt = product.name;

        cartItem.appendChild(itemImg);
        cartItem.appendChild(itemName);
        cartItem.appendChild(itemQuantity)
        // cartItem.appendChild(itemPrice);

        let deleteButton = document.createElement("button");
        deleteButton.className = "retirer";
        deleteButton.addEventListener("click", () => {
            cartItem.remove();
            updateTotal();
        });
        cartItem.appendChild(deleteButton);
        document.querySelector("#panier .achats").appendChild(cartItem);

        saveCartToLocalStorage();
    }
    updateTotal();
};

// vérifie le total du panier 
let updateTotal = () => {
    let cartItems = document.querySelectorAll("#panier .achat");
    let total = 0;
    cartItems.forEach(function (cartItem) {
        let quantity = parseInt(cartItem.querySelector(".quantite").textContent);
        let index = cartItem.id.split("-")[1];
        let product = catalog[index];
        total += quantity * product.price;
    });
    total = total.toFixed(2);
    document.getElementById("montant").textContent = total;
};

let createFigureBlock = function (product) {
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    figure.appendChild(image);

    return figure;
};

document.addEventListener("DOMContentLoaded", function () {
    // Récupère les éléments DOM requis
    const filterInput = document.getElementById("filter");
    const boutiqueDiv = document.getElementById("boutique");
    const totalSpan = document.getElementById("montant");
    const achatsDiv = document.querySelector(".achats");

    // Fonction de mise à jour de l'affichage des produits
    function updateDisplay(products) {
        // Code pour afficher les produits selon les critères de recherche
        // Vous pouvez adapter cela à votre logique d'affichage

        // Exemple simple : afficher le nom de chaque produit dans shopDiv
        boutiqueDiv.innerHTML = "";
        products.forEach(function (product, index) {
            let productDiv = createProduct(product, index)
            boutiqueDiv.appendChild(productDiv);
        });
    }

    // Fonction de filtrage des produits basée sur la recherche
    function filterProducts(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let filteredProducts = catalog.filter(function (product) {
            return product.name.toLowerCase().includes(searchTerm);
        });
        updateDisplay(filteredProducts);
    }

    // Écoute des changements dans la saisie de recherche
    filterInput.addEventListener("input", function () {
        let searchTerm = filterInput.value;
        filterProducts(searchTerm);
    });
});

// Enregistre le panier d'achats dans localStorage
let saveCartToLocalStorage = () => {
    let cartItems = document.querySelectorAll("#panier .achat");
    let cartData = [];

    cartItems.forEach(function (cartItem) {
        let quantity = parseInt(cartItem.querySelector(".quantite").textContent);
        let index = cartItem.id.split("-")[1];
        cartData.push({ index, quantity });
    });

    localStorage.setItem("shoppingCart", JSON.stringify(cartData));
};

// Charge le panier d'achats depuis localStorage
let loadCartFromLocalStorage = () => {
    let cartData = localStorage.getItem("shoppingCart");

    if (cartData) {
        cartData = JSON.parse(cartData);

        cartData.forEach(({ index, quantity }) => {
            addToCart(index, quantity);
        });

        updateTotal();
    }
};

// Appelle la fonction loadCartFromLocalStorage lorsque la page est chargée
window.addEventListener("load", loadCartFromLocalStorage);
