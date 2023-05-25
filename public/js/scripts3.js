document.addEventListener('DOMContentLoaded', cargaWeb);
document.addEventListener('click', escondeDialogos);

/**
 * Función que carga los eventos en la web 
 */
function cargaWeb() {

    //Añadimos los eventos de escritorio
    addDesktopEvents();

    //Declaramos la variable para pasar a ordenaCols
    let desk = document.getElementById('deskTitle').innerText;
    document.body.setAttribute('data-desk', `${desk}`);
    const $raiz = document.getElementById(`${desk}Cols`);
    //console.log($raiz.childNodes);

    //Añadimos los eventos de columnas
    addColumnEvents();

    //Añadimos los eventos de los links
    //Locura que si no llamas a ordenacols dos veces en dos funciones distintas(cierto?), no funciona, tocatelos
    addLinkEvents($raiz);
    let hijos = $raiz.childNodes;
    hijos.forEach(element => {
        ordenaItems(element.childNodes[0].innerText);
    })
    ordenaCols($raiz);
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

    // Agregar evento de clic al botón de cerrar sesión
    document.querySelector('#logout').removeEventListener('click', logOut);
    document.querySelector('#logout').addEventListener('click', logOut);


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
    document.querySelectorAll('.paste-btn').forEach(item => {
        item.removeEventListener('click', pasteLink);
        item.addEventListener('click', pasteLink);
    })
    document.querySelector('#colSubmit').removeEventListener('click', createColumn);
    document.querySelector('#colSubmit').addEventListener('click', createColumn);

    document.querySelector('#editcolSubmit').removeEventListener('click', editColumn);
    document.querySelector('#editcolSubmit').addEventListener('click', editColumn);

}
/**
 * Carga los manejadores de eventos para la manipulación de links
 */
