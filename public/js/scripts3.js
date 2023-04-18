document.addEventListener('DOMContentLoaded', cargaWeb);
document.addEventListener('click', escondeDialogos);
/**
 * Función que rellena la Web según el escritorio elegido. 
 * Si se le pasa parámetro, carga el escritorio segun el nombre pasado como param. 
 * Si no carga el primero de la lista
 * @param {object|String} deskName 
 */
async function cargaWeb(deskName) {

    //Cargamos la lista de escritorios
    //TODO Control de errores si falla el fetch
    let res = await fetch("http://localhost:3001/escritorios", {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    let json = await res.json();

    let escritorioActual = "";

    //Si viene de recargar la página (DOMContentLoaded) usamos el primero
    if (typeof (deskName) === "object") {

        escritorioActual = json[0].name;

        //Si no el pasado como parametro
    } else {

        escritorioActual = deskName;
    }

    //Establecemos el valor de data-desk del body para identificarlo luego
    document.body.setAttribute('data-desk', `${escritorioActual}`);

    //Cambiamos el título según el escritorio que sea
    document.getElementById('deskTitle').innerText = `${escritorioActual}`;

    //Recargamos la lista de escritorios disponibles
    refreshDesktops(json);
    constructDesktops(json, escritorioActual);

    //Cargamos las columnas del escritorio elegido
    //TODO Control de errores si falla el fetch
    res = await fetch(`http://localhost:3001/columnas?escritorio=${escritorioActual}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    json = await res.json();

    //Añadimos los eventos de escritorio
    addDesktopEvents();

    //Declaramos la variable para pasar a ordenaCols
    let el = document.getElementById(`${escritorioActual}Cols`);

    //Refrescamos las columnas
    //console.log(localStorage.getItem(`Grupo${escritorioActual}Cols`));
    let ordenCols = localStorage.getItem(`Grupo${escritorioActual}Cols`);
    refreshColumns(json, ordenCols);

    //Añadimos los eventos de columnas
    addColumnEvents();

    //Cargamos cada Link en su columna correspondiente
    //TODO Control de errores si falla el fetch
    res = await fetch(`http://localhost:3001/links?escritorio=${escritorioActual}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    json = await res.json();

    const groupByPanel = json.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem);
        } else {
            acc[elem.panel] = [elem];
        }
        return acc;
    }, {});
    //console.log(groupByPanel);

    for (const panel in groupByPanel) {
        const items = groupByPanel[panel];
        refreshLinks(items);
        //console.log(panel);
        ordenaItems(panel);
    }

    //Añadimos los eventos de los links
    addLinkEvents();

    //Tiene que estar AQUI no antes o no funciona : por que?
    //ordenaCols(el);
}

//Manejo de Eventos

/**
 * Carga los manejadores de eventos para la manipulación de escritorios
 */
function addDesktopEvents() {

    //Agregar evento click a cada elemento de la lista de de selección escritorios
    document.querySelectorAll('.deskList').forEach(item => {
        item.removeEventListener('click', selectDesktop);
        item.addEventListener('click', selectDesktop);
    })

    // Agregar evento de clic al botón para agregar una columna
    document.querySelector('#addCol').removeEventListener('click', toggleDialogColumn);
    document.querySelector('#addCol').addEventListener('click', toggleDialogColumn);

    // Agregar evento de clic al botón para agregar un escritorio
    document.querySelector('#addDesk').removeEventListener('click', toggleDialogDesktop);
    document.querySelector('#addDesk').addEventListener('click', toggleDialogDesktop);

    // Agregar evento de clic al botón para editar un escritorio
    document.querySelector('#editDesk').removeEventListener('click', toggleDialogEditDesktop);
    document.querySelector('#editDesk').addEventListener('click', toggleDialogEditDesktop);

    // Agregar evento de clic al botón submit de editar un escritorio
    document.querySelector('#editdeskSubmit').removeEventListener('click', editDesktop);
    document.querySelector('#editdeskSubmit').addEventListener('click', editDesktop);

    // Agregar evento de clic al botón para eliminar un escritorio
    document.querySelector('#removeDesk').removeEventListener('click', deleteDesktop);
    document.querySelector('#removeDesk').addEventListener('click', deleteDesktop);

    //Añadir eventos en botones submit de crear escritorio
    document.querySelector('#deskSubmit').removeEventListener('click', createDesktop);
    document.querySelector('#deskSubmit').addEventListener('click', createDesktop);


}
/**
 * Carga los manejadores de eventos para la manipulación de columnas
 */
