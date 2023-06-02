document.addEventListener('DOMContentLoaded', cargaWeb)
document.addEventListener('click', escondeDialogos)

/**
 * Función que carga los eventos en la web
 */
function cargaWeb () {
  // Añadimos los eventos de escritorio
  addDesktopEvents()
  // Cerrar el menú emergente cuando se hace clic en cualquier parte de la página
  document.addEventListener('click', function () {
    const menuC = document.getElementById('menuColumn')
    menuC.style.display = 'none'
    const menuL = document.getElementById('menuLink')
    menuL.style.display = 'none'
  })
  // Obtén todos los elementos de la página en los que quieres habilitar el menú emergente
  const elementos = document.querySelectorAll('#cols')

  // Agrega un event listener a cada elemento
  elementos.forEach(function (elemento) {
    elemento.addEventListener('contextmenu', mostrarMenu)
  })

  // Obtener los elementos del submenu mover columna
  const menuMoveColItems = document.querySelectorAll('#destDesk li')
  // Añadir un event listener a cada uno
  menuMoveColItems.forEach(function (item) {
    item.addEventListener('click', moveColumns)
  })
  // Obtener los elementos del submenu mover link
  const menuMoveLinkItems = document.querySelectorAll('#destCol li')
  // Añadir un event listener a cada uno
  menuMoveLinkItems.forEach(function (item) {
    item.addEventListener('click', moveLinks)
  })
  // obtener el menu de columna para pasarle el evento mouseleave
  const menuC = document.getElementById('menuColumn')
  // agregamos evento
  menuC.addEventListener('mouseleave', function () {
    setTimeout(() => {
      menuC.style.display = 'none'
    }, 500)
  })
  // obtener el menu de link para pasarle el evento mouseleave
  const menuL = document.getElementById('menuLink')
  // agregamos evento
  menuL.addEventListener('mouseleave', function () {
    setTimeout(() => {
      menuL.style.display = 'none'
    }, 500)
  })
  // Declaramos la variable para pasar a ordenaCols
  const desk = document.getElementById('deskTitle').innerText
  document.body.setAttribute('data-desk', `${desk}`)
  const $raiz = document.getElementById(`${desk}Cols`)

  // Añadimos los eventos de columnas
  addColumnEvents()

  // Añadimos los eventos de los links
  // Locura que si no llamas a ordenacols dos veces en dos funciones distintas(cierto?), no funciona, tocatelos
  addLinkEvents($raiz)
  const hijos = $raiz.childNodes
  hijos.forEach(element => {
    ordenaItems(element.childNodes[0].innerText)
  })
  ordenaCols($raiz)
}

// Manejo de Eventos

/**
 * Carga los manejadores de eventos para la manipulación de escritorios
 */
function addDesktopEvents () {
  // Agregar evento click a cada elemento de la lista de de selección escritorios
  document.querySelectorAll('.deskList').forEach(item => {
    item.removeEventListener('click', selectDesktop)
    item.addEventListener('click', selectDesktop)
  })

  // Agregar evento de clic al botón para agregar una columna
  document.querySelector('#addCol').removeEventListener('click', toggleDialogColumn)
  document.querySelector('#addCol').addEventListener('click', toggleDialogColumn)

  // Agregar evento de clic al botón para agregar un escritorio
  document.querySelector('#addDesk').removeEventListener('click', toggleDialogDesktop)
  document.querySelector('#addDesk').addEventListener('click', toggleDialogDesktop)

  // Agregar evento de clic al botón para editar un escritorio
  document.querySelector('#editDesk').removeEventListener('click', toggleDialogEditDesktop)
  document.querySelector('#editDesk').addEventListener('click', toggleDialogEditDesktop)

  // Agregar evento de clic al botón submit de editar un escritorio
  document.querySelector('#editdeskSubmit').removeEventListener('click', editDesktop)
  document.querySelector('#editdeskSubmit').addEventListener('click', editDesktop)

  // Agregar evento de clic al botón para eliminar un escritorio
  document.querySelector('#removeDesk').removeEventListener('click', toggleDeleteDialogDesk)
  document.querySelector('#removeDesk').addEventListener('click', toggleDeleteDialogDesk)

  // Añadir eventos en botones submit de crear escritorio
  document.querySelector('#deskSubmit').removeEventListener('click', createDesktop)
  document.querySelector('#deskSubmit').addEventListener('click', createDesktop)

  // Agregar evento de clic al botón de cerrar sesión
  document.querySelector('#logout').removeEventListener('click', logOut)
  document.querySelector('#logout').addEventListener('click', logOut)

  // Agregar evento de clic al botón de ir a perfil
  document.querySelector('#profile').removeEventListener('click', profile)
  document.querySelector('#profile').addEventListener('click', profile)
}
/**
 * Carga los manejadores de eventos para la manipulación de columnas
 */
function addColumnEvents () {
  document.querySelectorAll('.borracol').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogCol)
    item.addEventListener('click', toggleDeleteDialogCol)
  })
  // Agregar evento de clic al botón de añadir links
  document.querySelectorAll('.addlink').forEach(item => {
    item.removeEventListener('click', toggleDialogLink)
    item.addEventListener('click', toggleDialogLink)
  })
  // Agregar evento de clic al botón de editar columnas
  document.querySelectorAll('.editcol').forEach(item => {
    item.removeEventListener('click', toggleDialogEditColumn)
    item.addEventListener('click', toggleDialogEditColumn)
  })
  // Agregar evento de clic al botón principal de control
  document.querySelectorAll('.icofont-gear').forEach(item => {
    item.removeEventListener('click', muestraCcontrols)
    item.addEventListener('click', muestraCcontrols)
  })
  document.querySelectorAll('.paste-btn').forEach(item => {
    item.removeEventListener('click', pasteLink)
    item.addEventListener('click', pasteLink)
  })
  document.querySelector('#colSubmit').removeEventListener('click', createColumn)
  document.querySelector('#colSubmit').addEventListener('click', createColumn)

  document.querySelector('#editcolSubmit').removeEventListener('click', editColumn)
  document.querySelector('#editcolSubmit').addEventListener('click', editColumn)
}
/**
 * Carga los manejadores de eventos para la manipulación de links
 */
