const contenedor = document.getElementById("lista_pedidos");
const contador = document.getElementById("count");
const menu = document.getElementById("menu");
const ordenes = document.getElementById("ordenes");
const btn_entregar = document.getElementById("delate");
const btns_menu = document.querySelectorAll(".div_item_btn");
const mensaje = document.getElementById("mensaje");
const audio = document.getElementById("audio");

let arreglo_comidas = [];


//clase para los objetos de la comida
class Plato{
    constructor(name, state, price, image) {
        this.name = name;
        this.state = state;
        this.price = price;        
        this.image = image
    }
}

const img1 = "./IMG/2082063.png";
const img2 = "./IMG/4839185.png";
const img3 = "./IMG/fast-food-icons-freeburger_107425.png";


//se crea el objeto con sus argumentos 
c1 = new Plato("EGGS", "Hervido", 40,img1)
c2 = new Plato("CHIKEN", "Hervido", 50,img2)
c3 = new Plato("BURGER", "Frita", 60, img3)


//funcion de intervalo para el timer de los pedidos 
const intervalo = setInterval(function(){
    let comidas = [c1, c2, c3];
    let random = Math.floor(Math.random() * comidas.length)

    // se obtiene un objeto de lospredifinidos para utilizarlo
    const comida = new Plato(comidas[random].name, comidas[random].state, comidas[random].price, comidas[random].image);

    //se agrega el objeto al array
    arreglo_comidas.push(comida);

    //se crea el div para la interfaz del pedido con sus clases
    const div = document.createElement("div");
    div.classList.add("div_item", "div_item_menu");

    //se le asigna un identificador para mas precision
    comida.div = div;

    //se le agrega a la interfaz con sus componentes visibles
    div.innerHTML = `
        <img src="${comida.image}" alt="${comida.name}" class="plato_img">
        <div class="info_comida">
            <p>${comida.name}</p>
            <p>${comida.state}</p>
            <p>$${comida.price}</p>
        </div>`;

    //se agrega el objeto a la interfaz de pedidos
    contenedor.appendChild(div);

    //contador de las ordenes
    ordenes.textContent = `${arreglo_comidas.length}`


    //condicional del limite de ordenes acumuladas
    if(arreglo_comidas.length >= 10){
        ordenes.textContent = "PERDISTE";
        clearInterval(intervalo);
        return
    }
}, 750)//tiempo en que se agrega una nueva orden


//se usa un for para agregar las comidas existentes al menu
let comidas = [c1, c2, c3]
for(let i = 0; i < comidas.length; i++){
    const comida = comidas[i]

    const div = document.createElement("button"); //se agrega como button para utilidad

    div.classList.add("div_item", "div_item_btn");

    //igualmente los componentes graficos de cada comida
    div.innerHTML = `
        <img src="${comida.image}" alt="${comida.name}" class="plato_img">
        <div class="info_comida">
            <p>${comida.name}</p>
            <p>${comida.state}</p>
            <p>$${comida.price}</p>
        </div>`;

    menu.appendChild(div);

        div.addEventListener("click", () => {
        // quitar selección de otros botones
        const todos = document.querySelectorAll(".div_item_btn");

        //se elimina la siguiente clase por si se agrega por error a algo mas 
        todos.forEach(b => b.classList.remove("selected"));

        // agregar selección al clickeado
        div.classList.add("selected");
    });
}




//funcion para entregar la comida 
function entregar_comida(){
    const primerPedido = arreglo_comidas[0];
    const seleccionado = document.querySelector(".div_item_btn.selected");

    if(!seleccionado){
        return;
    }

    // el nombre del plato escogido
    const nombreSeleccionado = seleccionado.querySelector("p").textContent;

    if(nombreSeleccionado === primerPedido.name){

        // quitar del array y de la pantalla
        contenedor.removeChild(primerPedido.div)
        arreglo_comidas.shift(); // elimina el primer elemento

        //se actualiza el counter una vez eliminado
        ordenes.textContent = `${arreglo_comidas.length}`;


    } else {

        audio.src = "./AUDIOS/wrong.mp3";
        audio.playbackRate = 2;
        audio.play();
    }
}

// se agrega la funcion al evento del boton
btn_entregar.addEventListener("click", function(){
    entregar_comida();
});

//evento con teclas 
//espacio para entregar ordenes
document.addEventListener("keydown", function(event){
    if(event.code === "Space"){ //tecla espacio
        //se llama a la funcion
        entregar_comida();

        //se agrega scale para refuerzo visual
        btn_entregar.style.transform = "Scale(0.9)";
        
        //se elimina despues de un intervalo
        setTimeout(function(){
            btn_entregar.style.transform = "Scale(1)";
        }, 100);
    }
});

//flechas para escoger entre opciones
let index = 0;

document.addEventListener("keydown", function(e){
    const botones = menu.querySelectorAll(".div_item_btn");

    if(e.code === "ArrowDown"){
        e.preventDefault(); //previene un scroll
        index = (index + 1) % botones.length
        actualizar_seleccion(botones);
    }

    if(e.code === "ArrowUp"){
        e.preventDefault(); //previene un scroll
        index = (index - 1) % botones.length
        actualizar_seleccion(botones);
    }

});

//funcion para manejar las clases en el focus
function actualizar_seleccion(botones){
    botones.forEach(b => b.classList.remove("selected"));
    botones[index].classList.add("selected");
    botones[index].focus();
}