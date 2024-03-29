/* Este es el documento JS del index de un carrito de compras
Edwin Donaldo Saucedo Vazquez  Clase Javascript 30435 */

class Product {
    constructor(name, price, img) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.quantCart = 0;
    }
}

class User {
    constructor(name, isAdmin){
        this.name = name;
        this.isAdmin = isAdmin;
    }
}

let topList = JSON.parse(localStorage.getItem("topList"));
let shopList = JSON.parse(localStorage.getItem("shopList"));

const makeCarrousel = () =>{
    $(function () {
        $(".slide").slick({
            slidesToShow: 3,
            arrows: true,
            speed: 500,
            centerMode: true,
            centerPadding: "0",
            infinite: true,
            autoplay: true,
            autoplaySpeed: 2500,
        });
    });
}

let nameDocument = getDocumentName(); //To know Page Name
console.log(nameDocument);

let quantityInput;
let quantity = localStorage.getItem("counterCart");

if (quantity == null) {
    quantity = 0;
    localStorage.setItem("counterCart", quantity);
}

let foodProduct = {};

let cart = document.querySelector(".cart");
let cartCounter = cart.querySelector(".productCounter");
let showCart = document.querySelector(".cartContainer");
let itemContainer = document.querySelector(".items");
let cartContent = document.querySelector(".content");

const addTopProducts = (set) => {
    //Function to add three items to Top List
    while (set.size != 3) {
        let number = parseInt(Math.random() * 20);
        set.add(shopList[number]);
    }
};

/**  
 * * Se implemento local Storage para verificar si la API fue leida
*/
let isAPIReady = localStorage.getItem('isAPIReady');
if(isAPIReady == null){
    isAPIReady = false;
    localStorage.setItem('isAPIReady', isAPIReady);
}

/**  
 * * Se implemento esta funcion para obtener los datos del inventario desde una API, en este caso interna
*/

if (shopList == null) {
    fetch('./shopList.json')
        .then(response => response.json())
        .then(data => {
            shopList = data;
            
            shopList.forEach(item => {
                addProduct(item);
            })
            localStorage.setItem("shopList", JSON.stringify(shopList));
        })
        .catch(error => console.log('Tu error es:', error))
        .finally(()=>{
            if (topList == null) {
                let topListSet = new Set();
                addTopProducts(topListSet);
                topList = Array.from(topListSet);
                localStorage.setItem("topList", JSON.stringify(topList));
            }
            isAPIReady = true;
            printTopList();
            makeCarrousel();
            localStorage.setItem('isAPIReady', isAPIReady);
            console.log('Done', shopList);
        })

}


let index = 0;
let isReady = false;
let showClear = false;

let cartList = JSON.parse(localStorage.getItem("cartList"));
let cartListNode = [];
if (!cartList) {
    cartList = [];
    clearCart();
} else {
    cartList.forEach((product) => {
        addingToCart(product);
    });
    updateCartCounter();
    showInfoCart();
}

/************************************************************************************/

/*********************************************************************************/
//JavaScript File for index.html
/*********************************************************************************/
/*********************************************************************************/

if (nameDocument == "index.html" || nameDocument == "") {
    //Carrousel Library implementation
    
    if(isAPIReady){
        for (let item of shopList) {
            addProduct(item);
        }
        printTopList();
        makeCarrousel();
    }
}

/*********************************************************************************/
//JavaScript File for login.html
/*********************************************************************************/

