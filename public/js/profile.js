import { darHora } from './functions.mjs'
document.addEventListener('DOMContentLoaded', cargaProfile)
function cargaProfile () {
  console.log('Hay JS')
  darHora()
  const clsAccButton = document.getElementById('closeAccount')
  clsAccButton.addEventListener('click', openConfirm)

  // Agregar evento de clic al botón de ir a perfil
  document.querySelector('#profile').removeEventListener('click', profile)
  document.querySelector('#profile').addEventListener('click', profile)
  // Agregar evento de clic al botón de cerrar sesión
  document.querySelector('#logout').removeEventListener('click', logOut)
  document.querySelector('#logout').addEventListener('click', logOut)
  // Agregar evento click a cada elemento de la lista de de selección escritorios
  document.querySelectorAll('.deskList').forEach(item => {
    item.removeEventListener('click', selectDesktop)
    item.addEventListener('click', selectDesktop)
  })
  // Agregar evento de clic al botón de crear backup
  document.querySelector('#backup').removeEventListener('click', createBackup)
  document.querySelector('#backup').addEventListener('click', createBackup)
  // Agregar evento de clic al botón de descargar backup
  document.querySelector('#download').removeEventListener('click', downloadBackup)
  document.querySelector('#download').addEventListener('click', downloadBackup)
  // Agregar evento de change al botón de subir archivo
  document.querySelector('#upFile').removeEventListener('change', uploadFile)
  document.querySelector('#upFile').addEventListener('change', uploadFile)
  // Agregar evento de change al botón de subir archivo
  document.querySelector('#image-input').removeEventListener('change', uploadImg)
  document.querySelector('#image-input').addEventListener('change', uploadImg)

  document.querySelector('#defaultOpen').addEventListener('click', openSection)
  document.querySelector('#profileSeg').addEventListener('click', openSection)
  document.querySelector('#profilePreferences').addEventListener('click', openSection)

  // Get the element with id="defaultOpen" and click on it
  document.getElementById('defaultOpen').click()
}
function profile () {
  window.location = 'http://localhost:3001/templates'
}
function logOut () {
  console.log('Cierra sesión')
  document.cookie = 'token='
  window.location = 'http://localhost:3001'
}
async function selectDesktop (event) {
  event.stopPropagation()
  const deskName = event.target.innerText
  window.location = `http://localhost:3001/templates?escritorio=${deskName}`
}
function openConfirm () {
  const $confirmForm = document.getElementById('profileDeleteConfirm')
  $confirmForm.style.display = 'flex'
  const $cancelButton = document.getElementById('cancel')
  $cancelButton.addEventListener('click', () => {
    $confirmForm.style.display = 'none'
  })
  const $confirmButton = document.getElementById('confirm')
  $confirmButton.addEventListener('click', () => {
    deleteAccount()
  })
}
async function deleteAccount () {
  console.log('Cuenta cerrada')
  // llamar a eliminaUsuario de auth.js
  const res = await fetch('http://localhost:3001/deleteUser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json()
  document.cookie = 'token='
  document.cookie = 'user='
  // Primero ventanita, confirmar y redirigir
  window.location = 'http://localhost:3001'
  console.log(json)
}
async function createBackup () {
  try {
    const res = await fetch('http://localhost:3001/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    console.log(json)
    const successP = document.getElementById('successMessage')
    successP.innerText = json.mensaje
  } catch (error) {
    console.log(error)
    const errorP = document.getElementById('errorMessage')
    errorP.innerText = error
  }
}
async function downloadBackup () {
  try {
    const res = await fetch('http://localhost:3001/downloadBackup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error('Error al descargar la copia de seguridad')
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dataBackup.json'
    a.click()
    URL.revokeObjectURL(url)

    const successP = document.getElementById('successMessage')
    successP.innerText = 'Copia de seguridad descargada correctamente.'
  } catch (error) {
    console.error(error)
    const errorP = document.getElementById('errorMessage')
    errorP.innerText = 'Error al descargar la copia de seguridad.'
  }
}
async function uploadFile (event) {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('backupFile', file)

  try {
    // Enviar el archivo al servidor utilizando una solicitud POST
    const response = await fetch('http://localhost:3001/uploadBackup', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log(result)
      const successP = document.getElementById('successUpMessage')
      successP.innerText = result.mensaje
      // Realizar cualquier acción adicional después de subir el archivo correctamente
    } else {
      throw new Error('Error al subir el archivo')
    }
  } catch (error) {
    console.error(error)
    // Manejar el error de subida del archivo
    const errorP = document.getElementById('errorUpMessage')
    errorP.innerText = error
  }
}
async function uploadImg () {
  const previewImage = document.getElementById('preview-image')
  const imageInput = document.getElementById('image-input')

  const file = imageInput.files[0]

  if (file) {
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    const formData = new FormData()
    formData.append('profileImage', file)
    try {
      const response = await fetch('http://localhost:3001/uploadImgProfile', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
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
function openSection (event) {
  let i
  console.log(event.target.id)
  console.log()
  let section = ''
  const tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none'
  }
  const tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '')
  }
  if (event.target.id === 'defaultOpen') {
    section = 'info'
  }
  if (event.target.id === 'profileSeg') {
    section = 'security'
  }
  if (event.target.id === 'profilePreferences') {
    section = 'preferences'
  }
  document.getElementById(section).style.display = 'flex'
  event.currentTarget.className += ' active'
}