function addColumnEvents() {
    document.querySelector('#colSubmit').removeEventListener('click', createColumn);
    document.querySelector('#colSubmit').addEventListener('click', createColumn);

    document.querySelector('#editcolSubmit').removeEventListener('click', editColumn);
    document.querySelector('#editcolSubmit').addEventListener('click', editColumn);

}
/**
 * Carga los manejadores de eventos para la manipulación de links
 */
function addLinkEvents() {
    // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
    document.querySelector('#linkSubmit').removeEventListener('click', createLink);
    document.querySelector('#linkSubmit').addEventListener('click', createLink);

    // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
    document.querySelector('#editlinkSubmit').removeEventListener('click', editLink);
    document.querySelector('#editlinkSubmit').addEventListener('click', editLink);
}

//Manejo de escritorios

/**
 * Inserta un nodo en el DOM según la cantidad de escritorios
 * Oculta los inactivos y muestra el activo
 * @param {Object} json 
 * @param {String} escritorioActual 
 */
function constructDesktops(json, escritorioActual) {
    
    const groupByPanel = json.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem.name);
        } else {
            acc[elem.panel] = [elem.name];
        }
        return acc;
    }, {});

    for (const panel in groupByPanel) {
        const items = groupByPanel[panel];
        const $raiz = document.getElementById('cols');
        if ($raiz.hasChildNodes()) {
            while ($raiz.childNodes.length >= 1) {
                $raiz.removeChild($raiz.firstChild);
            }
        }
        items.forEach(element => {

            const $div = document.createElement('div');
            $div.setAttribute('class', 'cuerpo');
            $div.setAttribute('id', `${element}Cols`);
            $div.setAttribute('data-id', 'columns');
            $raiz.appendChild($div);
            $div.style.display = "none";
            if(`${element}Cols` === `${escritorioActual}Cols`) {
                $div.style.display = "flex";
            }
        })
    }

}
/**
 * 
 * @param {Object} event 
 */
