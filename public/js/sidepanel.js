import { formatDate, sendMessage, checkUrlMatch } from './functions.mjs'
document.addEventListener('DOMContentLoaded', sidePanel)

function sidePanel () {
  // console.log('Hay sidepanel')
  addPanelEvents()
  const element = document.querySelectorAll('div.link')[0]
  if (element && element !== null) {
    element.classList.add('navActive')
    showLinkInfo(element)
  }
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
  if (!document.body.classList.contains('edit')) {
    const panelCloser = document.getElementById('sideClose')
    panelCloser.removeEventListener('click', closePanel)
    panelCloser.addEventListener('click', closePanel)
  }

  const nextLink = document.getElementById('next')
  nextLink.removeEventListener('click', navLinkInfos)
  nextLink.addEventListener('click', navLinkInfos)
  const prevLink = document.getElementById('prev')
  prevLink.removeEventListener('click', navLinkInfos)
  prevLink.addEventListener('click', navLinkInfos)
  if (document.body.classList.contains('edit')) {
    const links = document.querySelectorAll('div.link')
    links.forEach(link => {
      link.removeEventListener('click', navLinkInfos)
      link.addEventListener('click', navLinkInfos)
    })
  }
}
function closePanel () {
  const panel = document.getElementById('sidepanel')
  // Tiene sentido la comprobación?
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'grid'
    console.log('entro')
  } else {
    panel.style.display = 'none'
    const imagePanel = document.getElementById('linkImages')
    imagePanel.innerHTML = ''
    document.body.style.overflow = 'initial'
    console.log('entro')
  }
}
export function togglePanel (event) {
  console.log(event.target.parentNode.parentNode)
  const element = event.target.parentNode.parentNode
  const panel = document.getElementById('sidepanel')
  // const controls = document.querySelectorAll('.showPanel')
  // const panelCloser = document.getElementById('sideClose')
  // const handleClickOutside = (event) => {
  //   console.log(event.target)
  //   if (!panel.contains(event.target) && !Array.from(controls).includes(event.target)) {
  //     panel.style.display = 'none'
  //     const imagePanel = document.getElementById('linkImages')
  //     imagePanel.innerHTML = ''
  //     console.log('entro')
  //   }
  // }
  console.log('Has hecho click')
  // Esta comprobación tiene sentido?
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'grid'
    document.body.style.overflow = 'hidden'
    console.log('entro')
  } else {
    panel.style.display = 'none'
    console.log('entro')
  }
  // document.removeEventListener('click', handleClickOutside)
  // document.addEventListener('click', handleClickOutside)
  // panelCloser.removeEventListener('click', handleClickOutside)
  // panelCloser.addEventListener('click', handleClickOutside)
  showLinkInfo(element)
}
export function navLinkInfos (event) {
  console.log(event.target)
  event.preventDefault()
  const idHolder = document.getElementById('linkId')
  const links = document.querySelectorAll('div.link')
  const linksIds = []
  links.forEach(item => {
    linksIds.push(item.id)
  })
  const panels = document.querySelectorAll('.tablinks')
  const panelsNames = []
  panels.forEach(panel => {
    panelsNames.push(panel.innerText)
  })
  const imagePanel = document.getElementById('linkImages')
  let actualPos = linksIds.indexOf(idHolder.innerText)
  if (event.target.nodeName === 'A') {
    console.log('Es enlace')
    const element = event.target.parentNode
    links.forEach(link => {
      if (link.classList.contains('navActive')) {
        link.classList.remove('navActive')
      }
    })
    element.classList.add('navActive')
    imagePanel.innerHTML = ''
    showLinkInfo(element)
  }
  if (event.target.id === 'prev') {
    actualPos = actualPos - 1
    if (actualPos >= 0) {
      const element = document.getElementById(linksIds[actualPos])
      if (element.nextElementSibling) {
        element.nextElementSibling.classList.remove('navActive')
      }
      element.classList.add('navActive')
      imagePanel.innerHTML = ''
      showLinkInfo(element)

      const panel = element.parentNode.id
      // console.log(panel)
      const buttons = document.querySelectorAll('button.tablinks')
      for (const button of buttons) {
        if (button.id === panel) {
          button.click()
          break // Rompe el bucle una vez que se encuentra el botón deseado
        }
      }
    }
  }
  if (event.target.id === 'next') {
    actualPos = actualPos + 1
    if (actualPos <= linksIds.length) {
      const element = document.getElementById(linksIds[actualPos])
      if (element.previousElementSibling) {
        element.previousElementSibling.classList.remove('navActive')
      }
      element.classList.add('navActive')
      imagePanel.innerHTML = ''
      showLinkInfo(element)

      const panel = element.parentNode.id
      // console.log(panel)
      const buttons = document.querySelectorAll('button.tablinks')
      for (const button of buttons) {
        if (button.id === panel) {
          button.click()
          break // Rompe el bucle una vez que se encuentra el botón deseado
        }
      }
    }
  }
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
  let panel
  if (!document.body.classList.contains('edit')) {
    panel = element.parentNode.parentNode.childNodes[0].innerText
  } else {
    // hay que pasarle el activo
    const desk = document.body.getAttribute('data-desk')
    panel = element.parentNode.id
    const index = panel.indexOf(desk)
    if (index !== -1) {
      panel = panel.slice(0, index) + panel.slice(index).replace(desk, '')
    }
  }
  const dateHolder = document.getElementById('ladded')
  const urlHolder = document.getElementById('lurl')
  const url = element.childNodes[0].href
  // Aquí podemos recoger si es un link de video o no
  const res = await fetch(`http://localhost:3001/link?id=${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  const json = await res.json()
  // console.log(json)
  // console.log(json.data[0].notes)
  const notas = json.data[0].notes
  const notesDiv = document.getElementById('linkNotes')
  if (notas === undefined || notas === '') {
    // console.log('No hay notas')
    notesDiv.innerText = 'Escribe aquí ...'
  } else {
    notesDiv.innerHTML = notas
  }
  // eslint-disable-next-line no-unused-vars
  const activeHolder = document.getElementById('lactive')
  // eslint-disable-next-line no-unused-vars
  const dateaddHolder = document.getElementById('ladded')
  // eslint-disable-next-line no-unused-vars
  const imagesHolder = document.getElementById('linkImages')
  // console.log(json.data[0].images)
  const images = json.data[0].images
  if (images === undefined || images.length === 0) {
    // console.log('No hay imagenes')
    imagesHolder.style.backgroundImage = "url('../img/placeholderImg.svg')"
    imagesHolder.innerHTML = '<iframe id="videoFrame" src="" frameborder="0" width="560" height="340" scrolling="no" allowfullscreen></iframe>'
  } else {
    imagesHolder.style.backgroundImage = "url('')"
    imagesHolder.innerHTML = '<iframe id="videoFrame" src="" frameborder="0" width="560" height="340" scrolling="no" allowfullscreen></iframe>'
    images.forEach(img => {
      const image = document.createElement('img')
      image.setAttribute('src', img)
      const anchor = document.createElement('a')
      const closer = document.createElement('i')
      closer.setAttribute('class', 'icofont-close-line')
      anchor.appendChild(image)
      anchor.appendChild(closer)
      imagesHolder.appendChild(anchor)
    })
    document.querySelectorAll('.icofont-close-line').forEach(item => {
      item.addEventListener('click', deleteImage)
    })
    document.querySelectorAll('#linkImages a').forEach(item => {
      item.addEventListener('click', openModal)
    })
  }
  // const baseUrl = url.split('/').slice(0, 3).join('/') + '/'
  // console.log(url)
  const videoFrame = document.getElementById('videoFrame')
  const matchedUrl = checkUrlMatch(url)
  if (matchedUrl) {
    // console.log(matchedUrl)
    // console.log('Es un video')
    imagesHolder.style.backgroundImage = "url('')"
    videoFrame.style.display = 'block'
    videoFrame.setAttribute('src', matchedUrl)
  } else {
    // console.log('No se encontró ninguna coincidencia de URL.')
    videoFrame.style.display = 'none'
  }

  idHolder.innerText = id
  imageHolder.src = imgUrl
  // sideHeadImg.src = imgUrl
  nameHolder.innerText = name
  // sideHeadP.innerText = name
  panelHolder.innerText = panel
  // const enlace = document.createElement('a')
  // const texto = document.createTextNode(url)
  urlHolder.href = url
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
            const anchor = document.createElement('a')
            const closer = document.createElement('i')
            closer.setAttribute('class', 'icofont-close-line')
            const $img = document.createElement('img')
            $img.setAttribute('src', imageUrl)
            anchor.appendChild($img)
            anchor.appendChild(closer)
            // Establecer la URL de datos como el src de la imagen
            document.getElementById('linkImages').style.backgroundImage = 'none'
            document.getElementById('linkImages').appendChild(anchor)
            closer.addEventListener('click', deleteImage)
            fetchImage()
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
  console.log(file)
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

async function fetchImage () {
  const imagesContainer = document.getElementById('linkImages')
  const imagesCount = imagesContainer.childNodes.length
  console.log(imagesCount)
  const imageToUpload = imagesContainer.childNodes[imagesCount - 1].childNodes[0].src
  console.log(imageToUpload)
  const id = document.getElementById('linkId').innerText

  if (imagesCount === 0) {
    console.log('No hay imágenes para subir.')
    return
  }
  const formData = new FormData()

  const src = imageToUpload

  try {
    const response = await fetch(src)
    console.log(response)
    const blob = await response.blob()
    // eslint-disable-next-line no-undef
    const file = new File([blob], 'image', { type: blob.type })
    formData.append('images', file, 'image.png')
    formData.append('linkId', id)
    const res = await fetch('http://localhost:3001/uploadImg', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const result = await res.json()
      console.log(result)
      console.log('Imágenes subidas correctamente al servidor.')
      sendMessage(true, 'Imagen guardada.')
    } else {
      console.error('Error al subir las imágenes al servidor.')
      sendMessage(false, 'Error al guardar imagen')
    }
    console.log(formData)
  } catch (error) {
    console.error('Error al obtener la imagen:', error)
    sendMessage(false, 'Error en la comunicación con servidor')
  }
}
async function deleteImage (event) {
  console.log(event.target.parentNode)
  const anchor = event.target.parentNode
  const imageToDelete = event.target.parentNode.childNodes[0].src
  const id = document.getElementById('linkId').innerText

  try {
    let body = {
      image: imageToDelete,
      id
    }
    body = JSON.stringify(body)
    const res = await fetch('http://localhost:3001/deleteImg', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body
    })
    if (res.ok) {
      const result = await res.json()
      console.log(result)
      console.log('Imágen borrada correctamente.')
      anchor.remove()
      if (document.getElementById('linkImages').children.length === 0) {
        document.getElementById('linkImages').style.backgroundImage = "url('../img/placeholderImg.svg')"
      }
      sendMessage(true, 'Imagen borrada correctamente')
    } else {
      console.error('Error al subir las imágenes al servidor.')
      sendMessage(false, 'Error al borrar imagen')
    }
  } catch (error) {
    console.error('Error al borrar la imagen:', error)
    sendMessage(false, 'Error en la comunicación con el servidor')
  }
}
function openModal (event) {
  console.log(event.target)
  const closers = Array.from(document.querySelectorAll('.icofont-close-line'))

  if (closers.includes(event.target)) {
    return false
  } else {
    const modal = document.getElementById('myModal')
    const img = event.target // event.target
    const modalImg = document.getElementById('img01')

    modal.style.display = 'block'
    modalImg.src = img.src

    const span = document.getElementsByClassName('close')[0]
    span.addEventListener('click', () => {
      modal.style.display = 'none'
    })
  }
}