if (nameDocument == "login.html") {
    let btnLogin = document.querySelector(".btnLogin");
    let inputArrayPlaceholder = ["Name", "Price", "Url Image"];
    let btnAddProduct;

    btnLogin.addEventListener("click", function () {
        let username = document.querySelector(".user").value;
        let password = document.querySelector(".pass").value;
        if (username == "" && password == "") {
            alert("Please enter your username and password");
        } else if (username == "admin" && password == "admin") {
            showInputAddProduct();
        } else {
            alert("Wrong username or password");
        }
    });

    function showInputAddProduct() {
        let addProductContainer = document.createElement("div");
        addProductContainer.className = "loginContent";
        document
            .querySelector(".containerLogin")
            .appendChild(addProductContainer);
        document.querySelector(".login").remove();
        for (let i = 0; i < 3; i++) {
            let input = document.createElement("input");
            input.className = `inputAddProduct`;
            if (i == 2) {
                let input = document.createElement("div");
                input.className = `inputAddProduct`;
                input.id = "url";
                let btnImg = document.createElement("input");
                btnImg.type = "file";
                btnImg.className = "btnImg";
                btnImg.setAttribute("accept", "image/*");
                addProductContainer.appendChild(input);
                input.appendChild(btnImg);
                break;
            }
            input.placeholder = inputArrayPlaceholder[i];
            input.id = inputArrayPlaceholder[i].toLowerCase();
            addProductContainer.appendChild(input);
        }
        btnAddProduct = document.createElement("button");
        btnAddProduct.className = "btnAddProduct";
        btnAddProduct.innerHTML = "Add Product";
        addProductContainer.appendChild(btnAddProduct);
        addNewProduct();
    }

    function addNewProduct() {
        btnAddProduct.addEventListener("click", function () {
            let name = document.querySelector("#name").value;
            let price = document.querySelector("#price").value;
            let url = document.querySelector("#url input[type='file']").value;
            url = url.substring(url.lastIndexOf("\\") + 1);
            if (name == "" || price == "" || url == "") {
                alert("Please enter all the fields");
            } else {
                let product = new Product(name, price, `img/${url}`);
                shopList.push(product);
                localStorage.setItem("shopList", JSON.stringify(shopList));
            }
        });
    }

    function deleteLastProduct() {
        let lastProduct = shopList.pop();
        localStorage.setItem("shopList", JSON.stringify(shopList));
        return lastProduct;
    }
}

/*********************************************************************************/
//Global
/*********************************************************************************/

let clear = document.querySelector(".clear");
clear.addEventListener("click", function () {
    clearCart();
});

function getDocumentName() {
    return self.location.href.substring(
        self.location.href.lastIndexOf("/") + 1
    );
}

cart.addEventListener("click", function (e) {
    if (e.target.classList.contains("cart")) {
        showCart.style.contentVisibility = "visible";
        cart.style.transform = "scale(1.2)";
        cart.style.animation = "none";
    } else if (e.target.classList.contains("close")) {
        showCart.style.contentVisibility = "hidden";
        cart.style.transform = "scale(1)";
        cart.style.animation = "none";
    }
});