function selectDesktop(event) {
    event.stopPropagation();
    let deskName = event.target.innerText;
    document.body.setAttribute('data-desk', deskName);
    cargaWeb(deskName);
}
async function editDesktop(params) {
    let nombreOld = document.body.getAttribute('data-desk');
    let nombre = document.getElementById('editdeskName').value;
    let body = { 'nombre': nombre, 'nombreOld': nombreOld }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/escritorios", {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    let json = await res.json();
    const firstKey = Object.keys(json)[0];
    const firstValue = json[firstKey];

    if (firstKey === "error") {
        $error = document.getElementById('editdeskError');
        $error.innerText = `${firstKey}, ${firstValue}`;
        
    } else {
        let dialog = document.getElementById('editDeskForm');
        let visible = dialog.style.display === 'flex';
        dialog.style.display = visible ? 'none' : 'flex';
        refreshDesktops(json);
        addDesktopEvents();
    }
    document.getElementById('deskTitle').innerText = `${nombre}`;

    //TODO Local storage
    let ordenCols = localStorage.getItem(`Grupo${nombreOld}Cols`);
    localStorage.setItem(`Grupo${nombre}Cols`, ordenCols);
    localStorage.removeItem(`Grupo${nombreOld}Cols`);
    console.log(ordenCols);
    
}
async function createDesktop(params) {
    let nombre = document.getElementById('deskName').value;
    let body = { 'nombre': nombre }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/escritorios", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    const firstKey = Object.keys(json)[0];
    const firstValue = json[firstKey];

    if (firstKey === "error") {
        $error = document.getElementById('deskError');
        $error.innerText = `${firstKey}, ${firstValue}`;
        //console.log(firstKey);
        //console.log(firstValue);
    } else {
        let dialog = document.getElementById('addDeskForm');
        let visible = dialog.style.display === 'flex';
        dialog.style.display = visible ? 'none' : 'flex';
        //console.log(json);
        refreshDesktops(json);
        addDesktopEvents();
    }

    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function deleteDesktop() {
    let text = "Estás seguro de querer eliminar\neste escritorio?";
    if (confirm(text) == true) {

        let nombre = document.body.getAttribute('data-desk');
        let body = { 'name': nombre }
        body = JSON.stringify(body)
        //console.log(JSON.stringify(body));
        let res = await fetch("http://localhost:3001/escritorios", {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: body
        })
        let json = await res.json();
        //console.log(json);
        cargaWeb(json[0].name);
    } else {
        alert('Borrado Cancelado')
    }
}
/**
 * FUnción que recarga la lista de escritorios disponibles
 * cuando carga la Web
 * @param {*} lista 
 */
function refreshDesktops(lista) {

    //Declaramos la raiz donde va la lista de escritorios
    const $raiz = document.getElementById('drpEscritorios');
    //Convertimos el Json en Array
    const arr = Array.from(lista);
    //Si la raiz tiene hijos los vaciamos todos
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.firstChild);
        }
    }

    arr.forEach(element => {
        const $nodos = document.createElement("a");
        $nodos.setAttribute('class', 'deskList')
        const $textos = document.createTextNode(`${element.name}`)

        $nodos.appendChild($textos)
        $raiz.appendChild($nodos)
    })
}

//Manejo de columnas

