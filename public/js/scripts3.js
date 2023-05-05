document.addEventListener('DOMContentLoaded', cargaWeb);
document.addEventListener('click', escondeDialogos);

/**
 * Función que carga los eventos en la web 
 */
async function cargaWeb() {

    //Añadimos los eventos de escritorio
    addDesktopEvents();

    //Declaramos la variable para pasar a ordenaCols
    let desk = document.getElementById('deskTitle').innerText;
    document.body.setAttribute('data-desk', `${desk}`);
    let el = document.getElementById(`${desk}Cols`);

    //Añadimos los eventos de columnas
    addColumnEvents();

    //Añadimos los eventos de los links
    addLinkEvents();
    ordenaCols(el);
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
    document.querySelector('#removeDesk').removeEventListener('click', toggleDeleteDialogDesk);
    document.querySelector('#removeDesk').addEventListener('click', toggleDeleteDialogDesk);

    //Añadir eventos en botones submit de crear escritorio
    document.querySelector('#deskSubmit').removeEventListener('click', createDesktop);
    document.querySelector('#deskSubmit').addEventListener('click', createDesktop);


}
/**
 * Carga los manejadores de eventos para la manipulación de columnas
 */
function addColumnEvents() {
    document.querySelectorAll('.borracol').forEach(item => {
        item.removeEventListener('click', toggleDeleteDialogCol);
        item.addEventListener('click', toggleDeleteDialogCol);
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
    //Agregar evento de clic al botón principal de control
    document.querySelectorAll('.icofont-gear').forEach(item => {
        item.removeEventListener('click', muestraCcontrols);
        item.addEventListener('click', muestraCcontrols);
    })
    document.querySelector('#colSubmit').removeEventListener('click', createColumn);
    document.querySelector('#colSubmit').addEventListener('click', createColumn);

    document.querySelector('#editcolSubmit').removeEventListener('click', editColumn);
    document.querySelector('#editcolSubmit').addEventListener('click', editColumn);

}
/**
 * Carga los manejadores de eventos para la manipulación de links
 */
function addLinkEvents() {
    document.querySelectorAll('.borralink').forEach(item => {
        item.removeEventListener('click', toggleDeleteDialogLink);
        item.addEventListener('click', toggleDeleteDialogLink);
    })
    document.querySelectorAll('.editalink').forEach(item => {
        item.removeEventListener('click', toggleDialogEditLink);
        item.addEventListener('click', toggleDialogEditLink);
    })
    // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
    document.querySelector('#linkSubmit').removeEventListener('click', createLink);
    document.querySelector('#linkSubmit').addEventListener('click', createLink);

    // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
    document.querySelector('#editlinkSubmit').removeEventListener('click', editLink);
    document.querySelector('#editlinkSubmit').addEventListener('click', editLink);
}

//Manejo de escritorios

/**
 * 
 * @param {Object} event 
 */
async function selectDesktop(event) {
    event.stopPropagation();
    let deskName = event.target.innerText;
    window.location = `http://localhost:3001/templates?escritorio=${deskName}`
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
    let dialog = document.getElementById('deleteDeskForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';

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
    refreshColumns(json);

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
    let $raiz0 = document.getElementById(`${escritorio}Cols`);
    let orden = $raiz0.childNodes.length;
    orden = orden + 1;
    console.log(orden);
    //Meterle el orden
    let body = { 'nombre': nombre, 'escritorio': `${escritorio}`, 'order': orden }
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
    refreshColumns(json);
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
        const $raiz = document.querySelector(`[data-db="${id}"]`);
        if ($raiz.hasChildNodes()) {
            while ($raiz.childNodes.length >= 1) {
                $raiz.removeChild($raiz.lastChild);
            }
        }
        refreshLinks(items, `${id}`);
        //insertaNodos(items, `${panel}`, "link");
    }


}
async function deleteColumn(event) {

    //Pasarle el id del elemento a borrar ver como afecta en el servidor
    let escritorio = document.body.getAttribute('data-desk');
    //let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    let elementoId = document.getElementById('confDeletecolSubmit').getAttribute('sender');
    console.log(elementoId);
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
    let creado = true;
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
        const $raiz = document.querySelector(`[id="${escritorio}${panel}"]`)
        console.log($raiz);
        if ($raiz.hasChildNodes()) {
            while ($raiz.childNodes.length >= 1) {
                $raiz.removeChild($raiz.lastChild);
            }
            // refreshLinks(items);
        }
        refreshLinks(items, `${id}`);
        //insertaNodos(items, `${panel}`, "link");
    }
    let dialog = document.getElementById('deleteColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
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
    //Seleccionamos columna por id, por si hay dos con el mismo nombre
    const $raiz = document.querySelector(`[data-db="${dbID}"]`);

    let orden = $raiz.childNodes.length;
    orden = orden + 1;
    console.log(orden);

    const elements = $raiz.childNodes;
    const sortedElements = Array.from(elements).sort((a, b) => {
        return a.dataset.orden - b.dataset.orden;
    });
    console.log(sortedElements);
    //Cerramos el cuadro de diálogo
    let dialog = document.getElementById('addLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';

    //Declaramos el body para enviar y lo pasamos a cadena de texto
    let body = { 'nombre': nombre, 'URL': linkURL, 'imgURL': imgURL, 'escritorio': escritorio, 'columna': columna, 'id': dbID, 'orden': orden }
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
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    //La respuesta son todos los links con el id del panel donde se crea el link
    let json = await res.json();

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

}
async function deleteLink(event) {

    let nombre = document.body.getAttribute('data-link');
    let panel = document.body.getAttribute('data-panel');

    //console.log(event.target.parentNode.parentNode.parentNode);
    let id = document.getElementById('confDeletelinkSubmit').getAttribute('sender');

    let escritorio = document.body.getAttribute('data-desk');

    let body = { 'nombre': nombre, 'panel': panel, 'escritorio': escritorio, 'id': id }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/links", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    //console.log(json.length);
    const $raiz = document.querySelector(`[data-db="${id}"]`)

    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    if (json.length === 0) {
        console.log("Era el último");
        const $div = document.createElement("div");
        $div.setAttribute("class", "link");
        $raiz.appendChild($div)
    }
    refreshLinks(json)
    //panel = panel.replace(escritorio, "");
    //console.log(panel);
    ordenaItems(panel)
    let dialog = document.getElementById('deleteLinkForm');
    let visible = dialog.style.display === 'flex';
    console.log(visible);
    dialog.style.display = visible ? 'none' : 'flex';

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

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
function toggleDeleteDialogLink(event) {
    //nombre panel escritorio id
    console.log(event.target);
    let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panelId = event.target.parentNode.parentNode.parentNode.getAttribute('data-db');
    let panel = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    let boton = document.getElementById('confDeletelinkSubmit');
    boton.setAttribute('sender', `${panelId}`);
    document.body.setAttribute('data-panel', `${panel}`);
    document.body.setAttribute('data-link', `${nombre}`);
    console.log("Confirmación de Borrado");
    let dialog = document.getElementById('deleteLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDeleteDialogCol(event) {

    let id = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db');
    let boton = document.getElementById('confDeletecolSubmit');
    boton.setAttribute('sender', `${id}`);
    let dialog = document.getElementById('deleteColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDeleteDialogDesk(event) {
    console.log("Confirmación borrar escritorio");
    let dialog = document.getElementById('deleteDeskForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function escondeDeleteDialog() {
    let dialog = document.getElementById('deleteLinkForm');
    let visible = dialog.style.display === 'flex';
    console.log(visible);
    dialog.style.display = visible ? 'none' : 'flex';
}
function escondeDeleteColDialog() {
    let dialog = document.getElementById('deleteColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function escondeDeleteDeskDialog() {
    let dialog = document.getElementById('deleteDeskForm');
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
    cuadros.push(document.getElementById('removeDesk'))

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
    //Introducimos los botones de los links para borrar links
    cuadros.push(Array.from(document.querySelectorAll('.borralink')))
    cuadros = [].concat.apply([], cuadros);
    cuadros.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    })
    //Introducimos los botones de las columnas para borrar columna
    cuadros.push(Array.from(document.querySelectorAll('.borracol')))
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
        //let order = [];
        el.push(document.getElementById(`${escritorioActual}${panel}`));

        el.forEach(element => {

            let grupo = `Shared${escritorioActual}`;

            const sortableList = Sortable.create(element, {
                group: grupo,
                filter: '.envolt',
                options: {
                    sort: false,
                    dataIdAttr: 'data-id'
                },
                //Al terminar de arrastrar el elemento, decidimos que hacer dependiendo de si
                //se ha arrastrado en la misma columna o a una distinta
                onEnd: async function (evt) {
                    let itemEl = evt.item;
                    let listaOrigen = evt.from;
                    let listaDestino = evt.to;
                    let newId = listaDestino.attributes[2].nodeValue;
                    //console.log(newId);
                    let escritorio = document.body.getAttribute('data-desk');
                    //console.log(escritorio);
                    let panel = itemEl.parentNode.parentNode.childNodes[0].innerText;
                    //console.log(panel);
                    let nombre = itemEl.childNodes[0].innerText;
                    //console.log(`Nombre: ${nombre}`);
                    let oldId = listaOrigen.attributes[2].nodeValue;
                    if (document.querySelector(`[data-db="${oldId}"]`).childNodes.length === 0) {
                        console.log("Era el último");
                        const $raizOld = document.querySelector(`[data-db="${oldId}"]`)
                        const $div = document.createElement("div");
                        $div.setAttribute("class", "link");
                        $raizOld.appendChild($div);
                    }
                    //console.log(oldId);
                    
                    let body = { 'escritorio': escritorio, 'name': nombre, 'newId': newId, 'oldId': oldId, 'panel': panel }
                    //console.log(body);
                    body = JSON.stringify(body)
                    let res = await fetch("http://localhost:3001/draglinks", {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: body
                    })
                    let json = await res.json();
                    //TODO hay que pasarle el orden

                    let elements = document.querySelectorAll(`[data-db="${newId}"]`)[0].childNodes;
                    console.log(elements);
                    let id = elements[0].parentNode.getAttribute('data-db');
                    console.log(id);
                    const sortedElements = Array.from(elements).sort((a, b) => {
                        return a.dataset.orden - b.dataset.orden;
                    });
                    console.log(sortedElements);
                    let names = [];
                    sortedElements.forEach(element => {
                        names.push(element.innerText)
                    })
                    console.log(names);
                    body = names;
                    body = JSON.stringify({ body })
                    let res2 = await fetch(`http://localhost:3001/draglink?idColumna=${id}`, {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: body
                    })
                    let json2 = await res2.json();
                    console.log(json2);
                    //--------------------------------------------------------
                    //console.log(json.length);
                    //const objeto = JSON.parse(json);
                    const claves = Object.keys(json);
                    const primerValor = claves[0];
                    //console.log(primerValor);
                    if (primerValor !== "Respuesta") {

                        const groupByPanel = json2.reduce((acc, elem) => {
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
                            const $raiz = document.querySelector(`[id="${escritorio}${panel}"]`)
                            //console.log($raiz);
                            if ($raiz.hasChildNodes()) {
                                while ($raiz.childNodes.length >= 1) {
                                    $raiz.removeChild($raiz.lastChild);
                                }
                                refreshLinks(items);
                            }
                            //console.log(items);
                            //console.log(panel);
                            //ordenaItems(panel);
                        }
                        console.log(json);


                    } else {
                        //console.log(json);
                        let elements = document.querySelectorAll(`[data-db="${newId}"]`)[0].childNodes;
                        console.log(elements);
                        let id = elements[0].parentNode.getAttribute('data-db');
                        console.log(id);
                        const sortedElements = Array.from(elements).sort((a, b) => {
                            return a.dataset.orden - b.dataset.orden;
                        });
                        console.log(sortedElements);
                        let names = [];
                        sortedElements.forEach(element => {
                            names.push(element.innerText)
                        })
                        console.log(names);
                        let body = names;
                        body = JSON.stringify({ body })
                        let res = await fetch(`http://localhost:3001/draglink?idColumna=${id}`, {
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: body
                        })
                        let json = await res.json();
                        console.log(json);
                    }

                }
            })
            //order.push(sortableList.toArray());
            // var order = sortableList.toArray();
            // localStorage.setItem(sortableList.options.group.name, order.join('|'));
            // console.log(sortableList.toArray());
            //console.log(order);
        })
    } else {
        console.log('Panel Null');
    }

}

function ordenaCols(element) {
    // console.log("Se ejecuta ordenacols");
    let arr = [];
    arr.push(element);
    console.log(arr);

    arr.forEach(element => {
        const sortablelist2 = Sortable.create(element, {

            group: `Grupo${element.id}`,
            sort: false,
            dataIdAttr: 'data-id',
            onEnd: async function (evt) {
                let itemEl = evt.item;
                console.log(itemEl);
                let escritorio = document.body.getAttribute('data-desk');
                let elements = document.getElementById(`${escritorio}Cols`).childNodes;
                console.log(elements);

                const sortedElements = Array.from(elements).sort((a, b) => {
                    return a.dataset.orden - b.dataset.orden;
                });
                console.log(sortedElements);
                let names = [];
                sortedElements.forEach(element => {
                    names.push(element.childNodes[1].dataset.db)
                })
                console.log(names);
                let body = names;
                body = JSON.stringify({ body })
                let res = await fetch(`http://localhost:3001/dragcol?escritorio=${escritorio}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: body
                })
                let json = await res.json();
                console.log(json);
            }

        })
        // var order = sortablelist2.toArray();
        // localStorage.setItem(sortablelist2.options.group.name, order.join('|'));
        // console.log(sortablelist2.toArray());

        //Habrá que hacer un getItems y que lo añada al final o cualquier ostia
    })

}

//Funciones Animacion

function muestraCcontrols(event) {
    console.log("Has hecho click");
    console.log(event.target.nextSibling);
    
    const controls = event.target.nextSibling;

    controls.classList.toggle('visible');
    anime({
        targets: controls,
        translateY: controls.classList.contains('visible') ? '0%' : '200%',
        zIndex: controls.classList.contains('visible') ? 1 : -1,
        easing: 'easeInOutQuad',
        duration: 300
    });
}