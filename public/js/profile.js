window.onload = function () {
  console.log('Hay JS')
  const clsAccButton = document.getElementById('closeAccount')
  clsAccButton.addEventListener('click', deleteAccount)
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
}
