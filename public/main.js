let mealsState = {};
let ruta = "login"; // login register, orders

window.onload = () => {
  renderApp();
};

const renderApp = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return RenderOrders();
  }
  RenderLogin();
};

////////////////
// Template Orders
////////////////
const RenderOrders = () => {
  const ordersView = document.getElementById("orders-view");
  document.getElementById("app").innerHTML = ordersView.innerHTML;
  inicializaFormulario();
  inicializaDatos();
};

const inicializaFormulario = () => {
  // Boton de envio de ordenes
  const orderForm = document.getElementById("order");
  orderForm.onsubmit = (e) => {
    e.preventDefault();
    const submit = document.getElementById("submit");
    submit.setAttribute("disabled", true);
    const mealID = document.getElementById("meals-id");
    const meanIdValue = mealID.value;
    if (!meanIdValue) {
      alert("Debes seleccionar un plato");
      return;
    }
    const order = {
      meal_id: meanIdValue,
      user_id: "Ivan Fernandez Gracia",
    };
    fetch("https://server-less-murex.vercel.app/api/orders", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "autorization": localStorage.getItem("token")
      },
      redirect: "follow",
      body: JSON.stringify(order),
    })
      .then((x) => x.json())
      .then((respuesta) => {
        const renderedOrder = renderOrder(respuesta, mealsState);
        const orderlist = document.getElementById("orders-list");
        orderlist.appendChild(renderedOrder);
        submit.removeAttribute("disabled");
      })
      .catch(() => {
        submit.removeAttribute("disabled");
      });
  };
};

const inicializaDatos = () => {
  // Cargar meals iniciales y ordenes iniciales

  fetch("https://server-less-murex.vercel.app/api/meals", {
    method: "GET", //POST DELETE
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "autorization": localStorage.getItem("token")
    },
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((data) => {
      mealsState = data;
      const mealslist = document.getElementById("meals-list");
      const submit = document.getElementById("submit");
      const listItemsHTML = data.map((meal) => renderItem(meal));
      listItemsHTML.forEach((element) => mealslist.appendChild(element));
      mealslist.removeChild(mealslist.firstElementChild);
      submit.removeAttribute("disabled");
      fetch("https://server-less-murex.vercel.app/api/orders", {
        method: "GET", //POST DELETE
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "autorization": localStorage.getItem("token")
        },
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((ordersData) => {
          const ordersList = document.getElementById("orders-list");
          const listOrders = ordersData.map((orderData) =>
            renderOrder(orderData, data)
          );
          ordersList.removeChild(ordersList.firstElementChild); //Cargando....
          listOrders.forEach((element) => ordersList.appendChild(element));
        });
    });
};

const stringToHtml = (s) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, "text/html");
  return doc.body.firstChild;
};
const renderItem = (item) => {
  const element = stringToHtml(`<li data-id=${item._id}> ${item.name}</li>`);
  element.addEventListener("click", () => {
    const mealslist = document.getElementById("meals-list");
    Array.from(mealslist.children).forEach((elementHTML) => {
      elementHTML.classList.remove("selected");
    });
    element.classList.add("selected");
    const mealIdInput = document.getElementById("meals-id");
    mealIdInput.value = item._id;
  });
  return element;
};

const renderOrder = (order, meals) => {
  const meal = meals.find((meal) => meal._id === order.meal_id);
  const element = stringToHtml(
    `<li data-id=${order._id}> ${meal?.name} - ${order.user_id}</li>`
  );
  return element;
};

////////////////
// Template Login
////////////////
const RenderLogin = () => {
  const loginTemplate = document.getElementById("login-template");
  document.getElementById("app").innerHTML = loginTemplate.innerHTML;
  const loginForm = document.getElementById("login-form");
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    ////////////////////////
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: email,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://server-less-murex.vercel.app/api/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        //console.log(data.token);
        //console.log(data["token"]);
        localStorage.setItem("token", data["token"]);
        ruta = "orders";
        RenderOrders();
      })
      .catch((error) => console.log("error", error));
  };
};
