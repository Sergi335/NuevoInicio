document.addEventListener('DOMContentLoaded', cargaProfile)
function cargaProfile () {
  console.log('Hay JS')
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
