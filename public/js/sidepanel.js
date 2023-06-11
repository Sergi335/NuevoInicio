import { formatDate } from './functions.mjs'
document.addEventListener('DOMContentLoaded', sidePanel)

function sidePanel () {
  // console.log('Hay sidepanel')
  addPanelEvents()
}
function addPanelEvents () {
  document.querySelectorAll('.showPanel').forEach(item => {
    item.removeEventListener('click', togglePanel)
    item.addEventListener('click', togglePanel)
  })
  document.getElementById('linkNotes').removeEventListener('click', handleNotes)
  document.getElementById('linkNotes').addEventListener('click', handleNotes)
  document.getElementById('sendNotes').removeEventListener('click', sendNotes)
  document.getElementById('sendNotes').addEventListener('click', sendNotes)
  document.getElementById('pasteImg').removeEventListener('click', pasteImg)
  document.getElementById('pasteImg').addEventListener('click', pasteImg)
  document.getElementById('linkNotes').addEventListener('paste', function (event) {
    // event.preventDefault() // Evita la acción de pegar predeterminada del navegador

    const clipboardData = event.clipboardData || window.Clipboard
    const pastedText = clipboardData.getData('text/html')
    console.log(pastedText)
  })
  document.querySelector('.icofont-code-alt').classList.add('textContActive')
  document.querySelector('.icofont-code-alt').addEventListener('click', function textFormat () {
    console.log('Pasamos a texto html')
    if (document.querySelector('.icofont-font').classList.contains('textContActive')) {
      document.querySelector('.icofont-font').classList.remove('textContActive')
      document.querySelector('.icofont-code-alt').classList.add('textContActive')
    }
  })
  document.querySelector('.icofont-font').addEventListener('click', function textFormat () {
    console.log('Pasamos a texto plano')
    if (document.querySelector('.icofont-code-alt').classList.contains('textContActive')) {
      document.querySelector('.icofont-code-alt').classList.remove('textContActive')
      document.querySelector('.icofont-font').classList.add('textContActive')
    }
  })
  document.querySelector('.icofont-delete-alt').addEventListener('click', function textFormat () {
    console.log('Borramos texto')
    const notesDiv = document.getElementById('linkNotes')
    notesDiv.innerHTML = ''
  })
  document.querySelector('.icofont-delete-alt').addEventListener('mousedown', function () {
    document.querySelector('.icofont-delete-alt').classList.add('textContActive')
  })
  document.querySelector('.icofont-delete-alt').addEventListener('mouseup', function () {
    document.querySelector('.icofont-delete-alt').classList.remove('textContActive')
  })
  document.querySelector('#limage').addEventListener('click', function () {
    if (document.querySelector('#imgOptions').classList.contains('slide-in-left')) {
      document.querySelector('#imgOptions').classList.remove('slide-in-left')
    } else {
      document.querySelector('#imgOptions').classList.add('slide-in-left')
    }
  })
  document.querySelectorAll('#imgOptions img').forEach(item => {
    item.addEventListener('click', changeLinkImg)
  })
  document.querySelector('#upLinkImg').addEventListener('change', changeLinkImg)
  document.querySelector('#saveLinkImage').removeEventListener('click', fetchLinkImage)
  document.querySelector('#saveLinkImage').addEventListener('click', fetchLinkImage)
}
export function togglePanel (event) {
  console.log(event.target.parentNode.parentNode)
  const element = event.target.parentNode.parentNode
  const panel = document.getElementById('sidepanel')
  const controls = document.querySelectorAll('.showPanel')
  const handleClickOutside = (event) => {
    if (!panel.contains(event.target) && !Array.from(controls).includes(event.target)) {
      panel.style.display = 'none'
      console.log('entro')
    }
  }
  console.log('Has hecho click')
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'grid'
    console.log('entro')
  } else {
    panel.style.display = 'none'
    console.log('entro')
  }
  document.addEventListener('click', handleClickOutside)
  showLinkInfo(element)
}
async function showLinkInfo (element) {
  // const sideHeadP = document.getElementById('sideHeadP')
  // const sideHeadImg = document.getElementById('sideHeadImg')
  const idHolder = document.getElementById('linkId')
  const id = element.id
  const imageHolder = document.getElementById('limage')
  const imgUrl = element.childNodes[0].childNodes[0].src
  const nameHolder = document.getElementById('lname')
  const name = element.innerText
  const panelHolder = document.getElementById('lpanel')
  const panel = element.parentNode.parentNode.childNodes[0].innerText
  const dateHolder = document.getElementById('ladded')
  const urlHolder = document.getElementById('lurl')
  const url = element.childNodes[0].href
  const res = await fetch(`http://localhost:3001/link?id=${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  const json = await res.json()
  console.log(json)
  console.log(json.data[0].notes)
  const notas = json.data[0].notes
  const notesDiv = document.getElementById('linkNotes')
  if (notas === undefined || notas === '') {
    console.log('No hay notas')
    notesDiv.innerText = 'Escribe aquí ...'
  } else {
    notesDiv.innerHTML = notas
  }
  // eslint-disable-next-line no-unused-vars
  const activeHolder = document.getElementById('lactive')
  // eslint-disable-next-line no-unused-vars
  const dateaddHolder = document.getElementById('ladded')

  idHolder.innerText = id
  imageHolder.src = imgUrl
  // sideHeadImg.src = imgUrl
  nameHolder.innerText = name
  // sideHeadP.innerText = name
  panelHolder.innerText = panel
  urlHolder.innerText = url
  dateHolder.innerText = formatDate(json.data[0].createdAt)
}

async function handleNotes (event) {
  // El Id del link seleccionado
  // const id = event.target.parentNode.childNodes[1].innerText
  // const storeNotes = []
  // let cont = 0
  const notesDiv = document.getElementById('linkNotes')
  if (notesDiv.innerText === 'Escribe aquí ...') {
    notesDiv.innerText = ''
  }
  // storeNotes[cont] = { id, text: notesDiv.innerText }
  // console.log(storeNotes)
  // cont++
}
async function sendNotes (event) {
  const id = document.getElementById('linkId').innerText
  console.log(event.target.parentNode.childNodes)
  console.log(id)
  const notesDiv = document.getElementById('linkNotes')
  const notes = notesDiv.innerHTML
  let body = { id, notes }
  body = JSON.stringify(body)
  console.log(body)
  const res = await fetch('http://localhost:3001/linkNotes', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  console.log(json)
}
function pasteImg () {
  navigator.clipboard.read().then((clipboardItems) => {
    for (const clipboardItem of clipboardItems) {
      console.log(clipboardItems)
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          // es una imagen
          clipboardItem.getType(type).then((blob) => {
            console.log('Imagen:', blob)
            const imageUrl = URL.createObjectURL(blob)
            const $img = document.createElement('img')
            $img.setAttribute('src', imageUrl)
            // Establecer la URL de datos como el src de la imagen
            document.getElementById('linkImages').appendChild($img)
          })
        }
      }
    }
  })
}
async function changeLinkImg (event) {
  console.log(event.target)
  const previewImage = document.getElementById('limage')
  // const imageH = document.getElementById('sideHeadImg')
  const imageInput = document.getElementById('upLinkImg')
  const file = imageInput.files[0]
  if (file) {
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    // imageH.src = imageUrl
  }

  if (event.target.id === 'option1') {
    console.log('Subimos imagen1')
    previewImage.src = 'img/opcion1.svg'
    // imageH.src = 'img/opcion1.svg'
  }
  if (event.target.id === 'option2') {
    console.log('Subimos imagen2')
    previewImage.src = 'img/opcion2.png'
    // imageH.src = 'img/opcion2.png'
  }
  if (event.target.id === 'option3') {
    console.log('Subimos imagen3')
    previewImage.src = 'img/opcion3.png'
    // imageH.src = 'img/opcion3.png'
  }
}
async function fetchLinkImage () {
  const image = document.getElementById('limage')
  const src = image.src
  const linkId = document.getElementById('linkId').innerText
  console.log(linkId)
  console.log(`Subimos la imagen ${src}`)
  console.log(src.indexOf('img'))
  if (src.indexOf('img') === -1) {
    // const file = src
    const imageInput = document.getElementById('upLinkImg')
    const file = imageInput.files[0]
    const formData = new FormData()
    formData.append('linkImg', file)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch('http://localhost:3001/uploadLinkImg', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const link = document.getElementById(linkId)
        link.childNodes[0].childNodes[0].src = src
        console.log(result)
        console.log('Ruta de imagen actualizada correctamente')
      } else {
        console.error('Error al actualizar la ruta de la imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
    }
  } else {
    const formData = new FormData()
    formData.append('filePath', src)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch('http://localhost:3001/uploadLinkImg', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const link = document.getElementById(linkId)
        link.childNodes[0].childNodes[0].src = src
        console.log(result)
        console.log('Ruta de imagen actualizada correctamente')
      } else {
        console.error('Error al actualizar la ruta de la imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
    }
  }
}
