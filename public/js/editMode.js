import { openTab } from './functions.mjs'

document.addEventListener('DOMContentLoaded', editMode)

function editMode () {
  console.log('Hay JS de edit mode')
  const columnas = document.querySelectorAll('.tablinks')
  columnas.forEach(col => {
    col.removeEventListener('click', openTab)
    col.addEventListener('click', openTab)
  })
  const desk = document.getElementById('deskTitle').innerText
  document.body.setAttribute('data-desk', `${desk}`)
  const $raiz = document.querySelector('.tab')
  const hijos = $raiz.childNodes
  // console.log(hijos)
  hijos.forEach(element => {
    // console.log(element)
    ordenaItemsEdit(element.innerText)
  })
  ordenaColsEdit($raiz)
  // Get the element with id="defaultOpen" and click on it
  if (columnas.length > 0) {
    document.querySelector('.defaultOpen').click()
  }
  const enlaces = document.querySelectorAll('.icofont-external')
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', (event) => {
      console.log(event.target.parentNode.parentNode.childNodes[0].href)
      const link = event.target.parentNode.parentNode.childNodes[0].href
      window.open(link, '_blank')
    })
  })
  const closeIcon = document.querySelector('.icofont-close')
  closeIcon.classList = 'icofont-expand'
  const expandIcon = document.querySelector('.icofont-expand')
  expandIcon.removeEventListener('click', expandPanel)
  expandIcon.addEventListener('click', expandPanel)
  const skeleton = document.querySelector('.skeleton-loader')
  skeleton.style.opacity = '0'
  skeleton.style.display = 'none'
  const content = document.querySelector('.cuerpoInt')
  content.style.display = 'flex'
  content.style.opacity = '1'
}

function ordenaColsEdit ($raiz) {
  // eslint-disable-next-line no-undef
  Sortable.create($raiz, {

    group: 'ColumnasEdit',
    onEnd: async function (evt) {
      // const itemEl = evt.item
      // console.log(itemEl)
      const escritorio = document.body.getAttribute('data-desk')
      const elements = document.querySelector('.tab').childNodes
      // console.log(elements)

      const sortedElements = Array.from(elements).sort((a, b) => {
        return a.dataset.orden - b.dataset.orden
      })
      // console.log(sortedElements)
      const names = []
      sortedElements.forEach(element => {
        names.push(element.dataset.db)
      })
      // console.log(names)
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
}
function ordenaItemsEdit (panel) {
  if (panel !== null) {
    const escritorioActual = document.body.getAttribute('data-desk')
    // console.log(escritorioActual)
    const el = []
    // console.log(`${escritorioActual}${panel}`)
    el.push(document.getElementById(`edit${escritorioActual}${panel}`).childNodes[0])
    // console.log(el)
    el.forEach(element => {
      const grupo = `Shared${escritorioActual}`
      // eslint-disable-next-line no-undef, no-unused-vars
      const sortableList = Sortable.create(element, {
        group: grupo,
        options: {
          sort: false,
          dataIdAttr: 'data-id'
        },
        onEnd: async function (evt) {
          let newId = evt.to
          newId = newId.attributes[2].nodeValue
          const elements = document.querySelectorAll(`[data-db="${newId}"]`)[0].childNodes
          // console.log(elements)
          let id = elements[0].parentNode.getAttribute('data-db')
          id = newId.replace(/edit/g, '')
          // console.log(id)
          const sortedElements = Array.from(elements).sort((a, b) => {
            return a.dataset.orden - b.dataset.orden
          })
          // console.log(sortedElements)
          const names = []
          sortedElements.forEach(element => {
            names.push(element.innerText)
          })
          // console.log(names)
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
      })
    })
  }
}
function expandPanel () {
  const panel = document.querySelector('#sidepanel')
  if (panel.style.width === '100%' || panel.style.width === undefined) {
    panel.style.width = '40%'
    setTimeout(function () {
      panel.style.position = 'initial'
    }, 500)
  } else {
    panel.style.width = '100%'
    panel.style.position = 'fixed'
  }
}
