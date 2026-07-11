/*=========================================================
    SEPRECA PROJECT HUB
    APP.JS
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    // Inicializar aplicación
    initializeApp();

});

function initializeApp(){

    hideLoader();

}

/*=========================================================
    OCULTAR LOADER
=========================================================*/

function hideLoader(){

    const loader = document.getElementById("loader");

    if(!loader){

        console.warn("Loader no encontrado.");

        return;

    }

    setTimeout(()=>{

        loader.style.opacity = "0";

        loader.style.pointerEvents = "none";

        setTimeout(()=>{

            loader.style.display = "none";

        },500);

    },1000);

}
