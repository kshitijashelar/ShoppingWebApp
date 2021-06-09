// products array is the array which will hold all the products that user will add in the cart
const products = []
// function to add product in the array 
const addProduct = (productName) => {
    products.push(productName) //adding into array
    handleButtonChange(productName) //changing Add button to Remove
    alert("Product added!") //sending alert about the action
}
// function to remove product from the array 
const removeProduct = (productName) => {
    console.log(productName)
    products.pop(productName) //removing product from array
    handleButtonChange(productName) //changing Remove button to Add
    alert("Product removed!") //sending alert about the action
}
const handleButtonChange = (productName) => {
    let btn = null
    switch (productName) { // to keep a track of which button to change from Add to Remove and vice versa
        case "Apple":
            btn = document.getElementById("appleBtn") //fetching the button id 
            break
        case "Banana":
            btn = document.getElementById("bananaBtn")
            break
        case "Milk":
            btn = document.getElementById("milkBtn")
            break
        case "Tomato":
            btn = document.getElementById("tomatoBtn")
            break
        case "Aubergine":
            btn = document.getElementById("egplantBtn")
            break
        case "Chicken":
            btn = document.getElementById("chcknBtn")
            break
        case "Eggs":
            btn = document.getElementById("eggBtn")
            break
        case "Beef":
            btn = document.getElementById("beefBtn")
            break
    }
    if (products.includes(productName)) { // if the product is in list, change Add button to remove
        btn.className = "product-remove" // assigning product-remove class to this button
        btn.innerText = "Remove" // changing Add text to remove on button   
        btn.onclick = () => removeProduct(productName) // on click of this remove button, removeProduct function should get called
    } else { // if the product is not in list, change remove button to add
        btn.className = "product-add" // assigning product-add class to this button
        btn.innerText = "Add" // changing Remove text to Add on button 
        btn.onclick = () => addProduct(productName) // on click of this add button, addProduct function should get called
    }
}

// calling addProduct based on the click event on defined buttons
document.getElementById("appleBtn").onclick = () => addProduct("Apple")
document.getElementById("bananaBtn").onclick = () => addProduct("Banana")
document.getElementById("milkBtn").onclick = () => addProduct("Milk")
document.getElementById("tomatoBtn").onclick = () => addProduct("Tomato")
document.getElementById("egplantBtn").onclick = () => addProduct("Aubergine")
document.getElementById("chcknBtn").onclick = () => addProduct("Chicken")
document.getElementById("beefBtn").onclick = () => addProduct("Beef")
document.getElementById("eggBtn").onclick = () => addProduct("Eggs")

// function for submitting the products via API link and fetching response 
const submit = () => {
    console.log(products)
    const finalProds = [...products] //copying the products array 
    const otherProd = document.getElementById("other").value // fetching value from text field
    if (otherProd !== "") {
        const prod = otherProd.split(",") //if multiple values are entered, splitting them 
        console.log(prod)
        if (prod.length > 0) {
            for (var i = 0; i < prod.length; i++) {
                if (!products.includes(prod[i])) {
                    finalProds.push(prod[i]) //adding these values from textfield into the finalproduct array
                }
            }
        }
    }
    console.log(finalProds)
    if (finalProds.length > 0) {
        fetch("/basketScore", { // requesting information from API which returns a promise
            method: "POST", // sending type of API call
            body: JSON.stringify({ // converting JSON to string and adding the contents in body of JSON
                "api_key": "Tz2VKneatvmcqBPZu8aAZKlSg_8", // attaching api key
                "products": finalProds // attaching all the products qhich were given as input by the user
            }),
            headers: {
                'Content-Type': 'application/json' // adding header for content type as json 
            }
        }).then(response => { // when the promise is fulfilled 
            if (response.status === 200) { // if the response was a success
                response.json().then(jsonBody => { // fetch the jsonbody in jsonBody 
                    console.log(jsonBody)
                    fillSummary(jsonBody) // call fill summary function to write the product wise sumnmary in table format
                    fillTotSummary(jsonBody) // call fill tot summary function to write the over all summary in a table format
                })
            } else { // sending error in alert in case of failure
                alert("Error")
            }
        })
    } else { // if there are no items selected and submit was fired send an alert  
        alert("Please select items")
    }
}
// function to pupolate table based on the respone from API regarding product wise summary
const fillSummary = (jsonBody) => {
    const breakdown = jsonBody['basket_breakdown'] //fetching basket breakdown from json 
    const summaryTbody = document.getElementById("summary-tbody")
    summaryTbody.innerHTML = "" // clearing the contents every time
    breakdown.forEach(element => { // for every element appending the table rows as follows
        const rowHtml = "<tr>" +
            "<td>" + element['product_name'].toString() + "</td>" +
            "<td>" + element['Star Rating'].toString() + "</td>" +
            "<td>" + element['co2_impact'].toString() + "</td>" +
            "<td>" + element['food_unit'].toString() + "</td>" +
            "<td>" + element['score'].toString() + "</td>" +
            "</tr>"

        summaryTbody.innerHTML += rowHtml
    });
    document.getElementById("sumTbl").style.display = "block" // making the table visible only after submit button is clicked
}
// function to populate the total summary of all purchase 
const fillTotSummary = (jsonBody) => {
    const totSummaryTbody = document.getElementById("totalsum-tbody")
    totSummaryTbody.innerHTML = ""
    const rowHtml = "<tr>" +
        "<td>" + jsonBody['cost_of_offsetting'].toString() + "</td>" +
        "<td>" + jsonBody['num_identified_items'].toString() + "</td>" +
        "<td>" + jsonBody['number_of_trees'].toString() + "</td>" +
        "<td>" + jsonBody['overall_co2_impact'].toString() + "</td>" +
        "<td>" + jsonBody['overall_food_unit'].toString() + "</td>" +
        "<td>" + jsonBody['overall_star_rating'].toString() + "</td>" +
        "<td>" + jsonBody['overall_score'].toString() + "</td>" +
        "</tr>"

    totSummaryTbody.innerHTML += rowHtml
    document.getElementById("totsumTbl").style.display = "block"
}