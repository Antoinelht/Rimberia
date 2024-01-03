// === constants ===
const MAX_QTY = 9;
const MIN_QTY = 0;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables === 
// the total cost of selected products 
let total = 0;

// function called when page is loaded, it performs initializations 
let init = function () {
	createShop();
}
window.addEventListener("load", init);

// usefull functions
/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
let createShop = function () {
	let shop = document.getElementById("boutique");
	for (i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}
/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
let createProduct = function (product, index) {
	// build the div element for product
	let block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));
	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}
/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
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
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
let createOrderControlBlock = (index) => {
	let control = document.createElement("div");
	control.className = "controle";
	// create input quantity element
	let input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.value = "0";
	//add event handling
	input.addEventListener("input", function () {

		let quantity = (input.value);
		if (quantity === RegExp("\D+") || quantity < MIN_QTY || quantity == 0 || quantity > MAX_QTY) {
			input.value = "0";
		}

		updateButtonState(button, quantity);
	});
	// create order button
	let button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	// Use the click of the button 
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
// function for the button 
let updateButtonState = function (button, quantity) {
	button.style.pointerEvents = quantity == 0 ? "none" : "auto"

	button.style.opacity = quantity == 0 ? 0.25 : 1;

};
// add the product to the cart
let addToCart = (index, quantity, /*button, input*/) => {
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


		// create input quantity element
		let input = document.createElement("input");
		input.id = index + '-' + inputIdKey;
		input.type = "number";
		input.value = "0";
		//add event handling
		input.addEventListener("input", function () {

			let quantity = (input.value);
			if (quantity === RegExp("\D+") || quantity < MIN_QTY || quantity == 0 || quantity > MAX_QTY) {
				input.value = "0";
			}

			updateButtonState(button, quantity);
		});
		// create order button
		let button = document.createElement("button");
		button.className = 'commander';
		button.id = index + "-" + orderIdKey;
		// Use the click of the button 
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

		cartItem.appendChild(itemImg);
		cartItem.appendChild(itemName);
		cartItem.appendChild(itemQuantity);
		cartItem.appendChild(input);
		cartItem.appendChild(button);


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

// check the total cart 
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
	// // Retrieve the required DOM elements
	const filterInput = document.getElementById("filter");
	const boutiqueDiv = document.getElementById("boutique");


	// Product display update function
	function updateDisplay(products) {
		// Code to display products according to search criteria
		// You can adapt this to suit your display logic

		// Simple example: display the name of each product in the shopDiv
		boutiqueDiv.innerHTML = "";
		products.forEach(function (product, index) {
			let productDiv = createProduct(product, index)
			boutiqueDiv.appendChild(productDiv);
		});
	}

	// Search-based product filtering function
	function filterProducts(searchTerm) {
		searchTerm = searchTerm.toLowerCase();
		let filteredProducts = catalog.filter(function (product) {
			return product.name.toLowerCase().includes(searchTerm);
		});
		updateDisplay(filteredProducts);
	}

	// Listen for changes in the search input
	filterInput.addEventListener("input", function () {
		let searchTerm = filterInput.value;
		filterProducts(searchTerm);
	});
});

// Save the shopping cart to localStorage
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

// Load the shopping cart from localStorage
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

// Call the loadCartFromLocalStorage function when the page is loaded
window.addEventListener("load", loadCartFromLocalStorage);
