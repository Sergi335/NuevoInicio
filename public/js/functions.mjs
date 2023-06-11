function hora () {
  const fecha = new Date()
  const hora = fecha.getHours()
  const min = fecha.getMinutes()
  const posicion = document.getElementById('reloj')

  if (hora < 10 && min < 10) {
    posicion.innerHTML = '0' + hora + ':' + '0' + min
  } else if (min < 10 && hora >= 10) {
    posicion.innerHTML = hora + ':' + '0' + min
  } else if (hora < 10 && min >= 10) {
    posicion.innerHTML = '0' + hora + ':' + min
  } else {
    posicion.innerHTML = hora + ':' + min
  }
}

export function darHora () {
  hora()
  setInterval(hora, 60000)
}

export async function fetchS (params) {
  let { url, method, options } = params
  let { body } = params
  if (options.query !== undefined) {
    console.log(`${url}${options.query}`)
    url = `${url}${options.query}`
    body = { body }
  }
  body = JSON.stringify(body)
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'content-type': options.contentType
      },
      body
    })
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status)
    }
    const data = await response.json()
    // console.log(data)
    return data
  } catch (error) {
    // Manejar el error
    console.error('Error en la solicitud:', error)
    return ('Error en la solicitud:', error)
  }
}
export function formatDate (date) {
  const fecha = new Date(date)

  const opcionesFecha = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const opcionesHora = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora)

  const resultado = fechaFormateada + ' ' + horaFormateada
  console.log(resultado)
  return resultado
}
