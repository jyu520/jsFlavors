/* Sets a random integer quantity in range [1, 20] for each flavor. */
function setQuantities() {
  // select for all the flavors, create a new span with the new rand value,
  // adding quantity as a new class of the span, and prepend to meta.
  var metas = document.querySelectorAll(".flavor .meta");

  Array.from(metas).forEach(metas => {

    var newSpan = document.createElement("span"); 
    newSpan.className = 'quantity';
    newSpan.innerHTML = String( Math.floor(Math.random() * (20 - 1 + 1) + 1) );

    metas.insertBefore(newSpan, metas.firstChild);

  });
    
}

/* Extracts and returns an array of flavor objects based on data in the DOM. Each
 * flavor object should contain five properties:
 *
 * element: the HTMLElement that corresponds to the .flavor div in the DOM
 * name: the name of the flavor
 * description: the description of the flavor
 * price: how much the flavor costs
 * quantity: how many cups of the flavor are available
 */
function extractFlavors() {
  // create result array, select all the flavors, create a profile for each,
  // accessing the description by the tags name and description correspond to
  // then get the price and quantity class values (innerHTML)
  // then return said profile into an array for all flavors.
  var flavorArray = [];
  var flavor = document.querySelectorAll(".flavor");

  Array.from(flavor).forEach(flavor => {

    const flavorProfile = {
      element: flavor,
      name: flavor.getElementsByClassName('description')[0].getElementsByTagName("h2")[0].innerHTML,
      description: flavor.getElementsByClassName('description')[0].getElementsByTagName("p")[0].innerHTML,
      price: flavor.getElementsByClassName('price')[0].innerHTML,
      quantity: flavor.getElementsByClassName('quantity')[0].innerHTML
    }

    flavorArray.push(flavorProfile);
  });

  return flavorArray;

}

/* Calculates and returns the average price of the given set of flavors. The
 * average should be rounded to two decimal places. */

function calculateAveragePrice(flavors) {
// caluclate the sum by adding all the prices, 
// divide sum by number of flavors to get average price
  var sum = 0;

  flavors.forEach(flavors => {
    var price = Number(flavors.price.replace("$", ""))
    sum += price;
  });

  return (sum/flavors.length).toFixed(2);

}

/* Finds flavors that have prices below the given threshold. Returns an array
 * of strings, each of the form "[flavor] costs $[price]". There should be
 * one string for each cheap flavor. */
function findCheapFlavors(flavors, threshold) {
  // Filter all flavors prices that are less than threshold
  // then map each cheap flavor to a string to return in the 
  // cheap flavors list
  const cheapFlavors = flavors.filter(flavor => flavor.price.replace("$", "") < threshold);
  const result = cheapFlavors.map(flavor => flavor.name + " costs " + flavor.price);
  return result;
}

/* Populates the select dropdown with options. There should be one option tag
 * for each of the given flavors. */
function populateOptions(flavors) {
  // remove the example from selector, then for each flavor,
  // add a new flavor as an option to select and append this
  // new option to the select.
  const selector = document.getElementById("footer").getElementsByTagName("select")[0];
  selector.remove(0);
  flavors.forEach(flavor => {
    var newFlavor = document.createElement("option"); 
    newFlavor.innerHTML = flavor.name;
    selector.appendChild(newFlavor);
  });
}

/* Processes orders for the given set of flavors. When a valid order is made,
 * decrements the quantity of the associated flavor. */
function processOrders(flavors) {
  // Get the footer to add a listener for submit, once you
  // encounter a submit event, you want to first preventDefault
  // so the page doesn't change, then you want to get the 
  // selected flavor and quantity of the order,
  // search the DOM for this selected flavor and if the order
  // quantity is less than the currentQuantity, decrement from the
  // current. Else if no amount is provided or current is too little, exit. 
  const footer = document.getElementById("footer")
  const selector = footer.getElementsByTagName("select")[0];
  footer.addEventListener("submit", event => {
    event.preventDefault();
    var selectedFlavor = selector.options[selector.selectedIndex].value;
    var selectedQuantity = footer.querySelector('input[name="amount"]').value;

    if (!selectedQuantity){
      return;
    }
    // I feel like there should be a better way to find an HTML element with 
    // a specific text as opposed to looping through all, will do some research.
    var flavorNames = document.querySelectorAll(".flavor .description h2");
    var foundFlavor;
    flavorNames.forEach(flavor => {
      if (flavor.innerHTML === selectedFlavor){
          foundFlavor = flavor.parentElement.parentElement;
      }
    });

    var currentQuantity = foundFlavor.querySelector('[class = quantity]').innerHTML;

    if (currentQuantity - selectedQuantity >= 0){
      foundFlavor.querySelector('[class = quantity]').innerHTML = currentQuantity - selectedQuantity;
    } 

  });
}

/* Highlights flavors when clicked to make a simple favoriting system. */
function highlightFlavors(flavors) {
  // for all flavors, add a click event listener to toggle highlight class
  const flavorElements = document.getElementsByClassName("flavor");

  for (let i = 0; i < flavorElements.length; i ++){
    flavorElements[i].addEventListener('click', event => {
      flavorElements[i].classList.toggle('highlighted');
    });
  }
  
}


/***************************************************************************/
/*                                                                         */
/* Please do not modify code below this line, but feel free to examine it. */
/*                                                                         */
/***************************************************************************/


const CHEAP_PRICE_THRESHOLD = 1.50

// setting quantities can modify the size of flavor divs, so apply the grid
// layout *after* quantities have been set.
setQuantities()
const container = document.getElementById('container')
new Masonry(container, { itemSelector: '.flavor' })

// calculate statistics about flavors
const flavors = extractFlavors()
const averagePrice = calculateAveragePrice(flavors)
console.log('Average price:', averagePrice)

const cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD)
console.log('Cheap flavors:', cheapFlavors)

// handle flavor orders and highlighting
populateOptions(flavors)
processOrders(flavors)
highlightFlavors(flavors)