function addLinkEvents ($raiz) {
  document.querySelectorAll('.borralink').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogLink)
    item.addEventListener('click', toggleDeleteDialogLink)
  })
  document.querySelectorAll('.editalink').forEach(item => {
    item.removeEventListener('click', toggleDialogEditLink)
    item.addEventListener('click', toggleDialogEditLink)
  })
  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#linkSubmit').removeEventListener('click', createLink)
  document.querySelector('#linkSubmit').addEventListener('click', createLink)

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#editlinkSubmit').removeEventListener('click', editLink)
  document.querySelector('#editlinkSubmit').addEventListener('click', editLink)

  ordenaCols($raiz)
}

// Manejo de escritorios

/**
 *
 * @param {Object} event
 */
async function selectDesktop (event) {
  event.stopPropagation()
  const deskName = event.target.innerText
  window.location = `http://localhost:3001/templates?escritorio=${deskName}`
}
async function editDesktop () {
  const nombreOld = document.body.getAttribute('data-desk')
  const nombre = document.getElementById('editdeskName').value
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  let body = { nombre, nombreOld, user: cookieValue }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/escritorios', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  const json = await res.json()

  const firstKey = Object.keys(json)[0]
  const firstValue = json[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('editdeskError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const dialog = document.getElementById('editDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    refreshDesktops(json)
    addDesktopEvents()
  }
  document.getElementById('deskTitle').innerText = `${nombre}`
}
async function createDesktop () {
  const nombre = document.getElementById('deskName').value
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  let body = { nombre, user: cookieValue }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/escritorios', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  const firstKey = Object.keys(json)[0]
  const firstValue = json[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('deskError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const dialog = document.getElementById('addDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'

    refreshDesktops(json)
    addDesktopEvents()
  }

  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
// Es llamada desde el HTML de ahi el error
// eslint-disable-next-line no-unused-vars
async function deleteDesktop () {
  const nombre = document.body.getAttribute('data-desk')
  let body = { name: nombre }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/escritorios', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()

  // cargaWeb(json[0].name);
  window.location = `http://localhost:3001/templates?escritorio=${json[0].name}`
  const dialog = document.getElementById('deleteDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
/**
 * FUnción que recarga la lista de escritorios disponibles
 * @param {*} lista
 */
function refreshDesktops (lista) {
  // Declaramos la raiz donde va la lista de escritorios
  const $raiz = document.getElementById('drpEscritorios')
  // Convertimos el Json en Array
  const arr = Array.from(lista)
  // Si la raiz tiene hijos los vaciamos todos
  if ($raiz.hasChildNodes()) {
    while ($raiz.childNodes.length >= 1) {
      $raiz.removeChild($raiz.firstChild)
    }
  }

  arr.forEach(element => {
    const $nodos = document.createElement('a')
    $nodos.setAttribute('class', 'deskList')
    const $textos = document.createTextNode(`${element.name}`)

    $nodos.appendChild($textos)
    $raiz.appendChild($nodos)
  })
}

// Manejo de columnas

async function editColumn () {
  const nombre = document.getElementById('editcolName').value
  // const escritorio = document.body.getAttribute('data-desk')
  // const nombreOld = document.body.getAttribute('data-panel')
  const id = document.getElementById('editcolSubmit').getAttribute('sender')
  console.log(id)

  let body = { nombre, id }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/columnas', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // const json = await res.json()
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }

  const dialog = document.getElementById('editColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'

  const $Column = document.querySelector(`[data-db="${id}"]`)
  console.log($Column.parentNode.childNodes[0].childNodes[0].innerText)
  $Column.parentNode.childNodes[0].childNodes[0].innerText = nombre
}
async function createColumn () {
  const nombre = document.getElementById('colName').value
  const escritorio = document.body.getAttribute('data-desk')
  const $raiz0 = document.getElementById(`${escritorio}Cols`)

  let orden = $raiz0.childNodes.length
  orden = orden + 1
  console.log(orden)
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  let body = { nombre, escritorio: `${escritorio}`, order: orden, user: cookieValue }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/columnas', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()

  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }

  const dialog = document.getElementById('addColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'

  refreshColumns(json)
}
// eslint-disable-next-line no-unused-vars
async function deleteColumn () {
  const escritorio = document.body.getAttribute('data-desk')
  const elementoId = document.getElementById('confDeletecolSubmit').getAttribute('sender')

  let body = { id: elementoId, escritorio: `${escritorio}` }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/columnas', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // const json = await res.json()

  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }

  const $colBorrar = document.querySelector(`[data-db="${elementoId}"]`)

  $colBorrar.parentNode.remove()

  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
async function moveColumns (event) {
  console.log(event.target.id)
  const deskOrigen = document.body.getAttribute('data-desk')
  const deskDestino = event.target.id
  const colId = event.target.parentNode.parentNode.parentNode.childNodes[1].innerText
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  console.log(deskOrigen)
  console.log(deskDestino)
  console.log(colId)
  console.log(cookieValue)
  let body = { deskOrigen, deskDestino, colId, user: cookieValue }
  body = JSON.stringify(body)

  // TODO Control de errores del fetch
  const res = await fetch('http://localhost:3001/moveCols', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  // La respuesta son los datos del link recien creado
  const json = await res.json()
  console.log(json)
  const $raiz = document.querySelector(`[data-db="${colId}"]`)
  $raiz.parentNode.remove()
  console.log($raiz.parentNode)
}
/**
 * Función que crea la columna cuando se crea con createColumn
 * Recibe la columna creada
 * @param {json} json
 */
function refreshColumns (json) {
  console.log(json[0])
  console.log(json[0].name)
  console.log(json[0]._id)

  const nombre = json[0].name
  const id = json[0]._id

  const escritorioActual = document.body.getAttribute('data-desk')
  const $raiz = document.getElementById(`${escritorioActual}Cols`)
  const arr = []

  document.querySelectorAll('.headercolumn').forEach(element => {
    console.log(element.childNodes[0].innerText)
    arr.push(element.childNodes[0].innerText)
  })
  console.log(arr)

  const $columna = document.createElement('div')
  $columna.setAttribute('class', 'columna')

  // Permite detectar duplicados y darles un id distinto incremental, luego cuando se refresque la pag lo implementará en plantilla

  const count = arr.reduce((acc, currentValue) => {
    if (currentValue === nombre) {
      return acc + 1
    } else {
      return acc
    }
  }, 0)
  console.log(count)
  if (count > 0) {
    $columna.setAttribute('id', `${escritorioActual}${nombre}${count + 1}`)
  } else {
    $columna.setAttribute('id', `${escritorioActual}${nombre}`)
  }

  $columna.setAttribute('data-db', `${id}`)

  const $div = document.createElement('div')
  $div.setAttribute('class', 'link')
  $columna.appendChild($div)

  const $envolt = document.createElement('div')
  $envolt.setAttribute('class', 'envolt')
  $envolt.setAttribute('orden', '') // No es necesario siempre al final? ver de donde viene puede ser necesario para ordencols, etc
  const $headerColumn = document.createElement('div')
  $headerColumn.setAttribute('class', 'headercolumn')
  const $header = document.createElement('h2')
  $header.setAttribute('class', 'ctitle')
  const $textos = document.createTextNode(`${nombre}`)

  $header.appendChild($textos)
  $headerColumn.appendChild($header)

  $envolt.appendChild($headerColumn)
  $envolt.appendChild($columna)

  $raiz.appendChild($envolt)

  addColumnEvents()
  ordenaItems(nombre)
  ordenaCols($raiz)
}
// Manejo de links

async function editLink () {
  // console.log("Edita el link");
  const nombreOld = document.body.getAttribute('data-link')
  const escritorio = document.body.getAttribute('data-desk')
  const columna = document.body.getAttribute('data-panel')
  const nombre = document.querySelector('#editlinkName').value
  const linkURL = document.querySelector('#editlinkURL').value
  const imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`
  const dbID = document.getElementById('editlinkSubmit').getAttribute('sender')
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }

  const dialog = document.getElementById('editLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
  let body = { nombreOld, nombre, URL: linkURL, imgURL, escritorio, columna, id: dbID, user: cookieValue }
  // console.log(body);
  body = JSON.stringify(body)
  // console.log(JSON.stringify(body));
  const res = await fetch('http://localhost:3001/links', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  console.log(json)

  const $raiz = document.querySelector(`[data-db="${dbID}"]`)
  const arr = Array.from($raiz.childNodes)
  console.log(arr)
  const elementoAEditar = arr.find((elemento) => elemento.innerText === nombreOld)
  if (elementoAEditar) {
    elementoAEditar.querySelector('img').src = json.imgURL
    elementoAEditar.querySelector('a').href = json.URL
    elementoAEditar.querySelector('a').childNodes[1].nodeValue = nombre
  }
  // console.log($raiz);
  // if ($raiz.hasChildNodes()) {
  //     while ($raiz.childNodes.length >= 1) {
  //         $raiz.removeChild($raiz.lastChild);
  //     }
  // }
  // refreshLinks(json)
  // ordenaItems(columna)
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function createLink () {
  // Recogemos los datos para enviarlos a la db
  const escritorio = document.body.getAttribute('data-desk')
  const columna = document.body.getAttribute('data-panel')
  const nombre = document.querySelector('#linkName').value
  const linkURL = document.querySelector('#linkURL').value
  const imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`
  const dbID = document.getElementById('linkSubmit').getAttribute('sender')
  // Seleccionamos columna por id, por si hay dos con el mismo nombre
  const $raiz = document.querySelector(`[data-db="${dbID}"]`)

  let orden = $raiz.childNodes.length
  orden = orden + 1
  console.log(orden)

  const elements = $raiz.childNodes
  const sortedElements = Array.from(elements).sort((a, b) => {
    return a.dataset.orden - b.dataset.orden
  })
  console.log(sortedElements)
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  // Declaramos el body para enviar y lo pasamos a cadena de texto
  let body = { nombre, URL: linkURL, imgURL, escritorio, columna, id: dbID, orden, user: cookieValue }
  body = JSON.stringify(body)
  // Enviamos el post con el link
  // TODO Control de errores del fetch
  const res = await fetch('http://localhost:3001/links', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  // La respuesta son los datos del link recien creado
  const json = await res.json()
  const firstKey = Object.keys(json)[0]
  const firstValue = json[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('linkError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    // Cerramos el cuadro de diálogo
    const dialog = document.getElementById('addLinkForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    // La rellenamos con los datos del json
    refreshLinks(json)
  }
}
// eslint-disable-next-line no-unused-vars
async function deleteLink () {
  const nombre = document.body.getAttribute('data-link')
  const panel = document.body.getAttribute('data-panel')

  const id = document.getElementById('confDeletelinkSubmit').getAttribute('sender')

  const escritorio = document.body.getAttribute('data-desk')
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  let body = { nombre, panel, escritorio, id, user: cookieValue }
  body = JSON.stringify(body)

  const res = await fetch('http://localhost:3001/links', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  console.log(json)
  console.log(json.length)
  const $raiz = document.querySelector(`[data-db="${id}"]`)
  console.log($raiz.childNodes)
  const arr = Array.from($raiz.childNodes)
  console.log(arr)
  const elementoABorrar = arr.find((elemento) => elemento.innerText === nombre)
  if (elementoABorrar) {
    elementoABorrar.remove()
  }
  // if (json.length === 1) {
  //     if ($raiz.hasChildNodes()) {
  //         while ($raiz.childNodes.length >= 1) {
  //             $raiz.removeChild($raiz.lastChild);
  //         }
  //     }
  // }

  if (json.length === 0) {
    console.log('Era el último')
    const $div = document.createElement('div')
    $div.setAttribute('class', 'link')
    $raiz.appendChild($div)
  }
  // refreshLinks(json)
  // panel = panel.replace(escritorio, "");
  // console.log(panel);
  // ordenaItems(panel)
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  console.log(visible)
  dialog.style.display = visible ? 'none' : 'flex'

  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function moveLinks (event) {
  // Recogemos el usuario
  const cookieName = 'user'
  const cookieValue = getCookie(cookieName)
  if (cookieValue) {
    // La cookie existe y se leyó correctamente
    console.log(cookieValue)
    // Puedes trabajar con el valor de la cookie aquí
  }
  // Recogemos el id del panel de origen
  const panelOrigenId = document.body.getAttribute('idpanel')
  // Recogemos el nombre del panel de destino
  const panelDestinoNombre = event.target.innerText
  // Declaramos la variable para recoger el id del panel destino
  let panelDestinoId
  // Declaramos la variable para recoger la cantidad de hijos que quedan
  let panelOldChildCount
  // Recogemos la variable para detectar el panel de destino que coincida con panelDestinoNombre
  const paneles = document.querySelectorAll('h2.ctitle')
  if (paneles) {
    paneles.forEach(element => {
      if (element.innerText === panelDestinoNombre) {
        // Hacer algo con el elemento encontrado
        panelDestinoId = element.parentNode.parentNode.childNodes[1].dataset.db
        panelOldChildCount = element.parentNode.parentNode.childNodes[1].childNodes.length
      }
    })
  }
  console.log(panelOldChildCount)
  // Recogemos el nombre del link movido
  const linkName = event.target.parentNode.parentNode.parentNode.childNodes[2].innerText
  // Declaramos el body
  let body = { panelOrigenId, panelDestinoId, panelDestinoNombre, user: cookieValue, name: linkName, orden: panelOldChildCount + 1 }
  body = JSON.stringify(body)
  const res = await fetch('http://localhost:3001/moveLinks', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  // La respuesta son los datos del link recien movido
  const json = await res.json()
  console.log(json)
  // Recogemos los links para detectar el movido y eliminarlo
  const links = document.querySelectorAll('div.link')
  if (links) {
    links.forEach(element => {
      // problema con duplicados, meter id de base de datos como id de elemento
      if (element.id === json._id) {
        console.log(element.id)
        console.log(json._id)
        // Hacer algo con el elemento encontrado
        element.remove()
      }
    })
  }
  /* --- */
  const elements = document.querySelectorAll(`[data-db="${panelDestinoId}"]`)[0].childNodes
  console.log(elements)
  const id = elements[0].parentNode.getAttribute('data-db')
  console.log(id)
  const sortedElements = Array.from(elements).sort((a, b) => {
    return a.dataset.orden - b.dataset.orden
  })
  console.log(sortedElements)
  const names = []
  sortedElements.forEach(element => {
    names.push(element.innerText)
  })
  console.log(names)
  body = names
  body = JSON.stringify({ body })
  // La url /draglink ejecuta una función que actualiza el orden del link en la columna
  const res2 = await fetch(`http://localhost:3001/draglink?idColumna=${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json2 = await res2.json()
  console.log(json2)
  const testDummy = document.querySelectorAll(`[data-db="${panelOrigenId}"]`)[0].childNodes.length
  if (testDummy === 0) {
    const dummy = document.createElement('div')
    dummy.setAttribute('class', 'link')
    document.querySelectorAll(`[data-db="${panelOrigenId}"]`)[0].appendChild(dummy)
  }
  console.log(testDummy)
  // Meter el dummy
  refreshLinks(json)
}
async function pasteLink (event) {
  // lee el contenido del portapapeles entonces ...
  navigator.clipboard.read().then((clipboardItems) => {
    // por cada clipboardItem ...
    for (const clipboardItem of clipboardItems) {
      // Si el length de la propiedad types es 1, es texto plano
      if (clipboardItem.types.length === 1) {
        // lo confirmamos
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            // Pasamos el blob a texto
            clipboardItem.getType(type).then((blob) => {
              blob.text().then(function (text) {
                console.log(text)
                // Si tiene un enlace
                if (text.indexOf('http') === 0) {
                  console.log('Tiene un enlace')
                  const raiz = event.target.parentNode.childNodes[1].innerText
                  const $raiz = document.querySelector(`[data-db="${raiz}"]`)
                  const url = text
                  const cookieName = 'user'
                  const cookieValue = getCookie(cookieName)
                  if (cookieValue) {
                    // La cookie existe y se leyó correctamente
                    console.log(cookieValue)
                    // Puedes trabajar con el valor de la cookie aquí
                  }
                  async function procesarEnlace () {
                    const nombre = await getNameByUrl(text)
                    const escritorio = document.body.getAttribute('data-desk')
                    const columna = document.body.getAttribute('data-panel')
                    let orden = $raiz.childNodes.length
                    orden = orden + 1
                    console.log(orden)
                    const json = {
                      idpanel: raiz,
                      name: nombre,
                      URL: url,
                      imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                      orden,
                      escritorio,
                      columna,
                      user: cookieValue
                    }
                    createLinkApi(json)
                    console.log(json)
                    // console.log(raiz.lastChild.innerText)
                    refreshLinks(json)
                  }
                  procesarEnlace()
                } else {
                  console.log('Es texto plano')
                  console.log(text)
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
                console.log(text)
                if (text.indexOf('<a href') === 0) {
                  console.log('Es un enlace html')
                  console.log(text)
                  const raiz = event.target.parentNode.childNodes[1].innerText
                  console.log(typeof (text))
                  console.log(text)
                  // raiz.innerHTML += text;
                  const range = document.createRange()
                  range.selectNode(document.body)

                  const fragment = range.createContextualFragment(text)

                  const a = fragment.querySelector('a')
                  const url = a.href
                  const nombre = a.innerText
                  const escritorio = document.body.getAttribute('data-desk')
                  const columna = document.body.getAttribute('data-panel')
                  const $raiz = document.querySelector(`[data-db="${raiz}"]`)

                  let orden = $raiz.childNodes.length
                  orden = orden + 1
                  console.log(orden)
                  const cookieName = 'user'
                  const cookieValue = getCookie(cookieName)
                  if (cookieValue) {
                    // La cookie existe y se leyó correctamente
                    console.log(cookieValue)
                    // Puedes trabajar con el valor de la cookie aquí
                  }
                  const json = {
                    idpanel: raiz,
                    name: nombre,
                    URL: url,
                    imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                    orden,
                    escritorio,
                    columna,
                    user: cookieValue
                  }
                  createLinkApi(json)
                  console.log(json)
                  // console.log(raiz.lastChild.innerText)
                  refreshLinks(json)
                }
              })
            })
          }
          if (type.startsWith('image/')) {
            clipboardItem.getType(type).then((blob) => {
              console.log('Imagen:', blob)
              // var imageUrl = URL.createObjectURL(blob);
              // Establecer la URL de datos como el src de la imagen
              // document.getElementById('imagen').src = imageUrl;
            })
          }
        }
      }
    }
  })
}
async function createLinkApi (json) {
  console.log(json)
  // Declaramos el body para enviar y lo pasamos a cadena de texto
  let body = { nombre: json.name, URL: json.URL, imgURL: json.imgURL, escritorio: json.escritorio, columna: json.columna, id: json.idpanel, orden: json.orden, user: json.user }
  body = JSON.stringify(body)
  // Enviamos el post con el link
  // TODO Control de errores del fetch
  const res = await fetch('http://localhost:3001/links', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
}
async function getNameByUrl (url) {
  const res = await fetch(`http://localhost:3001/linkName?url=${url}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  const title = await res.text()
  console.log(title)
  return title
}
function refreshLinks (json) {
  console.log(json.name)

  // Por cada elemento construimos un link y lo insertamos en su raiz
  const $raiz = document.querySelector(`[data-db="${json.idpanel}"]`)

  const $div = document.createElement('div')
  $div.setAttribute('class', 'link')
  $div.setAttribute('orden', `${json.orden}`)
  const $img = document.createElement('img')
  $img.setAttribute('src', `${json.imgURL}`)
  const $link = document.createElement('a')
  $link.setAttribute('href', `${json.URL}`)
  $link.setAttribute('target', '_blank')
  const $textos = document.createTextNode(`${json.name}`)
  const $lcontrols = document.createElement('div')
  $lcontrols.setAttribute('class', 'lcontrols')
  const $editControl = document.createElement('span')
  $editControl.setAttribute('class', 'icofont-ui-edit editalink')
  const $deleteControl = document.createElement('span')
  $deleteControl.setAttribute('class', 'icofont-recycle borralink')

  $lcontrols.appendChild($editControl)
  $lcontrols.appendChild($deleteControl)
  $link.appendChild($img)
  $link.appendChild($textos)

  $div.appendChild($link)
  $div.appendChild($lcontrols)

  $raiz.appendChild($div)
  // Borrar el dummy
  if ($raiz.childNodes[0].innerText === '') {
    $raiz.childNodes[0].remove()
  }
  document.querySelectorAll('.borralink').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogLink)
    item.addEventListener('click', toggleDeleteDialogLink)
  })
  document.querySelectorAll('.editalink').forEach(item => {
    item.removeEventListener('click', toggleDialogEditLink)
    item.addEventListener('click', toggleDialogEditLink)
  })
}
// funciones auxiliares para mostrar/ocultar cuadros de diálogo

function toggleDialogColumn () {
  const dialog = document.getElementById('addColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditColumn (event) {
  // console.log("entra");
  const panel = event.target.parentNode.parentNode.childNodes[0].innerText
  // const panelID = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db')
  const panelID = event.target.parentNode.childNodes[1].innerText
  console.log(panelID)
  const boton = document.getElementById('editcolSubmit')
  boton.setAttribute('sender', `${panelID}`)
  document.body.setAttribute('data-panel', `${panel}`)
  const dialog = document.getElementById('editColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogDesktop () {
  const dialog = document.getElementById('addDeskForm')
  const visible = dialog.style.display === 'flex'
  // console.log(visible);
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditDesktop (event) {
  const dialog = document.getElementById('editDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogLink (event) {
  // const panel = event.target.parentNode.parentNode.childNodes[0].innerText
  const panelID = event.target.parentNode.childNodes[1].innerText
  // document.body.setAttribute('data-panel', `${panel}`)
  const boton = document.getElementById('linkSubmit')
  boton.setAttribute('sender', `${panelID}`)
  // console.log(panelID);
  const dialog = document.getElementById('addLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditLink (event) {
  const url = event.target.parentNode.childNodes[1].innerText
  const linkName = event.target.parentNode.childNodes[2].innerText
  const panelID = document.body.getAttribute('idpanel')
  const selectElement = document.getElementById('moveLink')
  const inputName = document.getElementById('editlinkName')
  const inputUrl = document.getElementById('editlinkURL')
  const panel = document.body.getAttribute('data-panel')
  const boton = document.getElementById('editlinkSubmit')

  inputName.value = linkName
  inputUrl.value = url
  selectElement.value = panel

  boton.setAttribute('sender', `${panelID}`)
  document.body.setAttribute('data-panel', `${panel}`)
  document.body.setAttribute('data-link', `${linkName}`)

  const dialog = document.getElementById('editLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogLink (event) {
  // nombre panel escritorio id
  console.log(event.target)
  const nombre = event.target.parentNode.childNodes[2].innerText
  const panelId = document.body.getAttribute('idpanel')
  const panel = document.body.getAttribute('data-panel')
  const boton = document.getElementById('confDeletelinkSubmit')
  boton.setAttribute('sender', `${panelId}`)
  document.body.setAttribute('data-panel', `${panel}`)
  document.body.setAttribute('data-link', `${nombre}`)
  console.log('Confirmación de Borrado')
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogCol (event) {
  console.log(event.target)
  const id = event.target.parentNode.childNodes[1].innerText
  // const id = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db')
  const boton = document.getElementById('confDeletecolSubmit')
  boton.setAttribute('sender', `${id}`)
  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogDesk (event) {
  console.log('Confirmación borrar escritorio')
  const dialog = document.getElementById('deleteDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
// eslint-disable-next-line no-unused-vars
function escondeDeleteDialog () {
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  console.log(visible)
  dialog.style.display = visible ? 'none' : 'flex'
}
// eslint-disable-next-line no-unused-vars
function escondeDeleteColDialog () {
  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
// eslint-disable-next-line no-unused-vars
function escondeDeleteDeskDialog () {
  const dialog = document.getElementById('deleteDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function escondeDialogos (event) {
  let cuadros = []
  // Introducimos todos los formularios
  cuadros.push(Array.from(document.querySelectorAll('.deskForm')))
  cuadros = [].concat.apply([], cuadros)
  // Introducimos los botones de control de escritorios
  cuadros.push(document.getElementById('addDesk'))
  cuadros.push(document.getElementById('addCol'))
  cuadros.push(document.getElementById('editDesk'))
  cuadros.push(document.getElementById('removeDesk'))

  // Introducimos los botones de las columnas para añadir links
  cuadros.push(Array.from(document.querySelectorAll('.addlink')))
  cuadros = [].concat.apply([], cuadros)
  cuadros.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  })
  // Introducimos los botones de las columnas para editar columnas
  cuadros.push(Array.from(document.querySelectorAll('.editcol')))
  cuadros = [].concat.apply([], cuadros)
  cuadros.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  })
  // Introducimos los botones de los links para editar links
  cuadros.push(Array.from(document.querySelectorAll('.editalink')))
  cuadros = [].concat.apply([], cuadros)
  cuadros.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  })
  // Introducimos los botones de los links para borrar links
  cuadros.push(Array.from(document.querySelectorAll('.borralink')))
  cuadros = [].concat.apply([], cuadros)
  cuadros.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  })
  // Introducimos los botones de las columnas para borrar columna
  cuadros.push(Array.from(document.querySelectorAll('.borracol')))
  cuadros = [].concat.apply([], cuadros)
  cuadros.forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  })
  // console.log(cuadros);

  // Si se ha hecho click fuera de cualquier boton y dialogo
  if (!cuadros.includes(event.target)) {
    // console.log(event.target);
    cuadros.forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation()
      })
      const visible = element.style.display === 'flex'
      if (visible) {
        element.style.display = 'none'
      }
    })
  }
}

// Funciones para aplicar Sortablejs

function ordenaItems (panel) {
  if (panel !== null) {
    const escritorioActual = document.body.getAttribute('data-desk')
    const el = []
    // let order = [];
    el.push(document.getElementById(`${escritorioActual}${panel}`))

    el.forEach(element => {
      const grupo = `Shared${escritorioActual}`

      // eslint-disable-next-line no-undef, no-unused-vars
      const sortableList = Sortable.create(element, {
        group: grupo,
        filter: '.envolt',
        options: {
          sort: false,
          dataIdAttr: 'data-id'
        },
        // Al terminar de arrastrar el elemento, decidimos que hacer dependiendo de si
        // se ha arrastrado en la misma columna o a una distinta
        onEnd: async function (evt) {
          const itemEl = evt.item
          const listaOrigen = evt.from
          const listaDestino = evt.to
          const newId = listaDestino.attributes[2].nodeValue
          // console.log(newId);
          const escritorio = document.body.getAttribute('data-desk')
          // console.log(escritorio);
          const panel = itemEl.parentNode.parentNode.childNodes[0].innerText
          // console.log(panel);
          const nombre = itemEl.childNodes[0].innerText
          // console.log(`Nombre: ${nombre}`);
          const oldId = listaOrigen.attributes[2].nodeValue

          // Si el elemento arrastrado es el último crea un elemento link vacio
          if (document.querySelector(`[data-db="${oldId}"]`).childNodes.length === 0) {
            console.log('Era el último')
            const $raizOld = document.querySelector(`[data-db="${oldId}"]`)
            const $div = document.createElement('div')
            $div.setAttribute('class', 'link')
            $raizOld.appendChild($div)
          }
          // Si el elemento se vuelve a arrastrar a una columna con dummy eliminar el dummy
          if (document.querySelector(`[data-db="${newId}"]`).childNodes.length === 2) {
            const $raizNew = document.querySelector(`[data-db="${newId}"]`)
            const hijos = $raizNew.children
            console.log(hijos)
            for (let i = 0; i < hijos.length; i++) {
              const hijo = hijos[i]

              if (!hijo.innerText) {
                // El elemento hijo no tiene innerText
                console.log('El elemento hijo no tiene innerText:', hijo)
                $raizNew.removeChild(hijo)
              }
            }
          }

          // Hacemos un fetch a la url /draglinks que ejecuta una funcion que edita el elemento si se ha arrastrado a una columna distinta, si se ha arrastrado a la misma columna devuelve un mensaje indicandolo, lo averigua comparando el oldId y el newId
          let body = { escritorio, name: nombre, newId, oldId, panel }
          // console.log(body);
          body = JSON.stringify(body)
          const res = await fetch('http://localhost:3001/draglinks', {
            method: 'PUT',
            headers: {
              'content-type': 'application/json'
            },
            body
          })
          const json = await res.json()
          console.log(json)

          const elements = document.querySelectorAll(`[data-db="${newId}"]`)[0].childNodes
          console.log(elements)
          const id = elements[0].parentNode.getAttribute('data-db')
          console.log(id)
          const sortedElements = Array.from(elements).sort((a, b) => {
            return a.dataset.orden - b.dataset.orden
          })
          console.log(sortedElements)
          const names = []
          sortedElements.forEach(element => {
            names.push(element.innerText)
          })
          console.log(names)
          body = names
          body = JSON.stringify({ body })
          // La url /draglink ejecuta una función que actualiza el orden del link en la columna
          const res2 = await fetch(`http://localhost:3001/draglink?idColumna=${id}`, {
            method: 'PUT',
            headers: {
              'content-type': 'application/json'
            },
            body
          })
          const json2 = await res2.json()
          console.log(json2)
          // --------------------------------------------------------
          // console.log(json.length);
          // const objeto = JSON.parse(json);
          const claves = Object.keys(json)
          const primerValor = claves[0]
          // console.log(primerValor);
          // Si el primer valor es distinto de respuesta se ha arrastrado a otra columna
          if (primerValor !== 'Respuesta') {
            const groupByPanel = json2.reduce((acc, elem) => {
              if (acc[elem.panel]) {
                acc[elem.panel].push(elem)
              } else {
                acc[elem.panel] = [elem]
              }
              return acc
            }, {})
            // console.log(groupByPanel);
            for (const panel in groupByPanel) {
              // eslint-disable-next-line no-unused-vars
              const items = groupByPanel[panel]
              // eslint-disable-next-line no-unused-vars
              const $raiz = document.querySelector(`[id="${escritorio}${panel}"]`)
              // console.log($raiz);
              // if ($raiz.hasChildNodes()) {
              //     while ($raiz.childNodes.length >= 1) {
              //         $raiz.removeChild($raiz.lastChild);
              //     }
              //     refreshLinks(items);
              // }
              // console.log(items);
              // console.log(panel);
              // ordenaItems(panel);
            }
            console.log(json)
          } else {
            // console.log(json);
            const elements = document.querySelectorAll(`[data-db="${newId}"]`)[0].childNodes
            console.log(elements)
            const id = elements[0].parentNode.getAttribute('data-db')
            console.log(id)
            const sortedElements = Array.from(elements).sort((a, b) => {
              return a.dataset.orden - b.dataset.orden
            })
            console.log(sortedElements)
            const names = []
            sortedElements.forEach(element => {
              names.push(element.innerText)
            })
            console.log(names)
            let body = names
            body = JSON.stringify({ body })
            const res = await fetch(`http://localhost:3001/draglink?idColumna=${id}`, {
              method: 'PUT',
              headers: {
                'content-type': 'application/json'
              },
              body
            })
            const json = await res.json()
            console.log(json)
          }
        }
      })
      // order.push(sortableList.toArray());
      // var order = sortableList.toArray();
      // localStorage.setItem(sortableList.options.group.name, order.join('|'));
      // console.log(sortableList.toArray());
      // console.log(order);
    })
    // console.log(el);
  } else {
    console.log('Panel Null')
  }
}

function ordenaCols (element) {
  // console.log("Se ejecuta ordenacols");
  // console.log(typeof (element));
  const arr = []
  arr.push(element)
  // console.log(arr);

  arr.forEach(element => {
    // eslint-disable-next-line no-undef, no-unused-vars
    const sortablelist2 = Sortable.create(element, {

      group: `Grupo${element.id}`,
      sort: false,
      dataIdAttr: 'data-id',
      onEnd: async function (evt) {
        const itemEl = evt.item
        console.log(itemEl)
        const escritorio = document.body.getAttribute('data-desk')
        const elements = document.getElementById(`${escritorio}Cols`).childNodes
        console.log(elements)

        const sortedElements = Array.from(elements).sort((a, b) => {
          return a.dataset.orden - b.dataset.orden
        })
        console.log(sortedElements)
        const names = []
        sortedElements.forEach(element => {
          names.push(element.childNodes[1].dataset.db)
        })
        console.log(names)
        let body = names
        body = JSON.stringify({ body })
        const res = await fetch(`http://localhost:3001/dragcol?escritorio=${escritorio}`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json'
          },
          body
        })
        const json = await res.json()
        console.log(json)
      }

    })
    // console.log(sortablelist2);
    // var order = sortablelist2.toArray();
    // localStorage.setItem(sortablelist2.options.group.name, order.join('|'));
    // console.log(sortablelist2.toArray());

    // Habrá que hacer un getItems y que lo añada al final o cualquier ostia
  })
}

// Funciones Animacion

function muestraCcontrols (event) {
  // console.log("Has hecho click");
  // console.log(event.target.nextSibling);

  const controls = event.target.nextSibling

  controls.classList.toggle('visible')
  // eslint-disable-next-line no-undef
  anime({
    targets: controls,
    translateY: controls.classList.contains('visible') ? '0%' : '200%',
    zIndex: controls.classList.contains('visible') ? 1 : -1,
    easing: 'easeInOutQuad',
    duration: 300
  })
}

// Funcion logout

function logOut () {
  console.log('Cierra sesión')
  document.cookie = 'token='
  window.location = 'http://localhost:3001'
}
// Funcio ir a perfil
function profile () {
  console.log('Has hecho click')
  window.location = 'http://localhost:3001/profile'
}
const getCookie = (name) => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1)
    }
  }
  return null
}
function mostrarMenu (event) {
  event.preventDefault() // Evitar el menú contextual predeterminado del navegador

  // Detectar si se hizo clic con el botón derecho del ratón
  if (event.button === 2) {
    if (event.target.nodeName === 'H2') {
      const menu = document.getElementById('menuColumn')
      menu.style.display = 'block'
      const menuL = document.getElementById('menuLink')
      const visible = menuL.style.display === 'block'
      if (visible) {
        menuL.style.display = 'none'
      }
      // Obtener la posición del ratón
      const posX = event.clientX
      const posY = event.clientY

      // Posicionar el menú emergente cerca de la posición del ratón
      menu.style.left = posX + 'px'
      menu.style.top = posY + 'px'
      // Obtener la información del elemento en el que se hizo clic
      const elemento = event.target
      const colId = elemento.parentNode.parentNode.childNodes[1].dataset.db
      console.log(elemento.parentNode.parentNode.childNodes[1].dataset)
      const informacion = elemento.textContent // Otra propiedad del elemento que desees mostrar
      const botonConfBorrar = document.getElementById('confDeletecolSubmit')
      botonConfBorrar.setAttribute('sender', colId)
      // Actualizar el contenido del menú emergente con la información relevante
      const info = document.getElementById('infoC')
      info.textContent = informacion
      document.body.setAttribute('data-panel', informacion)
      // Actualizar el contenido del menú emergente con la información relevante
      const contenidoMenu = document.getElementById('elementoC')
      contenidoMenu.textContent = elemento.parentNode.parentNode.childNodes[1].dataset.db
    }
    if (event.target.nodeName === 'A' || event.target.nodeName === 'IMG') {
      const menu = document.getElementById('menuLink')
      menu.style.display = 'block'
      const menuC = document.getElementById('menuColumn')
      const visible = menuC.style.display === 'block'
      if (visible) {
        menuC.style.display = 'none'
      }
      // Obtener la posición del ratón
      const posX = event.clientX
      const posY = event.clientY

      // Posicionar el menú emergente cerca de la posición del ratón
      menu.style.left = posX + 'px'
      menu.style.top = posY + 'px'
      if (event.target.nodeName === 'IMG') {
        const elemento = event.target.parentNode
        console.log(elemento.parentNode.parentNode.dataset.db)
        document.body.setAttribute('idPanel', elemento.parentNode.parentNode.dataset.db)
        document.body.setAttribute('data-panel', elemento.parentNode.parentNode.previousSibling.childNodes[0].innerText)
        const informacion = elemento.textContent
        const info = document.getElementById('infoL')
        info.textContent = informacion
        // Actualizar el contenido del menú emergente con la información relevante
        const contenidoMenu = document.getElementById('elementoL')
        contenidoMenu.textContent = elemento
      } else {
        // Obtener la información del elemento en el que se hizo clic
        const elemento = event.target
        console.log(elemento.parentNode.parentNode.dataset.db)
        document.body.setAttribute('idPanel', elemento.parentNode.parentNode.dataset.db)
        document.body.setAttribute('data-panel', elemento.parentNode.parentNode.previousSibling.childNodes[0].innerText)
        const informacion = elemento.textContent // Otra propiedad del elemento que desees mostrar

        // Actualizar el contenido del menú emergente con la información relevante
        const info = document.getElementById('infoL')
        info.textContent = informacion
        // Actualizar el contenido del menú emergente con la información relevante
        const contenidoMenu = document.getElementById('elementoL')
        contenidoMenu.textContent = elemento
      }
    }
  }
}
