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
let createBlock = function (tag, content, cssClass,) {
	let element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
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

	input.addEventListener("input", function () {
        if (this.value > 9) {
            this.value = "9";
		} else if (this.value == 0) {
            this.value = "";
		}
    });

    // add input to control as its child
    control.appendChild(input);

    //add event handling
	input.addEventListener('input', function () {
		let value = this.value;
	
		// retrieve button from its parent control
		let button = this.parentNode.querySelector('.commander');
	
		// if the value of the quantity input is 0, disable the button, otherwise enable it
		if (value == 0)  {
			button.disabled = true;
		} else {
			button.disabled = false;
		}
		console.log(input)
	});

    // create order button
    let button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + orderIdKey;
	button.disabled = true;
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
	return createBlock("figure", `<img src="${product.image}"/>`,"image");
}


let createShop = function () {
	let shop = document.getElementById("boutique");
	for(i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
	

	console.log(document.getElementById("2-order"));
}


let button = document.getElementById("2-order").addEventListener('click', (product,index) => {
	addToCart(product, index);
	 console.log(button);
})

function addToCart() {
 console.log(product);

	let quantityInput = document.getElementById(index + '-' + inputIdKey); 
	console.log(quantityInput); 
	let quantity = parseInt(quantityInput.value);
	console.log(quantity); 

	// build the div element for product
	let block = document.createElement("div");
	block.className = "achat";
	// set the id for this product
	block.id = index;
	// build the image of 'block'
	block.appendChild(createFigureBlock(product));
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	// build and add the div.quantity part of 'block'
	block.appendChild(createBlock("p", quantity + " ", "quantite"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("p", product.price + " €", "prix"));
	// build and add the btn.delete part of 'block
	block.appendChild(createBlock("button", "retirer"));


	let addToCartContainer = document.querySelector('.achats'); 
	addToCartContainer.appendChild(block); 

return control;
}

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
        let productDiv = createProduct(product, index);
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