/*=============================================================================
    SEPRECA PROJECT HUB

    GANTT.JS
    PARTE 1

    Motor principal del cronograma
=============================================================================*/


document.addEventListener(
    "DOMContentLoaded",
    () => {


        initGantt();


    }
);



/*=============================================================================
    DATOS DEL PROYECTO

    Posteriormente serán reemplazados
    por los datos provenientes del Excel
=============================================================================*/


const ganttData = [

    {

        id:1,

        name:"Diagnóstico y levantamiento",

        start:"2025-01-06",

        end:"2025-01-17",

        progress:100,

        status:"completed"

    },


    {

        id:2,

        name:"Proyecto arquitectónico",

        start:"2025-01-20",

        end:"2025-02-14",

        progress:85,

        status:"progress"

    },


    {

        id:3,

        name:"Adecuación Biblioteca",

        start:"2025-02-17",

        end:"2025-03-21",

        progress:60,

        status:"progress"

    },


    {

        id:4,

        name:"Intervención Oficinas",

        start:"2025-03-24",

        end:"2025-04-25",

        progress:25,

        status:"progress"

    },


    {

        id:5,

        name:"Baños y servicios",

        start:"2025-04-28",

        end:"2025-05-23",

        progress:0,

        status:"pending"

    },


    {

        id:6,

        name:"Entrega y cierre",

        start:"2025-05-26",

        end:"2025-06-06",

        progress:0,

        status:"pending"

    }


];



/*=============================================================================
    CONFIGURACIÓN
=============================================================================*/


const ganttConfig = {


    dayWidth:14,


    rowHeight:58,


    startDate:new Date("2025-01-01"),


    today:new Date()


};



/*=============================================================================
    INICIO
=============================================================================*/


function initGantt(){


    createTasks();


    createScale();


    createBars();


    updateDashboard();


}

/*=============================================================================
    GANTT.JS
    PARTE 2

    Escala temporal + Actividades + Barras
=============================================================================*/


/*=============================================================================
    CREAR LISTA DE ACTIVIDADES
=============================================================================*/

function createTasks(){

    const container = document.getElementById("ganttTasks");

    if(!container) return;

    container.innerHTML = "";

    ganttData.forEach(task=>{

        const row = document.createElement("div");

        row.className = "gantt-task";

        row.dataset.id = task.id;

        row.innerHTML = `

            <span>${task.name}</span>

        `;

        container.appendChild(row);

    });

}


/*=============================================================================
    CREAR ESCALA DE MESES
=============================================================================*/

function createScale(){

    const scale = document.getElementById("ganttScale");

    if(!scale) return;

    scale.innerHTML="";

    const months=[

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio"

    ];

    months.forEach(month=>{

        const item=document.createElement("div");

        item.className="gantt-month";

        item.textContent=month;

        scale.appendChild(item);

    });

}


/*=============================================================================
    DIBUJAR BARRAS
=============================================================================*/

function createBars(){

    const bars=document.getElementById("ganttBars");

    if(!bars) return;

    bars.innerHTML="";

    ganttData.forEach((task,index)=>{

        const row=document.createElement("div");

        row.className="gantt-row";

        row.style.height=ganttConfig.rowHeight+"px";

        bars.appendChild(row);

        drawTaskBar(task,index,row);

    });

}


/*=============================================================================
    DIBUJAR UNA ACTIVIDAD
=============================================================================*/

function drawTaskBar(task,index,row){

    const start=new Date(task.start);

    const end=new Date(task.end);

    const offset=getDaysBetween(
        ganttConfig.startDate,
        start
    );

    const duration=getDaysBetween(
        start,
        end
    )+1;

    const left=offset*ganttConfig.dayWidth;

    const width=duration*ganttConfig.dayWidth;

    const bar=document.createElement("div");

    bar.className=`gantt-bar ${task.status}`;

    bar.style.left=left+"px";

    bar.style.width=width+"px";

    bar.innerHTML=`

        <div
            class="gantt-progress"
            style="width:${task.progress}%">

        </div>

        <span class="gantt-label">

            ${task.name}

        </span>

        <span class="gantt-duration">

            ${duration} d

        </span>

    `;

    row.appendChild(bar);

}


/*=============================================================================
    CALCULAR DÍAS
=============================================================================*/

function getDaysBetween(start,end){

    const oneDay=1000*60*60*24;

    return Math.floor(

        (end-start)/oneDay

    );

}

/*=============================================================================
    GANTT.JS
    PARTE 3

    Dashboard • Línea HOY • Tooltips • Interacción
=============================================================================*/


/*=============================================================================
    ACTUALIZAR DASHBOARD
=============================================================================*/

function updateDashboard(){

    const totalActivities = ganttData.length;

    const totalDays = getProjectDuration();

    const averageProgress = Math.round(

        ganttData.reduce((sum, task) => sum + task.progress, 0) /
        totalActivities

    );

    const daysElement = document.getElementById("daysTotal");
    const activitiesElement = document.getElementById("activitiesTotal");
    const progressElement = document.getElementById("progressTotal");
    const progressLabel = document.getElementById("progressLabel");
    const progressFill = document.getElementById("progressFill");

    if(daysElement){

        daysElement.textContent = totalDays + " días";

    }

    if(activitiesElement){

        activitiesElement.textContent = totalActivities;

    }

    if(progressElement){

        progressElement.textContent = averageProgress + "%";

    }

    if(progressLabel){

        progressLabel.textContent = averageProgress + "%";

    }

    if(progressFill){

        progressFill.style.width = averageProgress + "%";

    }

    drawTodayLine();

    enableInteractions();

}


