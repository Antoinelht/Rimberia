// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
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
let createOrderControlBlock = function (index) {
	let control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	let input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.value = "0";

	input.addEventListener('input', (event) => {
		let inputNum = event.target.value;
		let clean = inputNum.replace(/\D/g, '');
		event.target.value = clean;
	})



	// add input to control as its child
	control.appendChild(input);

	//add event handling


	// create order button
	let button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	// add control to control as its child
	control.appendChild(button);

	// the built control div node is returned
	return control;
}


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
let createFigureBlock = function (product) {
	return createBlock("figure", `<img src="${product.image}"/>`, "image");
}