function addLinkEvents($raiz) {
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

    ordenaCols($raiz);
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
async function editDesktop() {
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

}
async function createDesktop() {

    let nombre = document.getElementById('deskName').value;
    let body = { 'nombre': nombre }
    body = JSON.stringify(body)

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

    } else {
        let dialog = document.getElementById('addDeskForm');
        let visible = dialog.style.display === 'flex';
        dialog.style.display = visible ? 'none' : 'flex';

        refreshDesktops(json);
        addDesktopEvents();
    }

    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function deleteDesktop() {


    let nombre = document.body.getAttribute('data-desk');
    let body = { 'name': nombre }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/escritorios", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();

    //cargaWeb(json[0].name);
    window.location = `http://localhost:3001/templates?escritorio=${json[0].name}`
    let dialog = document.getElementById('deleteDeskForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';

}
/**
 * FUnción que recarga la lista de escritorios disponibles
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

async function editColumn() {

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

    let $Column = document.querySelector(`[data-db="${dbID}"]`);
    console.log($Column.parentNode.childNodes[0].childNodes[0].innerText);
    $Column.parentNode.childNodes[0].childNodes[0].innerText = nombre;

}
async function createColumn() {

    let nombre = document.getElementById('colName').value;
    let escritorio = document.body.getAttribute('data-desk');
    let $raiz0 = document.getElementById(`${escritorio}Cols`);

    let orden = $raiz0.childNodes.length;
    orden = orden + 1;
    console.log(orden);

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

    refreshColumns(json);
}
async function deleteColumn() {

    let escritorio = document.body.getAttribute('data-desk');
    let elementoId = document.getElementById('confDeletecolSubmit').getAttribute('sender');

    let body = { 'id': elementoId, 'escritorio': `${escritorio}` }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/columnas", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

    const $colBorrar = document.querySelector(`[data-db="${elementoId}"]`);

    $colBorrar.parentNode.remove();

    let dialog = document.getElementById('deleteColForm');
    let visible = dialog.style.display === 'flex';
    dialog.style.display = visible ? 'none' : 'flex';
}
/**
 * Función que crea la columna cuando se crea con createColumn
 * Recibe la columna creada
 * @param {json} json
 */
function refreshColumns(json) {
    console.log(json[0]);
    console.log(json[0].name);
    console.log(json[0]._id);

    const nombre = json[0].name;
    const id = json[0]._id;

    const escritorioActual = document.body.getAttribute('data-desk');
    const $raiz = document.getElementById(`${escritorioActual}Cols`);
    const arr = [];

    document.querySelectorAll('.headercolumn').forEach(element => {
        console.log(element.childNodes[0].innerText)
        arr.push(element.childNodes[0].innerText)
    })
    console.log(arr);

    const $columna = document.createElement("div");
    $columna.setAttribute("class", "columna");

    //Permite detectar duplicados y darles un id distinto incremental, luego cuando se refresque la pag lo implementará en plantilla

    const count = arr.reduce((acc, currentValue) => {
        if (currentValue === nombre) {
            return acc + 1;
        } else {
            return acc;
        }
    }, 0);
    console.log(count);
    if (count > 0) {
        $columna.setAttribute("id", `${escritorioActual}${nombre}${count + 1}`);
    } else {
        $columna.setAttribute("id", `${escritorioActual}${nombre}`);
    }


    $columna.setAttribute("data-db", `${id}`);

    const $div = document.createElement("div");
    $div.setAttribute("class", "link");
    $columna.appendChild($div)

    const $envolt = document.createElement("div");
    $envolt.setAttribute("class", "envolt");
    $envolt.setAttribute("orden", ""); //No es necesario siempre al final? ver de donde viene puede ser necesario para ordencols, etc
    const $headerColumn = document.createElement("div");
    $headerColumn.setAttribute("class", "headercolumn");
    const $header = document.createElement("h2");
    $header.setAttribute("class", "ctitle");
    const $textos = document.createTextNode(`${nombre}`)
    const $ccontrols = document.createElement("div");
    $ccontrols.setAttribute("class", "ccontrols");
    const $editControl = document.createElement("span");
    $editControl.setAttribute("class", "icofont-ui-edit editcol");
    const $deleteControl = document.createElement("span");
    $deleteControl.setAttribute("class", "icofont-recycle borracol");
    const $pasteControl = document.createElement("span");
    $pasteControl.setAttribute("class", "paste-btn icofont-paperclip");
    const $addLinkControl = document.createElement("span");
    $addLinkControl.setAttribute("class", "icofont-plus addlink");
    

    const $mainbutton = document.createElement("i");
    $mainbutton.setAttribute("class", "icofont-gear");

    $ccontrols.appendChild($editControl)
    $ccontrols.appendChild($deleteControl)
    $ccontrols.appendChild($pasteControl)
    $ccontrols.appendChild($addLinkControl)

    $header.appendChild($textos)
    $headerColumn.appendChild($header)
    $headerColumn.appendChild($mainbutton)
    $headerColumn.appendChild($ccontrols)

    $envolt.appendChild($headerColumn)
    $envolt.appendChild($columna)

    $raiz.appendChild($envolt)

    //No hay una función que lo hace?
    //Agregar evento de clic al botón de borrar columnas
    // document.querySelectorAll('.borracol').forEach(item => {
    //     item.removeEventListener('click', toggleDeleteDialogCol);
    //     item.addEventListener('click', toggleDeleteDialogCol);
    // })
    // //Agregar evento de clic al botón de añadir links
    // document.querySelectorAll('.addlink').forEach(item => {
    //     item.removeEventListener('click', toggleDialogLink);
    //     item.addEventListener('click', toggleDialogLink);
    // })
    // //Agregar evento de clic al botón de editar columnas
    // document.querySelectorAll('.editcol').forEach(item => {
    //     item.removeEventListener('click', toggleDialogEditColumn);
    //     item.addEventListener('click', toggleDialogEditColumn);
    // })
    // //Agregar evento de clic al botón principal de control
    // document.querySelectorAll('.icofont-gear').forEach(item => {
    //     item.removeEventListener('click', muestraCcontrols);
    //     item.addEventListener('click', muestraCcontrols);
    // })
    addColumnEvents();
    ordenaItems(nombre);
    ordenaCols($raiz);
}
//Manejo de links

async function editLink() {
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
    console.log(json);

    const $raiz = document.querySelector(`[data-db="${dbID}"]`)
    let arr = Array.from($raiz.childNodes)
    console.log(arr);
    const elementoAEditar = arr.find((elemento) => elemento.innerText === nombreOld);
    if (elementoAEditar) {
        elementoAEditar.querySelector('img').src = json.imgURL;
        elementoAEditar.querySelector('a').href = json.URL;
        elementoAEditar.querySelector('a').childNodes[1].nodeValue = nombre;

    }
    //console.log($raiz);
    // if ($raiz.hasChildNodes()) {
    //     while ($raiz.childNodes.length >= 1) {
    //         $raiz.removeChild($raiz.lastChild);
    //     }
    // }
    //refreshLinks(json)
    //ordenaItems(columna)
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function createLink() {

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
    //La respuesta son los datos del link recien creado
    let json = await res.json();
    const firstKey = Object.keys(json)[0];
    const firstValue = json[firstKey];

    if (firstKey === "error") {
        $error = document.getElementById('linkError');
        $error.innerText = `${firstKey}, ${firstValue}`;

    } else {
        //Cerramos el cuadro de diálogo
        let dialog = document.getElementById('addLinkForm');
        let visible = dialog.style.display === 'flex';
        dialog.style.display = visible ? 'none' : 'flex';
        //La rellenamos con los datos del json
        refreshLinks(json)
    }



}
async function deleteLink() {

    let nombre = document.body.getAttribute('data-link');
    let panel = document.body.getAttribute('data-panel');

    let id = document.getElementById('confDeletelinkSubmit').getAttribute('sender');

    let escritorio = document.body.getAttribute('data-desk');

    let body = { 'nombre': nombre, 'panel': panel, 'escritorio': escritorio, 'id': id }
    body = JSON.stringify(body)

    let res = await fetch("http://localhost:3001/links", {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: body
    })
    let json = await res.json();
    console.log(json);
    console.log(json.length);
    const $raiz = document.querySelector(`[data-db="${id}"]`)
    console.log($raiz.childNodes);
    let arr = Array.from($raiz.childNodes)
    console.log(arr);
    const elementoABorrar = arr.find((elemento) => elemento.innerText === nombre);
    if (elementoABorrar) {
        elementoABorrar.remove();
    }
    // if (json.length === 1) {
    //     if ($raiz.hasChildNodes()) {
    //         while ($raiz.childNodes.length >= 1) {
    //             $raiz.removeChild($raiz.lastChild);
    //         }
    //     }
    // }

    if (json.length === 0) {
        console.log("Era el último");
        const $div = document.createElement("div");
        $div.setAttribute("class", "link");
        $raiz.appendChild($div)
    }
    //refreshLinks(json)
    //panel = panel.replace(escritorio, "");
    //console.log(panel);
    //ordenaItems(panel)
    let dialog = document.getElementById('deleteLinkForm');
    let visible = dialog.style.display === 'flex';
    console.log(visible);
    dialog.style.display = visible ? 'none' : 'flex';

    if (!res.ok) throw { status: res.status, statusText: res.statusText }

}
async function pasteLink(event) {
    //lee el contenido del portapapeles entonces ...
    navigator.clipboard.read().then((clipboardItems) => {
        //por cada clipboardItem ...
        for (const clipboardItem of clipboardItems) {
            //Si el length de la propiedad types es 1, es texto plano
            if (clipboardItem.types.length == 1) {
                //lo confirmamos
                for (const type of clipboardItem.types) {
                    if (type === 'text/plain') {
                        //Pasamos el blob a texto
                        clipboardItem.getType(type).then((blob) => {
                            blob.text().then(function (text) {
                                console.log(text);
                                //Si tiene un enlace
                                if (text.indexOf('http') == 0) {
                                    console.log('Tiene un enlace');
                                    const raiz = event.target.parentNode.parentNode.parentNode.childNodes[1];
                                    const $raiz = document.querySelector(`[data-db="${raiz.dataset.db}"]`);
                                    const url = text;
                                    async function procesarEnlace() {
                                        const nombre = await getNameByUrl(text);
                                        const escritorio = document.body.getAttribute('data-desk');
                                        const columna = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
                                        let orden = $raiz.childNodes.length;
                                        orden = orden + 1;
                                        console.log(orden);
                                        const json = {
                                            idpanel: raiz.dataset.db,
                                            name: nombre,
                                            URL: url,
                                            imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                                            orden: orden,
                                            escritorio: escritorio,
                                            columna: columna
                                        }
                                        createLinkApi(json)
                                        console.log(json);
                                        console.log(raiz.lastChild.innerText);
                                        refreshLinks(json)
                                    }
                                    procesarEnlace();
                                } else {
                                    console.log('Es texto plano');
                                    console.log(text);
                                }
                            })
                        })
                    }
                }

            } else {
                for (const type of clipboardItem.types) {
                    if (type === 'text/html') {
                        clipboardItem.getType(type).then((blob) => {
                            blob.text().then(function (text) {
                                console.log(text);
                                if (text.indexOf('<a href') == 0) {
                                    console.log('Es un enlace html');
                                    console.log(text);
                                    const raiz = event.target.parentNode.parentNode.parentNode.childNodes[1];
                                    console.log(typeof (text));
                                    console.log(text);
                                    //raiz.innerHTML += text;
                                    const range = document.createRange();
                                    range.selectNode(document.body);

                                    const fragment = range.createContextualFragment(text);

                                    const a = fragment.querySelector('a');
                                    const url = a.href;
                                    const nombre = a.innerText;
                                    const escritorio = document.body.getAttribute('data-desk');
                                    const columna = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
                                    const $raiz = document.querySelector(`[data-db="${raiz.dataset.db}"]`);

                                    let orden = $raiz.childNodes.length;
                                    orden = orden + 1;
                                    console.log(orden);
                                    const json = {
                                        idpanel: raiz.dataset.db,
                                        name: nombre,
                                        URL: url,
                                        imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                                        orden: orden,
                                        escritorio: escritorio,
                                        columna: columna
                                    }
                                    createLinkApi(json)
                                    console.log(json);
                                    console.log(raiz.lastChild.innerText);
                                    refreshLinks(json)
                                }
                            })
                        })
                    }
                    if (type.startsWith('image/')) {
                        clipboardItem.getType(type).then((blob) => {
                            console.log('Imagen:', blob);
                            //var imageUrl = URL.createObjectURL(blob);
                            //Establecer la URL de datos como el src de la imagen
                            //document.getElementById('imagen').src = imageUrl;
                        });
                    }

                }
            }
        }
    })
}
async function createLinkApi(json) {
    console.log(json);
    //Declaramos el body para enviar y lo pasamos a cadena de texto
    let body = { 'nombre': json.name, 'URL': json.URL, 'imgURL': json.imgURL, 'escritorio': json.escritorio, 'columna': json.columna, 'id': json.idpanel, 'orden': json.orden }
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
}
async function getNameByUrl(url) {
    let res = await fetch(`http://localhost:3001/linkName?url=${url}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    if (!res.ok) throw { status: res.status, statusText: res.statusText }
    let title = await res.text();
    console.log(title);
    return title;
}
function refreshLinks(json) {

    console.log(json.name);

    //Por cada elemento construimos un link y lo insertamos en su raiz
    const $raiz = document.querySelector(`[data-db="${json.idpanel}"]`);

    const $div = document.createElement("div");
    $div.setAttribute("class", "link");
    $div.setAttribute("orden", `${json.orden}`);
    const $img = document.createElement("img");
    $img.setAttribute("src", `${json.imgURL}`);
    const $link = document.createElement("a");
    $link.setAttribute("href", `${json.URL}`);
    $link.setAttribute("target", "_blank");
    const $textos = document.createTextNode(`${json.name}`);
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
    //Borrar el dummy
    if ($raiz.childNodes[0].innerText == '') {
        $raiz.childNodes[0].remove();
    }
    document.querySelectorAll('.borralink').forEach(item => {
        item.removeEventListener('click', toggleDeleteDialogLink);
        item.addEventListener('click', toggleDeleteDialogLink);
    })
    document.querySelectorAll('.editalink').forEach(item => {
        item.removeEventListener('click', toggleDialogEditLink);
        item.addEventListener('click', toggleDialogEditLink);
    })
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
    
    let url = event.target.parentNode.parentNode.childNodes[0].href;
    let linkName = event.target.parentNode.parentNode.childNodes[0].innerText;
    let panelID = event.target.parentNode.parentNode.parentNode.getAttribute('data-db');
    const selectElement = document.getElementById('moveLink');
    let inputName = document.getElementById('editlinkName');
    let inputUrl = document.getElementById('editlinkURL');
    let panel = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerText;
    let boton = document.getElementById('editlinkSubmit');
   
    inputName.value = linkName;
    inputUrl.value = url;
    selectElement.value = panel;
    
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
                            // if ($raiz.hasChildNodes()) {
                            //     while ($raiz.childNodes.length >= 1) {
                            //         $raiz.removeChild($raiz.lastChild);
                            //     }
                            //     refreshLinks(items);
                            // }
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
        //console.log(el);
    } else {
        console.log('Panel Null');
    }


}

function ordenaCols(element) {
    //console.log("Se ejecuta ordenacols");
    //console.log(typeof (element));
    let arr = [];
    arr.push(element);
    //console.log(arr);

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
        //console.log(sortablelist2);
        // var order = sortablelist2.toArray();
        // localStorage.setItem(sortablelist2.options.group.name, order.join('|'));
        // console.log(sortablelist2.toArray());

        //Habrá que hacer un getItems y que lo añada al final o cualquier ostia
    })

}

//Funciones Animacion

function muestraCcontrols(event) {
    //console.log("Has hecho click");
    //console.log(event.target.nextSibling);

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

//Funcion logout 

function logOut () {
    console.log("Cierra sesión");
    document.cookie = `token=`
    window.location = "http://localhost:3001"
}