/*=============================================================================
    DURACIÓN TOTAL
=============================================================================*/

function getProjectDuration(){

    const starts = ganttData.map(task => new Date(task.start));

    const ends = ganttData.map(task => new Date(task.end));

    const first = new Date(Math.min(...starts));

    const last = new Date(Math.max(...ends));

    return getDaysBetween(first, last) + 1;

}


/*=============================================================================
    LÍNEA HOY
=============================================================================*/

function drawTodayLine(){

    const todayLine = document.querySelector(".today-line");

    if(!todayLine) return;

    const offset = getDaysBetween(

        ganttConfig.startDate,

        ganttConfig.today

    );

    todayLine.style.left =

        (offset * ganttConfig.dayWidth) + "px";

}


/*=============================================================================
    INTERACCIONES
=============================================================================*/

function enableInteractions(){

    const tasks = document.querySelectorAll(".gantt-task");

    const bars = document.querySelectorAll(".gantt-bar");

    tasks.forEach((task,index)=>{

        task.addEventListener("mouseenter",()=>{

            task.classList.add("active");

            if(bars[index]){

                bars[index].classList.add("selected");

            }

        });

        task.addEventListener("mouseleave",()=>{

            task.classList.remove("active");

            if(bars[index]){

                bars[index].classList.remove("selected");

            }

        });

    });

    bars.forEach((bar,index)=>{

        bar.addEventListener("mouseenter",(event)=>{

            if(tasks[index]){

                tasks[index].classList.add("active");

            }

            showTooltip(

                event,

                ganttData[index]

            );

        });

        bar.addEventListener("mousemove",(event)=>{

            moveTooltip(event);

        });

        bar.addEventListener("mouseleave",()=>{

            if(tasks[index]){

                tasks[index].classList.remove("active");

            }

            hideTooltip();

        });

    });

}


/*=============================================================================
    TOOLTIP
=============================================================================*/

let ganttTooltip = null;

function createTooltip(){

    ganttTooltip = document.createElement("div");

    ganttTooltip.className = "gantt-tooltip";

    document.body.appendChild(ganttTooltip);

}

function showTooltip(event, task){

    if(!ganttTooltip){

        createTooltip();

    }

    ganttTooltip.innerHTML = `

        <h4>${task.name}</h4>

        <p><strong>Inicio:</strong> ${task.start}</p>

        <p><strong>Fin:</strong> ${task.end}</p>

        <p><strong>Avance:</strong> ${task.progress}%</p>

        <p><strong>Estado:</strong> ${task.status}</p>

    `;

    ganttTooltip.classList.add("active");

    moveTooltip(event);

}

function moveTooltip(event){

    if(!ganttTooltip) return;

    ganttTooltip.style.left =

        (event.pageX + 20) + "px";

    ganttTooltip.style.top =

        (event.pageY + 20) + "px";

}

function hideTooltip(){

    if(!ganttTooltip) return;

    ganttTooltip.classList.remove("active");

}

/*=============================================================================
    GANTT.JS
    PARTE 4

    Scroll • Filtros • JSON • Actualización
=============================================================================*/


/*=============================================================================
    SINCRONIZAR SCROLL
=============================================================================*/

function syncScroll(){

    const left = document.getElementById("ganttTasks");
    const right = document.getElementById("ganttBars");

    if(!left || !right) return;

    right.addEventListener("scroll",()=>{

        left.scrollTop = right.scrollTop;

    });

}


/*=============================================================================
    FILTRAR ACTIVIDADES
=============================================================================*/

function filterTasks(status){

    const tasks = document.querySelectorAll(".gantt-task");
    const rows = document.querySelectorAll(".gantt-row");

    ganttData.forEach((task,index)=>{

        const visible =

            status==="all" ||

            task.status===status;

        if(tasks[index]){

            tasks[index].style.display =

                visible ? "flex" : "none";

        }

        if(rows[index]){

            rows[index].style.display =

                visible ? "block" : "none";

        }

    });

}


/*=============================================================================
    RECARGAR GANTT
=============================================================================*/

function refreshGantt(){

    createTasks();

    createScale();

    createBars();

    updateDashboard();

    syncScroll();

}


/*=============================================================================
    CARGAR DESDE JSON
=============================================================================*/

async function loadProject(url){

    try{

        const response = await fetch(url);

        if(!response.ok){

            throw new Error("No se pudo cargar el cronograma.");

        }

        const data = await response.json();

        if(Array.isArray(data)){

            ganttData.length = 0;

            data.forEach(item=>ganttData.push(item));

            refreshGantt();

        }

    }

    catch(error){

        console.error(error);

    }

}


/*=============================================================================
    EXPORTAR FUNCIONES
=============================================================================*/

window.Gantt={

    refresh:refreshGantt,

    filter:filterTasks,

    load:loadProject

};


/*=============================================================================
    INICIALIZACIÓN FINAL
=============================================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    syncScroll();

});