//esta bien este
function addProduct(item) {
    let container = document.createElement("div");
    let img = document.createElement("img");
    let info = document.createElement("div");
    let name = document.createElement("span");
    let price = document.createElement("span");
    let button = document.createElement("button");
    let infoContainer = document.createElement("div");
    infoContainer.className = "product";
    container.className = "item";
    info.className = "child";
    name.className = "text";
    price.className = "text";
    price.innerHTML = `$${item.price}.00`;
    name.innerHTML = item.name;
    button.className = `addCart`;
    button.id = `${item.name}`;
    button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`;

    itemContainer.appendChild(container);
    info.appendChild(infoContainer);
    container.appendChild(img);
    container.appendChild(info);
    infoContainer.appendChild(name);
    infoContainer.appendChild(price);
    info.appendChild(button);

    img.style.contentVisibility = "visible";
    img.style.backgroundImage = `url('${item.img}')`;
}
/**************************************************************/

//addItemToCart(shopList[1]);

function addItemToCart(product) {
    if (isOnCart(product)) {
        return false;
    } else {
        product.quantCart = 1;
        addingToCart(product);
        cartList.push(product);
        localStorage.setItem("cartList", JSON.stringify(cartList));
        return true;
    }
}

function addingToCart(product) {
    let htmlNode = document.createElement("li");
    htmlNode.className = "newItem";
    let img = document.createElement("img");
    img.className = "imgList";
    htmlNode.appendChild(img);
    let text = document.createElement("span");
    text.className = "name";
    htmlNode.appendChild(text);
    text.innerHTML = product.name;
    let input = document.createElement("input");
    let containerInput = document.createElement("span");
    containerInput.className = "quant-container";
    input.className = "quantity";
    input.id = `${product.name}`;
    input.type = "number";
    input.min = "0";
    input.max = "10";
    input.value = `${product.quantCart}`;
    htmlNode.appendChild(containerInput);
    containerInput.appendChild(input);
    let price = document.createElement("span");
    let erase = document.createElement("i");
    erase.setAttribute("class", "fa-solid fa-delete-left");
    price.className = "price";
    price.id = `price${product.name}`;
    htmlNode.appendChild(price);
    htmlNode.appendChild(erase);
    price.innerHTML = `$${product.price}.00`;
    img.style.backgroundImage = `url('${product.img}')`;
    addEventInput(input);
    addRemoveButton(erase, product);
    cartListNode.push(htmlNode);
    cartListNode.sort((a,b) => a.querySelector(".name").innerText > b.querySelector(".name").innerText ? 1 : -1);
    cartListNode.forEach(product =>{
        cartContent.appendChild(product);
    })
}

function isOnList(identifier) {
    return shopList.includes(identifier);
}

function clearCart(showClear) {
    if (cartList.length > 0) {
        cartList.forEach(function (item) {
            item.quantCart = 0;
        });
    }
    cartList = [];
    cartListNode = [];
    cartContent.innerHTML = "";
    document.querySelector(".total").innerHTML = "$0.00";
    document.querySelector(".total").style.display = "none";
    let list = document.createElement("li");
    list.className = "newItem empty";
    cartContent.appendChild(list);
    let img = document.createElement("img");
    img.className = "emptyCart";
    list.appendChild(img);
    let text = document.createElement("span");
    text.className = "name empty";
    list.appendChild(text);
    text.innerHTML = "Cart is empty";
    list.style.flexFlow = "column nowrap";
    img.style.backgroundImage = "url('img/shopping-cart-empty.png')";

    list.style.color = "var(--sixth)";
    text.style.filter = "opacity(0.2)";
    text.style.marginBottom = "30px";
    img.style.filter = "opacity(0.2)";
    quantity = 0;

    cartCounter.innerHTML = 0;
    cartCounter.style.display = "none";
    cartContent.style.borderRadius = "0 0 20px 20px";
    document.querySelector(".titles").style.contentVisibility = "hidden";
    document.querySelector(".titles").style.backgroundColor = "var(--first)";
    document.querySelector(".titles").style.height = "0";
    document.querySelector(".total").style.height = "0";

    localStorage.setItem("counterCart", quantity);
    localStorage.removeItem("cartList");

    if (showClear) {
        showAlert("Cart is clean");
    } else {
        showClear = true;
    }
}

function isOnCart(product) {
    //Search for the name of a product in the CartList
    let { name: search } = product;
    let isOnCart = false;
    cartList.forEach((product) => {
        let { name } = product;
        if (name === search) {
            isOnCart = true;
            return;
        }
    });
    return isOnCart;
}

/*********************************************************************************/
//Events
/*********************************************************************************/


//function to add event to buttons on shoplist
function getEventsBtn(){
    let btnAddCart = document.querySelectorAll(".addCart");

    for (let btn of btnAddCart) {
        addAllButtons(btn);
        btn.addEventListener("click", function () {
            addButtonToCart(btn.id);
        });
    }
}

getEventsBtn();
/*********************************************************************************/

function getTotal(name) {
    let total = 0;
    for (let element of cartList) {
        total = total + element.price * element.quantCart;
    }
    document.querySelector(".total").innerHTML = `$${total}.00`;
    if (name) {
        let product = cartList.find((item) => item.name == name);
        let price;
        cartListNode.forEach((item) => {
            if (item.innerHTML.includes(product.name)) {
                price = item;
            }
        });
        price.querySelector(".price").innerHTML = `$${
            product.price * product.quantCart
        }.00`;
    }
}

function addEventInput(input) {
    input.addEventListener("change", function () {
        let product = cartList.find((item) => item.name == input.id);
        product.quantCart = input.value;
        localStorage.setItem("cartList", JSON.stringify(cartList));
        if (input.value == 0) {
            removeItemFromCart(product);
        } else if (input.value > 10) {
            alert("You can't add more than 10 items");
            input.value = 10;
        } else {
            getTotal(input.id);
            updateCartCounter();
        }
    });
}

function addToShop(item) {
    if (shopList.includes(item)) {
        alert("Product already on list");
    } else {
        shopList.push(item);
    }
}

function addAllButtons(button) {
    button.addEventListener("click", function (e) {
        button.style.animation = "increaseButton .25s ease-in-out normal";
        setTimeout(function () {
            button.style.animation = "";
        }, 250);
    });
}

function removeItemFromCart(product) {
    cartListNode.forEach(function (item) {
        if (item.innerHTML.includes(product.name)) {
            item.remove();
            cartListNode.splice(cartListNode.indexOf(item), 1);
            cartList.splice(cartList.indexOf(product), 1);

            localStorage.setItem("cartList", JSON.stringify(cartList));
            localStorage.setItem("cartListNode", JSON.stringify(cartListNode));
        }
    });
    getTotal();
    updateCartCounter();
    if (cartList.length == 0) {
        clearCart();
    }
}

function addButtonToCart(name) {
    let product = shopList.find((item) => item.name == name);
    let isDone = addItemToCart(product);
    if (isDone) {
        quantity++;
        localStorage.setItem("counterCart", quantity);
        cartCounter.innerHTML++;
        cartCounter.style.display = "flex";
        if (quantity == 1) {
            document.querySelector(".empty").remove();
        }
        showInfoCart();
        showAlert("Product Added");
        orderProducts();
    } else {
        showAlert("Product Already In Cart");
    }
}


function showInfoCart() {
    document.querySelector(".titles").style.contentVisibility = "visible";
    document.querySelector(".titles").style.height = "50px";
    document.querySelector(".titles").style.backgroundColor = "var(--seventh)";
    document.querySelector(".total").style.display = "block";
    document.querySelector(".total").style.height = "30px";
    getTotal();
}

function showAlert(string) {
    setTimeout(function () {}, 1000);
    let alertBox = document.createElement("div");
    let alert = document.createElement("div");
    alertBox.id = "alertBox";
    alert.id = "alert";
    alertBox.appendChild(alert);
    document.querySelector("body").append(alertBox);
    alertBox.style.display = "flex";
    alertBox.style.opacity = 1;
    alert.innerText = string;
    setTimeout(function () {
        alertBox.style.opacity = 0;
    }, 200);
    setTimeout(function () {
        alertBox.style.display = "none";
        alertBox.remove();
    }, 3000);
}

function updateCartCounter() {
    quantity = 0;
    for (let element of cartList) {
        quantity += Number(element.quantCart);
    }
    cartCounter.innerHTML = quantity;
    if (quantity > 0) {
        cartCounter.style.display = "flex";
    }
    quantity == 0 ? clearCart() : quantity;
    localStorage.setItem("counterCart", quantity);
}

//Scroll event for animation

let lastScroll = 0;
let initFirstCount = true;
let initSecondCount = false;
let scrollDown = $(".angles-down");
let scrollUp = $(".angles-up");
let isScrolling;

scrollUp.hide();
scrollDown.hide();

//**console.log('Tamanio', document.body.clientHeight - window.innerHeight); //calcular el espacio disponible del scroll

window.addEventListener("scroll", (e) => {
    scroll = window.pageYOffset;

    isScrolling = true;
    if (scroll > lastScroll) {
        //console.log('down');
        if (scroll == document.body.clientHeight - window.innerHeight) {
            scrollDown.hide();
        } else {
            scrollDown.show();
            scrollUp.hide();
        }
        if (initFirstCount) {
            setTimeout(() => {
                initFirstCount = false;
                initSecondCount = true;
            }, 500);
            scrollDown.addClass("angles-down-an");
        } else if (initSecondCount) {
            setTimeout(() => {
                initFirstCount = true;
                initSecondCount = false;
            }, 500);
            scrollDown.removeClass("angles-down-an");
        }
    } else {
        //console.log('up');\
        if (scroll == 0) {
            scrollUp.hide();
        } else {
            scrollDown.hide();
            scrollUp.show();
        }
        if (initFirstCount) {
            setTimeout(() => {
                initFirstCount = false;
                initSecondCount = true;
            }, 500);
            scrollUp.addClass("angles-up-an");
        } else if (initSecondCount) {
            setTimeout(() => {
                initFirstCount = true;
                initSecondCount = false;
            }, 500);
            scrollUp.removeClass("angles-up-an");
        }
    }
    lastScroll = scroll;

    isScrolling = false;
});

function addRemoveButton(button, product) {
    button.addEventListener("click", () => {
        removeItemFromCart(product);
    });
}
//Check for hide the scroll animation
setInterval(() => {
    if (!isScrolling) {
        scrollUp.hide();
        scrollDown.hide();
    }
}, 500);


function printTopList(){
    let cont = 0;
    let index = 0;
    while(cont < 6){
        if(cont == 3){
            index = 0;
        }
        let slide = document.querySelector('.slide');
        let sliderItem = document.createElement('div');
        let img = document.createElement('img');
        let overlay = document.createElement('div');
        let overlayName = document.createElement('span');
        let overlayPrice = document.createElement('span');
        let icon = document.createElement('i');
        
        let {price : topPrice} = topList[index];
        let {name : topName} = topList[index];

        sliderItem.className = 'slider-item';
        overlay.className = 'overlay';
        overlayName.className = 'overlay-name';
        overlayPrice.className = 'overlay-price';
    
        icon.setAttribute('class', 'fa-solid fa-cart-shopping icon-overlay');
        img.setAttribute('src', topList[index].img);
        
        overlayName.innerHTML = topName;
        overlayPrice.innerHTML = `$${topPrice}`;
        
        icon.addEventListener('click', () => {
            addButtonToCart(topName);
        });

        slide.appendChild(sliderItem);
        sliderItem.appendChild(img);
        sliderItem.appendChild(overlay);
        overlay.appendChild(overlayName);
        overlay.appendChild(overlayPrice);
        sliderItem.appendChild(icon);

        index++;
        cont++;
    }
}

function orderProducts(option){
    option = parseInt(option);
    let update;
    update = new Promise((myResolve, myReject) =>{
        if(option){
            switch(option){
                case 1:
                    shopList.sort((a ,b) => (Math.random()*10) > (Math.random()*10) ? 1 : -1);
                    break;
                case 2:
                    shopList.sort((a, b) => a.name[0] > b.name[0] ? 1 : -1);
                    break;
                case 3:
                    shopList.sort((a ,b) => a.price - b.price);
                    break;
            }
            localStorage.setItem('shopList', JSON.stringify(shopList));
            myResolve(shopList);
        }
        else{
            cartList.sort((a ,b) => a.name[0] > b.name[0] ? 1 : a.name[0] < b.name[0] ? -1 : 0);
            myReject(cartList);
            console.log(cartListNode);
            localStorage.setItem("cartList", JSON.stringify(cartList));
        }
        });

    update
    .then(()=> {
        itemContainer.remove();
        itemContainer = document.createElement('div');
        itemContainer.className = 'container items';
        let body = document.querySelector('.mainContent');
        body.appendChild(itemContainer);
        shopList.forEach(item => {
            addProduct(item);
        });
        getEventsBtn();
    })
    .catch(() =>{
        cartListNode.forEach(product => {
            cartContent.appendChild(product);
        })
    })

}

let sortingList = $(".orderList");
sortingList.bind("change", (e) =>{
    let value = sortingList.val();
    orderProducts(value);
    console.log(value);
});


//to prevent closing login container

$(".user").bind('click', (e)=>{
    e.preventDefault()
    $(".user").addClass('userActive');
    $(".fa-user").addClass('fa-user-active');
    $(".form-user").addClass('form-user-active');
})

//to close login container by default

$("body").bind('click', (e)=>{
    e.preventDefault()
    if (!$(e.target).closest('.form-user').length) {
        $(".user").removeClass('userActive');
        $(".fa-user").removeClass('fa-user-active');
        $(".form-user").removeClass('form-user-active');
    }    
})

let user = JSON.parse(localStorage.getItem('user'));
let loginCont = document.querySelector('.user');
console.log(loginCont);
if(!user){
    //to login as user or admin
    loginCont.innerHTML = `
    <form class="form-user" action="submit">
    <input class="inLog" type="text">
    <input class="inLog" type="password" name="" id="">
    <div class="logButton">
        <button class="btnlog login-btn">Login</button>
        <button class="btnlog register-btn">Register</button>
    </div>
    </form>
    <i class="fa-solid fa-user"></i>
    `
    $('.login-btn').bind('click', (e) =>{
        if($('.inLog')[0].value === 'admin'){
            if($('.inLog')[1].value == 'admin'){
                showAlert('Logged As Admin');
                user = new User($('.inLog')[0].value, true)
                localStorage.setItem('user', JSON.stringify(user));
                loginCont.innerHTML = `
                        <span>Hello ${user.name}</span>
                        <i class="fa-solid fa-user"></i>
                        `
                $('.fa-user').addClass('icon-name');
            }
        }
        else{
            fetch('./login.json')
            .then(response => response.json())
            .then(data => {
                let login = data;
                let position = -1;
                login.forEach((element, index) =>{
                    if(element.name === $('.inLog')[0].value){
                        position = index;
                    }
                });
                if(position >= 0){
                    if($('.inLog')[1].value === login[position].pass){
                        showAlert('Logged');
                        user = new User($('.inLog')[0].value, false);
                        localStorage.setItem('user', JSON.stringify(user));
                        loginCont.innerHTML = `
                                <span>Hello ${user.name}</span>
                                <i class="fa-solid fa-user"></i>
                                `
                        $('.fa-user').addClass('icon-name');
                    }
                }
                else{
                    showAlert('Invalid Data');
                }
            })
            .catch(error => console.log('Tu error es:', error));
        }
    })
}
else{
    loginCont.innerHTML = `
            <span>Hello ${user.name}</span>
            <i class="fa-solid fa-user"></i>
            `
    $('.fa-user').addClass('icon-name');
}
