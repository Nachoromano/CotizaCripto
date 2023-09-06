const criptoMonedaSelec = document.querySelector('#criptomonedas');
const MonedaSelec = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

//crear promise
const obtenercripto = criptomonedas => new Promise(resolve =>{
   resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded',()=>{
    consultarCripto();

    formulario.addEventListener('submit',submitFormulario);

    criptoMonedaSelec.addEventListener('change',leerValor);

    MonedaSelec.addEventListener('change',leerValor);

})

async function consultarCripto(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

     try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomoneda = await obtenercripto(resultado.Data);
        selectCriptomonedas(criptomoneda)
     } catch (error) {
        console.log(error);
     }
}


function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto =>{
        const {FullName,Name} = cripto.CoinInfo;

        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;
        criptoMonedaSelec.appendChild(option);

        })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    //validar
    const {moneda,criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios ')
        return;
    }

    //Consultar la API con los resultados
    consultarAPI();

}

function mostrarAlerta(msj){

    const existeError = document.querySelector('.error')

    if(!existeError){ //Esto es para q no haya mas de 1 mensaje de error
        
    const divmensaje = document.createElement('div');
    divmensaje.classList.add('error');

    //Mensaje de error
    divmensaje.textContent = msj

    formulario.appendChild(divmensaje)

    setTimeout(()=>{
        divmensaje.remove();
    },2000)
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

      try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
      } catch (error) {
        console.log(error);
      }
}

function mostrarCotizacionHTML (cotizacion){
    limpiarHTML();

    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span> </p>`

    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}</span> </p>`


    const UltHoras = document.createElement('p')
    UltHoras.innerHTML = `<p>Variacion ultimas 24horas: <span>${CHANGEPCT24HOUR}%</span> </p>`

    const ultActualizacion = document.createElement('p')
    ultActualizacion.innerHTML = `<p>Variacion ultimas 24horas: <span>${LASTUPDATE}</span> </p>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)  
    resultado.appendChild(UltHoras)
    resultado.appendChild(ultActualizacion)  
}

function limpiarHTML (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;
    resultado.appendChild(spinner)
}
