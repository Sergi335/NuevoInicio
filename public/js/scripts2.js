document.addEventListener('DOMContentLoaded', cargaWeb);
document.addEventListener('click', escondeDialogos);

//Función que rellena la Web según el escritorio elegido
//Si se le pasa parámetro, carga el escritorio segun el nombre pasado como param
//Si no carga el primero de la lista

async function cargaWeb(deskName) {

    //Cargamos la lista de escritorios
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
    
    //Almacenamos en variable la lista de escritorios para usarla luego
    const escritorios = json;

    const groupByPanel0 = escritorios.reduce((acc, elem) => {
        if (acc[elem.panel]) {
            acc[elem.panel].push(elem.name);
        } else {
            acc[elem.panel] = [elem.name];
        }
        return acc;
    }, {});

    for (const panel in groupByPanel0) {
        //console.log(`Elementos en el array:`);
        const items = groupByPanel0[panel];
        //console.log(items);
        const $raiz = document.getElementById('cols');
            if ($raiz.hasChildNodes()) {
                while ($raiz.childNodes.length >= 1) {
                    $raiz.removeChild($raiz.firstChild);
                }
            }
        items.forEach(element => {
            
            const $div = document.createElement('div');
            $div.setAttribute('class', 'cuerpo');
            $div.setAttribute('id', `${element.trim().replace(/\s+/g, '')}Cols`)
            $raiz.appendChild($div);

            //ordenaCols(element)

        })
    }

    //Cargamos las columnas del escritorio elegido

    res = await fetch(`http://localhost:3001/columnas?escritorio=${escritorioActual}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    json = await res.json();

    addDesktopEvents();
    refreshColumns(json);
    addColumnEvents();

    //Cargamos cada Link en su columna correspondiente

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

    for (const panel in groupByPanel) {
        //console.log(`Elementos en el panel ${panel}:`);
        const items = groupByPanel[panel];
        //console.log(items);
        
        refreshLinks(items, `${panel}`);
        //ordenaItems(panel);
    }
    //Tiene que estar AQUI no antes o no funciona : por que?
    ordenaCols(groupByPanel0);
    addLinkEvents();
}

//Manejo de Eventos

function addDesktopEvents(params) {

    //console.log("Se adjudican los eventos de Escritorio");

    //Agregar evento click a cada elemento de la lista de escritorios
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

    document.querySelector('#editdeskSubmit').removeEventListener('click', editDesktop);
    document.querySelector('#editdeskSubmit').addEventListener('click', editDesktop);

    // Agregar evento de clic al botón para eliminar un escritorio
    document.querySelector('#removeDesk').removeEventListener('click', deleteDesktop);
    document.querySelector('#removeDesk').addEventListener('click', deleteDesktop);

    //Añadir eventos en botones submit
    document.querySelector('#deskSubmit').removeEventListener('click', createDesktop);
    document.querySelector('#deskSubmit').addEventListener('click', createDesktop);


}
function addColumnEvents(params) {
    document.querySelector('#colSubmit').removeEventListener('click', createColumn);
    document.querySelector('#colSubmit').addEventListener('click', createColumn);

    document.querySelector('#editcolSubmit').removeEventListener('click', editColumn);
    document.querySelector('#editcolSubmit').addEventListener('click', editColumn);
    
}
function addLinkEvents(params) {
    // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
    document.querySelector('#linkSubmit').removeEventListener('click', createLink);
    document.querySelector('#linkSubmit').addEventListener('click', createLink);


     // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
     document.querySelector('#editlinkSubmit').removeEventListener('click', editLink);
     document.querySelector('#editlinkSubmit').addEventListener('click', editLink);
}

//Manejo de escritorios

function selectDesktop(event) {
    event.stopPropagation();
    //console.log("Se ejecuta la función de selección de escritorio");
    //console.log(event.target.innerText);
    let deskName = event.target.innerText;
    document.body.setAttribute('data-desk', deskName);
    cargaWeb(deskName);
    
}
async function editDesktop(params) {
    let nombreOld = document.body.getAttribute('data-desk');
    let nombre = document.getElementById('editdeskName').value;
    let body = { 'nombre': nombre, 'nombreOld': nombreOld }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/escritorios", {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    const firstKey = Object.keys(json)[0];
    const firstValue = json[firstKey];

    if (firstKey === "error") {
        $error = document.getElementById('editdeskError');
        $error.innerText = `${firstKey}, ${firstValue}`;
        //console.log(firstKey);
        //console.log(firstValue);
    } else {
        let dialog = document.getElementById('editDeskForm');
        let visible = dialog.style.display === 'flex';
        dialog.style.display = visible ? 'none' : 'flex';
        refreshDesktops(json);
        addDesktopEvents();
    }
    document.getElementById('deskTitle').innerText = `${nombre}`;
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
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

async function editColumn(params) {
    //console.log("Se ejecuta editColumn");
    let nombre = document.getElementById('editcolName').value;
    let escritorio = document.body.getAttribute('data-desk');
    let nombreOld = document.body.getAttribute('data-panel');
    let body = { 'nombre': nombre, 'nombreOld': nombreOld, 'escritorio': escritorio }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
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
    //console.log(json);
    //Hay que recargar solo la columna TODO
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
        //console.log(items);
        refreshLinks(items, `${panel}`);
        //insertaNodos(items, `${panel}`, "link");
    }
}
async function createColumn() {

    //console.log("Se ejecuta createColumn");
    let nombre = document.getElementById('colName').value;
    let escritorio = document.body.getAttribute('data-desk');
    let body = { 'nombre': nombre, 'escritorio': `${escritorio}` }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
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
        //console.log(items);
        refreshLinks(items, `${panel}`);
        //insertaNodos(items, `${panel}`, "link");
    }


}
async function deleteColumn(event) {
    //Falta el escritorio actual
    let escritorio = document.body.getAttribute('data-desk');
    let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    let body = { 'nombre': nombre, 'escritorio': `${escritorio}` }
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
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
        //console.log(items);
        refreshLinks(items, `${panel}`);
        //insertaNodos(items, `${panel}`, "link");
    }
}
function refreshColumns(lista) {
    //console.log("Se ejecuta refreshColumns");
    const escritorioActual = document.body.getAttribute('data-desk');
    const $raiz = document.getElementById(`${escritorioActual.trim().replace(/\s+/g, '')}Cols`);
    //console.log(lista);
    const arr = Array.from(lista);
    //console.log("Lista " + arr);

    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length >= 1) {
            $raiz.removeChild($raiz.firstChild);
        }
    }

    arr.forEach(element => {
        const $columna = document.createElement("div");
        $columna.setAttribute("class", "columna");
        $columna.setAttribute("id", `${element.name}`);

        const $envolt = document.createElement("div");
        $envolt.setAttribute("class", "envolt");

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

        $columna.appendChild($envolt)

        $raiz.appendChild($columna)
        
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
        document.querySelectorAll('.editcol').forEach(item => {
            item.removeEventListener('click', toggleDialogEditColumn);
            item.addEventListener('click', toggleDialogEditColumn);
        })
    })
    //No es necesario ejecutar aqui
    // console.log(`Desde RefreshColumns ${escritorioActual}`);
    //ordenaCols(escritorioActual);
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
    //console.log(nombreOld, nombre, linkURL, imgURL, columna, escritorio);

    let dialog = document.getElementById('editLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
    let body = { 'nombreOld': nombreOld, 'nombre': nombre, 'URL': linkURL, 'imgURL': imgURL, 'escritorio': escritorio, 'columna': columna }
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

    const $raiz = document.getElementById(`${columna}`)
    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length > 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    refreshLinks(json, columna)
    ordenaItems(columna)
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function createLink() {
    //console.log("Entra a la function");
    // //Falta el escritorio actual
    let escritorio = document.body.getAttribute('data-desk');
    let columna = document.body.getAttribute('data-panel');
    let nombre = document.querySelector('#linkName').value;
    let linkURL = document.querySelector('#linkURL').value;
    let imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`;
    //console.log("Submit link", nombre.value, linkURL.value, imgURL, columna, escritorio);

    let dialog = document.getElementById('addLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
    let body = { 'nombre': nombre, 'URL': linkURL, 'imgURL': imgURL, 'escritorio': escritorio, 'columna': columna }
    //console.log(body);
    body = JSON.stringify(body)
    //console.log(JSON.stringify(body));
    let res = await fetch("http://localhost:3001/links", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    //console.log(`Lista desde createLink: ${JSON.stringify(json)}`);

    const $raiz = document.getElementById(`${columna}`)
    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length > 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    refreshLinks(json, columna)
    ordenaItems(columna)
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function deleteLink(event) {
    let nombre = event.target.parentNode.parentNode.childNodes[0].innerText;
    //console.log(nombre);
    let panel = event.target.parentNode.parentNode.parentNode.id
    let escritorio = document.body.getAttribute('data-desk');
    //console.log(nombre, panel)
    //Falta el escritorio actual
    let body = { 'nombre': nombre, 'panel': panel, 'escritorio': escritorio }
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
    //console.log(json);
    const $raiz = document.getElementById(`${panel}`)
    //console.log($raiz);
    if ($raiz.hasChildNodes()) {
        while ($raiz.childNodes.length > 1) {
            $raiz.removeChild($raiz.lastChild);
        }
    }
    refreshLinks(json, panel)
    ordenaItems(panel)

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

}
function refreshLinks(lista, panel) {
    //console.log("Se ejecuta refreshLinks");
    const $raiz = document.getElementById(`${panel}`);
    //console.log($raiz);
    const arr = Array.from(lista);
    //console.log(arr);


    // if ($raiz.hasChildNodes()) {
    //     while ($raiz.childNodes.length >= 1) {
    //         $raiz.removeChild($raiz.firstChild);
    //     }
    // }
    arr.forEach(element => {
        const $div = document.createElement("div");
        $div.setAttribute("class", "link");
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
    })
    // let links = document.querySelectorAll('.link');
    // let contador = 1;
    // links.forEach(element => {
    //     element.setAttribute('data-id', contador);
    //     //console.log(element);
    //     contador++;
    // })
    // ordenaItems();
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
    document.body.setAttribute('data-panel', `${panel}`);
    let dialog = document.getElementById('addLinkForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
function toggleDialogEditLink(event) {

    let linkName = event.target.parentNode.parentNode.childNodes[0].innerText;
    //console.log(linkName);
    let panel = event.target.parentNode.parentNode.parentNode.childNodes[0].innerText;
    //console.log(panel);
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
            if(visible) {
                element.style.display = 'none';
            }
        })
        
    }
}

function ordenaItems(panel) {
    //console.log("Se ejecuta ordenaItems");
    let el = [];
    el.push(document.getElementById(`${panel}`));
    //console.log(el);

    el.forEach(element => {
        
        const sortableList = Sortable.create(element, {
            group: element.id,
            filter: '.headercolumn',
            options: {
                sort: true
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
            }
        })
        //console.log(sortableList);
    })
}

function ordenaCols(escritorios) {

    let arr = Object.values(escritorios);
    arr = arr.flat();
    console.log(arr);
    let el = [];
    
    arr.forEach(element => {
        console.log(element);
        el.push(document.getElementById(`${element.trim().replace(/\s+/g, '')}Cols`));
    })
    
    console.log(el);

    el.forEach(element => {
        
        Sortable.create(element, {
            
            group: `Grupo${element.id}`,
            options: {
                sort: true,
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
            }
        })
        //console.log(sortableList)
    })
       
    
}