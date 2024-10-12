("use strict");
// Convert numbers to written words

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === "object") {
    module.exports = factory(root);
  } else {
    root.numToWords = factory(root);
  }
})(
  typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this,
  function (window) {
    "use strict";
    var arr = function arr(x) {
      return Array.from(x);
    };
    var num = function num(x) {
      return Number(x) || 0;
    };
    var str = function str(x) {
      return String(x);
    };
    var isEmpty = function isEmpty(xs) {
      return xs.length === 0;
    };
    var take = function take(n) {
      return function (xs) {
        return xs.slice(0, n);
      };
    };
    var drop = function drop(n) {
      return function (xs) {
        return xs.slice(n);
      };
    };
    var reverse = function reverse(xs) {
      return xs.slice(0).reverse();
    };
    var comp = function comp(f) {
      return function (g) {
        return function (x) {
          return f(g(x));
        };
      };
    };
    var not = function not(x) {
      return !x;
    };
    var chunk = function chunk(n) {
      return function (xs) {
        return isEmpty(xs) ? [] : [take(n)(xs)].concat(chunk(n)(drop(n)(xs)));
      };
    };

    // numToWords :: (Number a, String a) => a -> String
    var num2Words = function num2Words(n) {
      var a = [
        "",
        "un",
        "deux",
        "trois",
        "quatre",
        "cinq",
        "six",
        "sept",
        "huit",
        "neuf",
        "dix",
        "onze",
        "douze",
        "treize",
        "quatorze",
        "quinze",
        "seize",
        "dix-sept",
        "dix-huit",
        "dix-neuf",
      ];

      var b = [
        "",
        "",
        "vingt",
        "trente",
        "quarante",
        "cinquante",
        "soixante",
        "soixante-dix",
        "quatre-vingt",
        "quatre-vingt-dix",
      ];

      var g = [
        "",
        "mille",
        "million",
        "milliard",
        "mille milliards",
        "quadrillion",
        "quintillion",
        "sextille",
        "septillion",
        "octillion",
        "nonillion",
      ];

      // this part is really nasty still
      // it might edit this again later to show how Monoids could fix this up
      var makeGroup = function makeGroup(_ref) {
        var ones = _ref[0],
          tens = _ref[1],
          huns = _ref[2];

        return [
          num(huns) === 0 ? "" : a[huns] + " cent ",
          num(ones) === 0 ? b[tens] : (b[tens] && b[tens] + "-") || "",
          a[tens + ones] || a[ones],
        ].join("");
      };

      var thousand = function thousand(group, i) {
        return group === "" ? group : group + " " + g[i];
      };

      if (typeof n === "number") return numToWords(String(n));
      else if (n === "0") return "zero";
      else
        return comp(chunk(3))(reverse)(arr(n))
          .map(makeGroup)
          .map(thousand)
          .filter(comp(not)(isEmpty))
          .reverse()
          .join(" ");
    };
    var constructor = function (number) {
      return num2Words(number);
    };

    return constructor;
  }
);

// Capitalize the first letter of each word

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for-loop does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

//Grab the current date

let today = new Date();
let elements = 1;
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;

//Place the grabbed date into the Date input

document.querySelector(".addDate").addEventListener("click", function () {
  document.querySelector(".invoiceDate").value = today;
});

// Function that deletes elements with the same ID number as the clicked button

function itemDelete(clickedID) {
  let deletedElement = document.getElementById(clickedID.slice(9));
  deletedElement.remove();
}

// Creates new HTML elements with their classes and attributes brom the input fields

document.querySelector(".addBtn").addEventListener("click", function () {
  let designations = document.getElementById("designations");
  let newDesignation = document.createElement(`div`);
  designations.appendChild(newDesignation);
  newDesignation.classList.add("row");
  newDesignation.id = elements;
  let dsg = document.createElement(`span`);
  dsg.textContent = document.querySelector(".designation").value;
  newDesignation.appendChild(dsg);
  dsg.classList.add(`columnDsg`);
  dsg.classList.add("dsg" + elements);
  let qte = document.createElement(`span`);
  qte.textContent = document.querySelector(".qte").value;
  newDesignation.appendChild(qte);
  qte.classList.add(`columnQte`);
  qte.classList.add("qte" + elements);
  let price = document.createElement(`span`);
  newDesignation.appendChild(price);
  price.textContent = document.querySelector(".price").value;
  price.classList.add(`columnPrice`);
  price.classList.add("price" + elements);
  let btnCol = document.createElement(`div`);
  newDesignation.appendChild(btnCol);
  btnCol.classList.add("columnBtn");
  btnCol.id = "col" + elements;
  let btnRow = document.createElement(`div`);
  btnCol.appendChild(btnRow);
  btnRow.classList.add("row");
  btnRow.id = "row" + elements;
  let deleteButton = document.createElement(`button`);
  deleteButton.classList.add(`btn-small-delete`);
  btnRow.appendChild(deleteButton);
  deleteButton.innerText = "-";
  deleteButton.id = "deleteBtn" + elements;
  deleteButton.setAttribute("onClick", "itemDelete(this.id)");
  elements++;
});

