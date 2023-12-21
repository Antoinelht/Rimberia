const MAX_QTY = 9;
const MIN_QTY = 0;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

let total = 0;

let init = function () {
	createShop();
}
window.addEventListener("load", init);

let createShop = function () {
	let shop = document.getElementById("boutique");
	for (i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

let createProduct = function (product, index) {
	let block = document.createElement("div");
	block.className = "produit";
	block.id = index + "-" + productIdKey;
	block.appendChild(createBlock("h4", product.name));
	block.appendChild(createFigureBlock(product));
	block.appendChild(createBlock("div", product.description, "description"));
	block.appendChild(createBlock("div", product.price, "prix"));
	block.appendChild(createOrderControlBlock(index));
	return block;
}

let createBlock = function (tag, content, cssClass) {
	let element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className = cssClass;
	}
	element.innerHTML = content;
	return element;
}

let createOrderControlBlock = (index) => {
	let control = document.createElement("div");
	control.className = "controle";

	let input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.value = "0";

	input.addEventListener("input", function () {
		let quantity = parseInt(input.value);
		if (quantity < MIN_QTY || quantity < 0 || quantity > MAX_QTY) {
			input.value = "0";
		}
		updateButtonState(button, quantity);
	});

	let button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;

	button.addEventListener("click", function () {
		let quantity = parseInt(input.value);
		if (quantity > 0) {
			addToCart(index, quantity);
			input.value = "0";
			updateTotal();
		} else {

			console.log("Ajouté un minimum de 1 en quantité !");

		}

	});

	control.appendChild(input);
	control.appendChild(button);
	return control;

};

let updateButtonState = function (button, quantity) {
	button.disabled = quantity === 0;
	button.style.opacity = quantity === 0 ? 0.25 : 1;

};

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
		/////////////////////////////////////////////////////////////////////
		//ici le quand tu ajoute l'image tu lui met une plus petite pour que ca depasse pas 
		cartItem.appendChild(itemImg).style.width = '30px';
		cartItem.appendChild(itemName);
		cartItem.appendChild(itemQuantity);
		cartItem.appendChild(itemPrice);



		let deleteButton = document.createElement("button");
		deleteButton.className = "retirer";
		deleteButton.addEventListener("click", () => {
			cartItem.remove();
			updateTotal();
		});
		cartItem.appendChild(deleteButton);
		document.querySelector("#panier .achats").appendChild(cartItem);
	}
	updateTotal();
};

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
	// Récupérer les éléments nécessaires du DOM
	const filterInput = document.getElementById("filter");
	const boutiqueDiv = document.getElementById("boutique");
	const totalSpan = document.getElementById("montant");
	const achatsDiv = document.querySelector(".achats");

	// Fonction pour mettre à jour l'affichage des produits
	function updateDisplay(products) {
		// Code pour afficher les produits en fonction de la recherche
		// Vous pouvez adapter cela en fonction de votre logique d'affichage

		// Exemple simple : afficher le nom de chaque produit dans la boutiqueDiv
		boutiqueDiv.innerHTML = "";
		products.forEach(function (product, index) {
			let productDiv = createProduct(product, index)
			boutiqueDiv.appendChild(productDiv);
		});
	}

	// Fonction de filtrage des produits en fonction de la recherche
	function filterProducts(searchTerm) {
		searchTerm = searchTerm.toLowerCase();
		let filteredProducts = catalog.filter(function (product) {
			return product.name.toLowerCase().includes(searchTerm);
		});
		updateDisplay(filteredProducts);
	}

	// Écouter les changements dans l'entrée de recherche
	filterInput.addEventListener("input", function () {
		let searchTerm = filterInput.value;
		filterProducts(searchTerm);
	});
});