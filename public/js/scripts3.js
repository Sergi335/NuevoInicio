import { darHora, fetchS } from './functions.mjs'
import { togglePanel } from './sidepanel.js'

document.addEventListener('DOMContentLoaded', cargaWeb)
document.addEventListener('click', escondeDialogos)

/**
 * Función que carga los eventos en la web
 */
function cargaWeb () {
  // Añadimos los eventos de escritorio
  addDesktopEvents()
  darHora()
  const menuItems = document.querySelectorAll('.deskList')
  const desktop = window.location.href
  const partes = desktop.split('=')
  const valor = partes.pop()
  const valorDecodificado = decodeURIComponent(valor)
  menuItems.forEach(item => {
    if (item.innerText === valorDecodificado) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
  if (window.location.href === 'http://localhost:3001/templates') {
    menuItems[0].classList.add('active')
  }
  // Obtener todos los elementos de la página en los que quieres habilitar el menú emergente
  const elementos = document.querySelectorAll('.cuerpoInt')

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
  ordenaDesks()
  // eslint-disable-next-line no-undef
  // GridStack.init()
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
  // Agregar evento de clic al botón para confirmar eliminacion de un escritorio
  document.querySelector('#confDeletedeskSubmit').removeEventListener('click', deleteDesktop)
  document.querySelector('#confDeletedeskSubmit').addEventListener('click', deleteDesktop)
  // Agregar evento de clic al botón para confirmar eliminacion de un escritorio
  document.querySelector('#noDeletedeskSubmit').removeEventListener('click', escondeDeleteDeskDialog)
  document.querySelector('#noDeletedeskSubmit').addEventListener('click', escondeDeleteDeskDialog)
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

  document.querySelectorAll('.paste-btn').forEach(item => {
    item.removeEventListener('click', pasteLink)
    item.addEventListener('click', pasteLink)
  })
  document.querySelector('#colSubmit').removeEventListener('click', createColumn)
  document.querySelector('#colSubmit').addEventListener('click', createColumn)

  document.querySelector('#editcolSubmit').removeEventListener('click', editColumn)
  document.querySelector('#editcolSubmit').addEventListener('click', editColumn)

  document.querySelector('#confDeletecolSubmit').removeEventListener('click', deleteColumn)
  document.querySelector('#confDeletecolSubmit').addEventListener('click', deleteColumn)

  document.querySelector('#noDeletecolSubmit').removeEventListener('click', escondeDeleteColDialog)
  document.querySelector('#noDeletecolSubmit').addEventListener('click', escondeDeleteColDialog)
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

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#confDeletelinkSubmit').removeEventListener('click', deleteLink)
  document.querySelector('#confDeletelinkSubmit').addEventListener('click', deleteLink)

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#noDeletelinkSubmit').removeEventListener('click', escondeDeleteDialog)
  document.querySelector('#noDeletelinkSubmit').addEventListener('click', escondeDeleteDialog)

  ordenaCols($raiz)
}

// Manejo de escritorios

/**
 * Función para navegar entre escritorios
 * @param {Object} event
 */
async function selectDesktop (event) {
  event.stopPropagation()
  const deskName = event.target.innerText
  window.location = `http://localhost:3001/templates?escritorio=${deskName}`
}
/**
 * Función para editar el nombre de un escritorio, refact x
 */
async function editDesktop () {
  const nombreOld = document.body.getAttribute('data-desk')
  const nombre = document.getElementById('editdeskName').value
  const body = { nombre, nombreOld }
  const params = {
    url: 'http://localhost:3001/escritorios',
    body,
    method: 'PUT',
    options: {
      contentType: 'application/json'
    }
  }
  const res = await fetchS(params)
  console.log(res)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('editdeskError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const dialog = document.getElementById('editDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    refreshDesktops(res)
    addDesktopEvents()
  }
  document.getElementById('deskTitle').innerText = `${nombre}`
  // TODO mensaje de exito o animar el cambio de nombre
}
/**
 * Función para crear un escritorio, refact x
 */
async function createDesktop () {
  const nombre = document.getElementById('deskName').value
  let orden = document.querySelectorAll('a.deskList')
  orden = orden.length
  orden = orden + 1
  const body = { nombre, orden }
  const params = {
    url: 'http://localhost:3001/escritorios',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)

  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('deskError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    window.location = `http://localhost:3001/templates?escritorio=${nombre}`
  }
}
/**
 * Función para borrar un escritorio, refact x falta probar borrar con links y cols
 */
async function deleteDesktop () {
  const nombre = document.body.getAttribute('data-desk')
  const body = { name: nombre }
  const params = {
    url: 'http://localhost:3001/escritorios',
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('deleteDeskError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    window.location = `http://localhost:3001/templates?escritorio=${res[0].name}`
    const dialog = document.getElementById('deleteDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
  }
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

/**
 * Función para editar una columna refact x
 */
async function editColumn () {
  const nombre = document.getElementById('editcolName').value
  const escritorio = document.body.getAttribute('data-desk')
  const id = document.getElementById('editcolSubmit').getAttribute('sender')
  const body = { nombre, escritorio, id }
  const params = {
    url: 'http://localhost:3001/columnas',
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('editColError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const dialog = document.getElementById('editColForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'

    const $Column = document.querySelector(`[data-db="${id}"]`)
    console.log($Column.parentNode.childNodes[0].childNodes[0].innerText)
    $Column.parentNode.childNodes[0].childNodes[0].innerText = nombre
  }
}
/**
 * Función para crear columna refact x
 */
async function createColumn () {
  const nombre = document.getElementById('colName').value
  const escritorio = document.body.getAttribute('data-desk')
  const $raiz0 = document.getElementById(`${escritorio}Cols`)

  let orden = $raiz0.childNodes.length
  orden = orden + 1
  console.log(orden)

  const body = { nombre, escritorio, orden }
  const params = {
    url: 'http://localhost:3001/columnas',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('addColError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const menuMoverLink = document.getElementById('destCol')
    const itemLista = document.createElement('li')
    itemLista.setAttribute('id', `${nombre}`)
    const text = document.createTextNode(`${nombre}`)
    itemLista.appendChild(text)
    menuMoverLink.appendChild(itemLista)
    // Obtener los elementos del submenu mover link
    const menuMoveLinkItems = document.querySelectorAll('#destCol li')

    // Añadir un event listener a cada uno
    menuMoveLinkItems.forEach(function (item) {
      item.removeEventListener('click', moveLinks)
      item.addEventListener('click', moveLinks)
    })
    refreshColumns(res)
    const dialog = document.getElementById('addColForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
  }
}
/**
 * Función para borrar una columna refact x
 */
async function deleteColumn () {
  const escritorio = document.body.getAttribute('data-desk')
  const elementoId = document.getElementById('confDeletecolSubmit').getAttribute('sender')

  const body = { id: elementoId, escritorio: `${escritorio}` }
  const params = {
    url: 'http://localhost:3001/columnas',
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('deleteColError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const $colBorrar = document.querySelector(`[data-db="${elementoId}"]`)

    $colBorrar.parentNode.remove()

    const dialog = document.getElementById('deleteColForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
  }
}
/**
 * Función para mover una columna entre escritorios refact x
 * @param {} event
 */
async function moveColumns (event) {
  console.log(event.target.id)
  const deskOrigen = document.body.getAttribute('data-desk')
  const deskDestino = event.target.id
  const colId = event.target.parentNode.parentNode.parentNode.childNodes[1].innerText

  console.log(deskOrigen)
  console.log(deskDestino)
  console.log(colId)
  const body = { deskOrigen, deskDestino, colId }
  const params = {
    url: 'http://localhost:3001/moveCols',
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  console.log(res)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('deleteColError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const $raiz = document.querySelector(`[data-db="${colId}"]`)
    $raiz.parentNode.remove()
    console.log($raiz.parentNode)
  }
}
/**
 * Función que crea la columna cuando se crea con createColumn refact x
 * Recibe la columna creada
 * @param {json} json
 */
function refreshColumns (json) {
  console.log(json[0])
  console.log(json[0].name)
  console.log(json[0]._id)

  const nombre = json[0].name
  const id = json[0]._id
  const orden = json[0].order
  console.log(orden)
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

  // Permite detectar duplicados y darles un id distinto incremental, luego cuando se refresque la pag lo implementa en plantilla

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
  $envolt.setAttribute('orden', `${orden}`)
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

/**
 * Función para editar un link refact x
 */
async function editLink () {
  const nombreOld = document.body.getAttribute('data-link')
  const escritorio = document.body.getAttribute('data-desk')
  const columna = document.body.getAttribute('data-panel')
  const nombre = document.querySelector('#editlinkName').value
  const linkURL = document.querySelector('#editlinkURL').value
  const imgURL = `https://www.google.com/s2/favicons?domain=${linkURL}`
  const dbID = document.getElementById('editlinkSubmit').getAttribute('sender')

  const body = { nombreOld, nombre, URL: linkURL, imgURL, escritorio, columna, id: dbID }
  console.log(body)
  const params = {
    url: 'http://localhost:3001/links',
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('editLinkError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const dialog = document.getElementById('editLinkForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    const $raiz = document.querySelector(`[data-db="${dbID}"]`)
    const arr = Array.from($raiz.childNodes)
    console.log(arr)
    const elementoAEditar = arr.find((elemento) => elemento.innerText === nombreOld)
    if (elementoAEditar) {
      elementoAEditar.querySelector('img').src = res.imgURL
      elementoAEditar.querySelector('a').href = res.URL
      elementoAEditar.querySelector('a').childNodes[1].nodeValue = nombre
    }
  }
}
/**
 * Función para crear un link refact x
 */
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

  // Declaramos el body para enviar y lo pasamos a cadena de texto
  const body = { nombre, URL: linkURL, imgURL, escritorio, columna, id: dbID, orden }
  // body = JSON.stringify(body)
  // Enviamos el post con el link
  // TODO Control de errores del fetch
  const params = {
    url: 'http://localhost:3001/links',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)

  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('linkError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    // Cerramos el cuadro de diálogo
    const dialog = document.getElementById('addLinkForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    // La rellenamos con los datos del json
    refreshLinks(res)
  }
}
/**
 * Función para borrar un link refact x
 */
async function deleteLink () {
  const nombre = document.body.getAttribute('data-link')
  const panel = document.body.getAttribute('data-panel')

  const id = document.getElementById('confDeletelinkSubmit').getAttribute('sender')

  const escritorio = document.body.getAttribute('data-desk')
  const body = { nombre, panel, escritorio, id }
  const params = {
    url: 'http://localhost:3001/links',
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('deleteLinkError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const $raiz = document.querySelector(`[data-db="${id}"]`)
    console.log($raiz.childNodes)
    const arr = Array.from($raiz.childNodes)
    console.log(arr)
    const elementoABorrar = arr.find((elemento) => elemento.innerText === nombre)
    if (elementoABorrar) {
      elementoABorrar.remove()
    }

    if (res.length === 0) {
      console.log('Era el último')
      const $div = document.createElement('div')
      $div.setAttribute('class', 'link')
      $raiz.appendChild($div)
    }
    const dialog = document.getElementById('deleteLinkForm')
    const visible = dialog.style.display === 'flex'
    console.log(visible)
    dialog.style.display = visible ? 'none' : 'flex'
  }
}
/**
 * Función para mover un link de una columna a otra en el mismo desktop refact x
 * @param {} event
 */
async function moveLinks (event) {
  // Recogemos el id del panel de origen -> Correcto
  const panelOrigenId = document.body.getAttribute('idpanel')
  // Recogemos el nombre del panel de destino -> Es el de origen, ver si afecta en server
  const panelDestinoNombre = event.target.innerText
  // Declaramos la variable para recoger el id del panel destino -> Correcto
  let panelDestinoId
  // Declaramos la variable para recoger la cantidad de hijos que quedan -> Dice la cantidad que hay en el de destino sin contar el nuevo
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
  console.log('Elementos en el panel Viejo')
  console.log(panelOldChildCount)
  // Recogemos el nombre del link movido
  const linkName = event.target.parentNode.parentNode.parentNode.childNodes[2].innerText
  // Declaramos el body
  let body = { panelOrigenId, panelDestinoId, panelDestinoNombre, name: linkName, orden: panelOldChildCount + 1 }
  console.log('Body')
  console.log(body)
  const params = {
    url: 'http://localhost:3001/moveLinks',
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  console.log('Resultado del servidor')
  console.log(res)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    const $error = document.getElementById('moveError') // Crear
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    // Recogemos los links para detectar el movido y eliminarlo
    const links = document.querySelectorAll('div.link')
    if (links) {
      links.forEach(element => {
      // problema con duplicados, meter id de base de datos como id de elemento
        if (element.id === res._id) {
          console.log('Hay coincidencia con el enviado del servidor')
          console.log(element.id)
          console.log(res._id)
          // Hacer algo con el elemento encontrado
          element.remove()
        }
      })
    }
  }

  /* --- */
  const elements = document.querySelectorAll(`[data-db="${panelDestinoId}"]`)[0].childNodes
  console.log('Elementos en panel de destino')
  console.log(elements)
  const id = elements[0].parentNode.getAttribute('data-db')
  // console.log(id)
  const sortedElements = Array.from(elements).sort((a, b) => {
    return a.dataset.orden - b.dataset.orden
  })
  console.log('Sorted elements')
  console.log(sortedElements)
  const names = []
  sortedElements.forEach(element => {
    names.push(element.innerText)
  })
  console.log('nombres')
  console.log(names)
  body = names
  const params2 = {
    url: 'http://localhost:3001/draglink?idColumna=',
    method: 'PUT',
    options: {
      contentType: 'application/json',
      query: id
    },
    body
  }
  // La url /draglink ejecuta una función que actualiza el orden del link en la columna
  const res2 = await fetchS(params2)
  console.log('Segundo res del servidor')
  console.log(res2)
  const firstKey2 = Object.keys(res2)[0]
  const firstValue2 = res2[firstKey2]

  if (firstKey2 === 'error') {
    const $error = document.getElementById('linkError') // Crear
    $error.innerText = `${firstKey2}, ${firstValue2}`
  } else {
    const testDummy = document.querySelectorAll(`[data-db="${panelOrigenId}"]`)[0].childNodes.length
    if (testDummy === 0) {
      // Meter el dummy
      const dummy = document.createElement('div')
      dummy.setAttribute('class', 'link')
      document.querySelectorAll(`[data-db="${panelOrigenId}"]`)[0].appendChild(dummy)
    }
    console.log('test dummy')
    console.log(testDummy)
    refreshLinks(res)
  }
}
/**
 * Función para pegar links en columna (Pegado múltiple?) refact x
 * @param {*} event
 */
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
                  async function procesarEnlace () {
                    const nombre = await getNameByUrl(text)
                    const escritorio = document.body.getAttribute('data-desk')
                    const columna = document.body.getAttribute('data-panel')
                    let orden = $raiz.childNodes.length
                    orden = orden + 1
                    console.log(orden)
                    const json = {
                      id: raiz,
                      nombre,
                      URL: url,
                      imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                      orden,
                      escritorio,
                      columna
                    }
                    const params = {
                      url: 'http://localhost:3001/links',
                      method: 'POST',
                      options: {
                        contentType: 'application/json'
                      },
                      body: json
                    }
                    // TODO Gestion errores
                    const res = await fetchS(params)
                    console.log(res)
                    refreshLinks(res)
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
                  async function procesarEnlace () {
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
                    const json = {
                      id: raiz,
                      nombre,
                      URL: url,
                      imgURL: `https://www.google.com/s2/favicons?domain=${url}`,
                      orden,
                      escritorio,
                      columna
                    }
                    const params = {
                      url: 'http://localhost:3001/links',
                      method: 'POST',
                      options: {
                        contentType: 'application/json'
                      },
                      body: json
                    }
                    // createLinkApi(json)
                    const res = await fetchS(params)
                    console.log(res)
                    // console.log(raiz.lastChild.innerText)
                    refreshLinks(res)
                  }
                  procesarEnlace()
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
/**
 * Función para scrapear el titulo de una pag desde el server
 * @param {*} url
 * @returns
 */
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
/**
 * Función para crear un link y pintarlo de inmediato
 * @param {*} json
 */
function refreshLinks (json) {
  console.log(json.name)

  // Por cada elemento construimos un link y lo insertamos en su raiz
  const $raiz = document.querySelector(`[data-db="${json.idpanel}"]`)

  const $div = document.createElement('div')
  $div.setAttribute('class', 'link')
  $div.setAttribute('orden', `${json.orden}`)
  $div.setAttribute('id', `${json._id}`)
  const $img = document.createElement('img')
  $img.setAttribute('src', `${json.imgURL}`)
  const $link = document.createElement('a')
  $link.setAttribute('href', `${json.URL}`)
  $link.setAttribute('target', '_blank')
  const $textos = document.createTextNode(`${json.name}`)
  const $lcontrols = document.createElement('div')
  $lcontrols.setAttribute('class', 'lcontrols')
  const $editControl = document.createElement('span')
  $editControl.setAttribute('class', 'icofont-ui-edit showPanel')

  $lcontrols.appendChild($editControl)
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
  document.querySelectorAll('.showPanel').forEach(item => {
    item.removeEventListener('click', togglePanel)
    item.addEventListener('click', togglePanel)
  })
}

// funciones auxiliares para mostrar/ocultar cuadros de diálogo

function toggleDialogColumn () {
  const dialog = document.getElementById('addColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditColumn (event) {
  const panelID = event.target.parentNode.childNodes[1].innerText
  console.log(panelID)
  const boton = document.getElementById('editcolSubmit')
  boton.setAttribute('sender', `${panelID}`)
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
function escondeDeleteDialog () {
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  console.log(visible)
  dialog.style.display = visible ? 'none' : 'flex'
}
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
function ordenaDesks () {
  // eslint-disable-next-line no-undef
  Sortable.create(drpEscritorios, {
    onEnd: async function (evt) {
      console.log('Lo has movido')
      // Simplemente enviar el orden actual y hacer una función que ordene en el back, pasar los nombres en el orden actual
      const elements = Array.from(document.querySelectorAll('a.deskList'))
      console.log(elements)
      const names = []
      elements.forEach(element => {
        names.push(element.innerText)
      })
      console.log(names)
      let body = names
      body = JSON.stringify({ body })
      const res = await fetch('http://localhost:3001/ordenaDesks', {
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
        // console.log(elemento.parentNode.parentNode.dataset.db)
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