// Creates the PDF page to be printed

document
  .querySelector(".save")
  .addEventListener("click", async function name() {
    let itemsArray = [];
    let dsg;
    let qte;
    let price;
    let htmlTable = "";
    let sum = 0;
    let sumText;

    // Get the newly added elements and place them in an array

    for (let index = 1; index <= elements; index++) {
      if (document.getElementById(index)) {
        dsg = document.querySelector(`.dsg${index}`).textContent;
        qte = Number(document.querySelector(`.qte${index}`).textContent);
        price = Number(document.querySelector(`.price${index}`).textContent);
        itemsArray.push([dsg, qte, price, qte * price]);
      }
    }

    // Create an HTML string of the items to be added to the invoice

    for (let index = 0; index < itemsArray.length; index++) {
      htmlTable = htmlTable + "<tr>";
      htmlTable = htmlTable + "<td>" + (index + 1) + "</td>";
      htmlTable =
        htmlTable + "<td>" + titleCase(itemsArray[index][0]) + "</td>";
      htmlTable = htmlTable + "<td>" + itemsArray[index][1] + "</td>";
      htmlTable =
        htmlTable +
        "<td>" +
        itemsArray[index][2]
          .toLocaleString("en-US", {
            style: "currency",
            currency: "DZD",
          })
          .slice(4) +
        "</td>";
      htmlTable =
        htmlTable +
        "<td>" +
        itemsArray[index][3]
          .toLocaleString("en-US", {
            style: "currency",
            currency: "DZD",
          })
          .slice(4) +
        "</td>";
      htmlTable = htmlTable + "</tr>";
      sum += itemsArray[index][3];
    }

    // Creating a string from the total sum of the invoice

    const dec = Math.floor((sum % 1) * 100);
    sumText =
      numToWords(Math.floor(sum)) +
      " Dinars Algérien et " +
      ("0" + dec).slice(-2) +
      " centimes";

    // Creates the final invoice HTML string

    const htmlStr = ` <!DOCTYPE html>
                      <html>
                          <head>
                              <meta charset="utf-8">
                              <title>Facture ${document
                                .querySelector(".invoiceNumber")
                                .value.toUpperCase()}</title>
                              <style type=text/css>
                                  @page { 
                                      size: auto;  
                                      margin: 0mm; 
                                  }
                                  .topleft { 
                                      float: left; 
                                  } 
                                  .topright { 
                                      float: right; 
                                  } 
                                  div{ 
                                      padding : 3%; 
                                  } 
                                  th, td {
                                      border-bottom: 1px solid black;
                                  } 
                                  h1{
                                      text-align: center;
                                  }
                                  .tableheader{ 
                                      text-align: center; 
                                  }
                              </style>
                          </head>
                              <body>
                              <div class="top">
                                  <div class="topleft">
                                      <p>Facture №: ${document
                                        .querySelector(".invoiceNumber")
                                        .value.toUpperCase()}</p>
                                      <p>A: Khenchela le: ${
                                        document.querySelector(".invoiceDate")
                                          .value
                                      }</p>
                                      <p>Doit: ${titleCase(
                                        document.querySelector(".clientName")
                                          .value
                                      )}</p>
                                  </div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                              </div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div class="titre">
                                  <h1>Facture ${document
                                    .querySelector(".invoiceNumber")
                                    .value.toUpperCase()}<h1>
                              </div>
                              <div class="tableau">
                                  <table>
                                      <col width="30px"/>
                                      <col width="560px"/>
                                      <col width="40px"/>                                    
                                      <col width="100px"/>
                                      <col width="100px"/>
                                      <tr class="tableheader">                                        
                                          <th>№</th>
                                          <th>Designation</th>
                                          <th>Qte</th>
                                          <th>Prix Unitaire</th>
                                          <th>Montant</th>
                                      </tr>${htmlTable}
                                      <tr>
                                          <td style="border-bottom: 1px white"></td>
                                          <td style="border-bottom: 1px white"></td>
                                          <td style="border-bottom: 1px white"></td>
                                          <td><b>Total</b></td>
                                          <td><b>${sum
                                            .toLocaleString("en-US", {
                                              style: "currency",
                                              currency: "DZD",
                                            })
                                            .slice(4)}</b></td>
                                  </table> 
                              </div>
                              <div class="somme">
                                  <p>Arrêté la facture à la somme de: ${sumText}.</p>
                              </div>
                          </body>
                      </html>`;

    // prints the final invoice
    const printWindow = window.open("", "", "height=400,width=800");
    printWindow.document.write(htmlStr);
    html2pdf()
      .from(htmlStr)
      .save(
        `Facture ${document
          .querySelector(".invoiceNumber")
          .value.toUpperCase()}.pdf`
      );
  });