async function editColumn(event) {
    //console.log("Se ejecuta editColumn");
    let nombre = document.getElementById('editcolName').value;
    let escritorio = document.body.getAttribute('data-desk');
    let nombreOld = document.body.getAttribute('data-panel');
    let dbID = document.getElementById('editcolSubmit').getAttribute('sender');
    console.log(dbID);
    let body = { 'nombre': nombre, 'nombreOld': nombreOld, 'escritorio': escritorio }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/columnas", {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }

    let dialog = document.getElementById('editColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';

    let creado = true;
    refreshColumns(json, null, creado);

    res = await fetch(`http://localhost:3001/links?escritorio=${escritorio}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    const groupByPanel = json.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem);
        } else {
            acc[elem.panel] = [elem];
        }
        return acc;
    }, {});

    for (const panel in groupByPanel) {
        //console.log(`Elementos en el panel ${panel}:`);
        const items = groupByPanel[panel];
        const id = document.getElementById(`${escritorio}${panel}`).getAttribute('data-db');
        refreshLinks(items);
        //insertaNodos(items, `${panel}`, "link");
    }
    //let el = document.getElementById(`${escritorio}Cols`);
    // console.log(typeof(el))
    //ordenaCols(el);
}
async function createColumn() {

    //console.log("Se ejecuta createColumn");
    let nombre = document.getElementById('colName').value;
    let escritorio = document.body.getAttribute('data-desk');
    let body = { 'nombre': nombre, 'escritorio': `${escritorio}` }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/columnas", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    let dialog = document.getElementById('addColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
    //console.log(json);
    //Hay que recargar solo la columna TODO
    let creado = true;
    refreshColumns(json, null, creado);
    res = await fetch(`http://localhost:3001/links?escritorio=${escritorio}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    const groupByPanel = json.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem);
        } else {
            acc[elem.panel] = [elem];
        }
        return acc;
    }, {});

    for (const panel in groupByPanel) {
        //console.log(`Elementos en el panel ${panel}:`);
        const items = groupByPanel[panel];
        const id = document.getElementById(`${escritorio}${panel}`).getAttribute('data-db');
        refreshLinks(items, `${id}`);
        //insertaNodos(items, `${panel}`, "link");
    }


}
async function deleteColumn(event) {

    //Pasarle el id del elemento a borrar ver como afecta en el servidor
    let escritorio = document.body.getAttribute('data-desk');
    //let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    let elementoId = event.target.parentNode.parentNode.parentNode.childNodes[1];
    console.log(elementoId);
    elementoId = elementoId.getAttribute('data-db');
    let body = { 'id': elementoId, 'escritorio': `${escritorio}` }
    body = JSON.stringify(body)
    console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/columnas", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    //console.log(json);
    refreshColumns(json);
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    res = await fetch(`http://localhost:3001/links?escritorio=${escritorio}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    const groupByPanel = json.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem);
        } else {
            acc[elem.panel] = [elem];
        }
        return acc;
    }, {});

    for (const panel in groupByPanel) {
        //console.log(`Elementos en el panel ${panel}:`);
        const items = groupByPanel[panel];
        const id = document.getElementById(`${escritorio}${panel}`).getAttribute('data-db');
        refreshLinks(items, `${id}`);
        //insertaNodos(items, `${panel}`, "link");
    }
}
function refreshColumns(lista, ordenCols = null, creado) {

    const escritorioActual = document.body.getAttribute('data-desk');
    const $raiz = document.getElementById(`${escritorioActual}Cols`);
    const arr = Array.from(lista);

    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.firstChild);
        }
    }
    let counter = 0;
    let counter2 = 0;
    let arr2 = [];
    arr.forEach((element, index, arr) => {
        const $columna = document.createElement("div");
        $columna.setAttribute("class", "columna");
        //Permite detectar duplicados y darles un id distinto incremental
        if (arr.map(e => e.name).indexOf(element.name) !== index) {

            arr2.push(`${element.name}${counter}`);
            $columna.setAttribute("id", `${escritorioActual}${arr2[counter]}`);
            counter++;

        } else {

            $columna.setAttribute("id", `${escritorioActual}${element.name}`);
        }

        $columna.setAttribute("data-db", `${element._id}`) 
        const $envolt = document.createElement("div");
        $envolt.setAttribute("class", "envolt");
        $envolt.setAttribute("data-id", `${counter2}`);
        const $headerColumn = document.createElement("div");
        $headerColumn.setAttribute("class", "headercolumn");
        const $header = document.createElement("h2");
        $header.setAttribute("class", "ctitle");
        const $textos = document.createTextNode(`${element.name}`)
        const $ccontrols = document.createElement("div");
        $ccontrols.setAttribute("class", "ccontrols");
        const $editControl = document.createElement("span");
        $editControl.setAttribute("class", "icofont-ui-edit editcol");
        const $deleteControl = document.createElement("span");
        $deleteControl.setAttribute("class", "icofont-recycle borracol");
        const $addLinkControl = document.createElement("span");
        $addLinkControl.setAttribute("class", "icofont-plus addlink");

        $ccontrols.appendChild($editControl)
        $ccontrols.appendChild($deleteControl)
        $ccontrols.appendChild($addLinkControl)

        $header.appendChild($textos)
        $headerColumn.appendChild($header)
        $headerColumn.appendChild($ccontrols)

        $envolt.appendChild($headerColumn)
        $envolt.appendChild($columna)

        $raiz.appendChild($envolt)

        //Agregar evento de clic al botón de borrar columnas
        document.querySelectorAll('.borracol').forEach(item => {
            item.removeEventListener('click', deleteColumn);
            item.addEventListener('click', deleteColumn);
        })
        //Agregar evento de clic al botón de añadir links
        document.querySelectorAll('.addlink').forEach(item => {
            item.removeEventListener('click', toggleDialogLink);
            item.addEventListener('click', toggleDialogLink);
        })
        //Agregar evento de clic al botón de editar columnas
        document.querySelectorAll('.editcol').forEach(item => {
            item.removeEventListener('click', toggleDialogEditColumn);
            item.addEventListener('click', toggleDialogEditColumn);
        })
        counter2++;
    })
    //console.log(`Último id creado: ${counter2 - 1}`);


    
    if(ordenCols === undefined || ordenCols === null) {

        ordenaCols($raiz);
        ordenCols = localStorage.getItem(`Grupo${escritorioActual}Cols`);
        //console.log(`Es undefined o null: ${ordenCols}`);
        
    } else {

        //console.log(ordenCols);

    }

    if(ordenCols != null && creado === true) {

        //console.log("Viene de crear o editar");
        arrOrden = ordenCols.split('|');
        const primerElemento = arrOrden.shift();
        arrOrden.push(primerElemento);
        //console.log(arrOrden);
        localStorage.setItem(`Grupo${escritorioActual}Cols`, `${arrOrden.join('|')}`);
        ordenaCols($raiz);

    } else {

        //console.log("Es una actualización");
        ordenaCols($raiz);
    }
    if (arr2.length > 0) {
        arr2.forEach(element => {
            ordenaItems(element);
        })
    }
}

//Manejo de links

async function editLink(params) {
    //console.log("Edita el link");
    let nombreOld = document.body.getAttribute('data-link');
    let escritorio = document.body.getAttribute('data-desk');
    let columna = document.body.getAttribute('data-panel');
    let nombre = document.querySelector('#editlinkName').value;
    let linkURL = document.querySelector('#editlinkURL').value;
    let imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`;
    let dbID = document.getElementById('editlinkSubmit').getAttribute('sender');
    //console.log(dbID);
    //console.log(nombreOld, nombre, linkURL, imgURL, columna, escritorio);

    let dialog = document.getElementById('editLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
    let body = { 'nombreOld': nombreOld, 'nombre': nombre, 'URL': linkURL, 'imgURL': imgURL, 'escritorio': escritorio, 'columna': columna, 'id': dbID }
    //console.log(body);
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/links", {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    //console.log(`Lista desde editLink: ${JSON.stringify(json)}`);

    const $raiz = document.querySelector(`[data-db="${dbID}"]`)
    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    refreshLinks(json)
    ordenaItems(columna)
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function createLink(event) {

    //Recogemos los datos para enviarlos a la db
    let escritorio = document.body.getAttribute('data-desk');
    let columna = document.body.getAttribute('data-panel');
    let nombre = document.querySelector('#linkName').value;
    let linkURL = document.querySelector('#linkURL').value;
    let imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`;
    let dbID = document.getElementById('linkSubmit').getAttribute('sender');

    //Cerramos el cuadro de diálogo
    let dialog = document.getElementById('addLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';

    //Declaramos el body para enviar y lo pasamos a cadena de texto
    let body = { 'nombre': nombre, 'URL': linkURL, 'imgURL': imgURL, 'escritorio': escritorio, 'columna': columna, 'id': dbID }
    body = JSON.stringify(body)

    //Enviamos el post con el link
    //TODO Control de errores del fetch
    let res = await fetch("http://localhost:3001/links", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    //La respuesta son todos los links con el id del panel donde se crea el link
    let json = await res.json();

    //Seleccionamos columna por id, por si hay dos con el mismo nombre
    const $raiz = document.querySelector(`[data-db="${dbID}"]`);

    //La vaciamos
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    //La rellenamos con los datos del json
    refreshLinks(json)
    //Llamamos a Sortable y le pasamos la columna
    ordenaItems(columna)
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function deleteLink(event) {
    //TODO Confirmación

    let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panel = event.target.parentNode.parentNode.parentNode.id

    console.log(event.target.parentNode.parentNode.parentNode);
    let id = event.target.parentNode.parentNode.parentNode;
    id = id.getAttribute('data-db');

    let escritorio = document.body.getAttribute('data-desk');

    let body = { 'nombre': nombre, 'panel': panel, 'escritorio': escritorio, 'id': id }
    body = JSON.stringify(body)
    console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/links", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    //console.log(json);
    const $raiz = document.querySelector(`[data-db="${id}"]`)
    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    refreshLinks(json)
    panel = panel.replace(escritorio, "");
    //console.log(panel);
    ordenaItems(panel)

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

}
function refreshLinks(lista) {

    //Pasamos de objeto json a array
    const arr = Array.from(lista);
    let contador = 0;
    arr.forEach(element => {
        //Por cada elemento construimos un link y lo insertamos en su raiz
        const $raiz = document.querySelector(`[data-db="${element.idpanel}"]`);
        const $div = document.createElement("div");
        $div.setAttribute("class", "link");
        $div.setAttribute("data-id", contador);
        const $img = document.createElement("img");
        $img.setAttribute("src", `${element.imgURL}`);
        const $link = document.createElement("a");
        $link.setAttribute("href", `${element.URL}`);
        $link.setAttribute("target", "_blank");
        const $textos = document.createTextNode(`${element.name}`);
        const $lcontrols = document.createElement("div");
        $lcontrols.setAttribute("class", "lcontrols");
        const $editControl = document.createElement("span");
        $editControl.setAttribute("class", "icofont-ui-edit editalink");
        const $deleteControl = document.createElement("span");
        $deleteControl.setAttribute("class", "icofont-recycle borralink");

        $lcontrols.appendChild($editControl)
        $lcontrols.appendChild($deleteControl)
        $link.appendChild($img)
        $link.appendChild($textos)

        $div.appendChild($link)
        $div.appendChild($lcontrols)

        $raiz.appendChild($div)

        document.querySelectorAll('.borralink').forEach(item => {
            item.removeEventListener('click', deleteLink);
            item.addEventListener('click', deleteLink);
        })
        document.querySelectorAll('.editalink').forEach(item => {
            item.removeEventListener('click', toggleDialogEditLink);
            item.addEventListener('click', toggleDialogEditLink);
        })
        contador++;
        
    })
    // let columna = document.body.getAttribute('data-panel');
    // ordenaItems(columna)
}

//funciones auxiliares para mostrar/ocultar cuadros de diálogo

function toggleDialogColumn() {

    let dialog = document.getElementById('addColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDialogEditColumn(event) {
    //console.log("entra");
    let panel = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panelID = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db');
    console.log(panelID);
    let boton = document.getElementById('editcolSubmit');
    boton.setAttribute('sender', `${panelID}`);
    document.body.setAttribute('data-panel', `${panel}`);
    let dialog = document.getElementById('editColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDialogDesktop() {

    let dialog = document.getElementById('addDeskForm');
    let visible = dialog.style.display === 'flex';
    //console.log(visible);
    dialog.style.display = visible ? 'none' : 'flex';
}

function toggleDialogEditDesktop(event) {

    let dialog = document.getElementById('editDeskForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}

function toggleDialogLink(event) {

    let panel = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panelID = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db');
    document.body.setAttribute('data-panel', `${panel}`);
    let boton = document.getElementById('linkSubmit');
    boton.setAttribute('sender', `${panelID}`);
    //console.log(panelID);
    let dialog = document.getElementById('addLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDialogEditLink(event) {

    let linkName = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panelID = event.target.parentNode.parentNode.parentNode.getAttribute('data-db');
    console.log(event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText);
    //console.log(linkName);
    let panel = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    //console.log(panel);
    let boton = document.getElementById('editlinkSubmit');
    boton.setAttribute('sender', `${panelID}`);
    document.body.setAttribute('data-panel', `${panel}`);
    document.body.setAttribute('data-link', `${linkName}`);
    let dialog = document.getElementById('editLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}

function escondeDialogos(event) {
    let cuadros = [];
    //Introducimos todos los formularios
    cuadros.push(Array.from(document.querySelectorAll('.deskForm')));
    cuadros = [].concat.apply([], cuadros);
    //Introducimos los botones de control de escritorios
    cuadros.push(document.getElementById('addDesk'))
    cuadros.push(document.getElementById('addCol'))
    cuadros.push(document.getElementById('editDesk'))

    //Introducimos los botones de las columnas para añadir links
    cuadros.push(Array.from(document.querySelectorAll('.addlink')))
    cuadros = [].concat.apply([], cuadros);
    cuadros.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    })
    //Introducimos los botones de las columnas para editar columnas
    cuadros.push(Array.from(document.querySelectorAll('.editcol')))
    cuadros = [].concat.apply([], cuadros);
    cuadros.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    })
    //Introducimos los botones de los links para editar links
    cuadros.push(Array.from(document.querySelectorAll('.editalink')))
    cuadros = [].concat.apply([], cuadros);
    cuadros.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    })
    //console.log(cuadros);

    //Si se ha hecho click fuera de cualquier boton y dialogo
    if (!cuadros.includes(event.target)) {
        //console.log(event.target);
        cuadros.forEach(element => {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            let visible = element.style.display === 'flex';
            if (visible) {
                element.style.display = 'none';
            }
        })

    }
}

//Funciones para aplicar Sortablejs

function ordenaItems(panel) {

    if (panel !== null) {

        let escritorioActual = document.body.getAttribute('data-desk');
        let el = [];
        el.push(document.getElementById(`${escritorioActual}${panel}`));

        el.forEach(element => {

            let grupo;
            if(escritorioActual === 'Test') {
                grupo = `Shared${escritorioActual}`;
            } else {
                grupo = element.id;
            }

            const sortableList = Sortable.create(element, {
                group: grupo,
                filter: '.envolt',
                options: {
                    sort: true,
                    dataIdAttr: 'data-id'
                },
                store: {
                    /**
                     * Get the order of elements. Called once during initialization.
                     * @param   {Sortable}  sortable
                     * @returns {Array}
                     */
                    get: function (sortable) {
                        var order = localStorage.getItem(sortable.options.group.name);
                        //console.log(order);
                        return order ? order.split('|') : [];
                    },

                    /**
                     * Save the order of elements. Called onEnd (when the item is dropped).
                     * @param {Sortable}  sortable
                     */
                    set: function (sortable) {
                        var order = sortable.toArray();
                        localStorage.setItem(sortable.options.group.name, order.join('|'));
                    }
                },
                onEnd: function (evt) {
                    var itemEl = evt.item;
                    var listaOrigen = evt.from;
                    console.log(itemEl);
                    console.log('Viejo Index' + evt.oldIndex);
                    console.log('Nuevo Index' + evt.newIndex);
                    console.dir(listaOrigen);
                    console.dir(evt.to);
                    console.log(itemEl.parentNode.parentNode);
                }
            })
            //console.log(sortableList);
        })
    } else {
        console.log('Panel Null');
    }

}



function ordenaCols(element) {
    // console.log("Se ejecuta ordenacols");
    let arr = [];
    arr.push(element);
    // console.log(arr);

    arr.forEach(element => {
        const sortablelist2 = Sortable.create(element, {

            group: `Grupo${element.id}`,
            sort: true,
            dataIdAttr: 'data-id',
            store: {
                /**
                 * Get the order of elements. Called once during initialization.
                 * @param   {Sortable}  sortable
                 * @returns {Array}
                 */
                get: function (sortable) {
                    var order = localStorage.getItem(sortable.options.group.name);
                    //console.log(order);
                    return order ? order.split('|') : [];
                },

                /**
                 * Save the order of elements. Called onEnd (when the item is dropped).
                 * @param {Sortable}  sortable
                 */
                set: function (sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|'));
                }
            }
        })
        var order = sortablelist2.toArray();
        localStorage.setItem(sortablelist2.options.group.name, order.join('|'));
        // console.log(sortablelist2.toArray());

        //Habrá que hacer un getItems y que lo añada al final o cualquier ostia
    })

}