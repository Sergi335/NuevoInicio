
window.onload = function () {
    const btnStart = document.getElementById('btnStart');

    btnStart.addEventListener('click', () => {
        console.log('Has hecho click');
        const logBlock = document.querySelector('#loginForm form');
        const regBlock = document.querySelector('#registerForm form');
        let visible = logBlock.style.display === 'flex';

        logBlock.style.display = visible ? 'none' : 'flex';

        if (regBlock.style.display === 'flex') {
            regBlock.style.display = 'none'
        }
    })

    const btnChangeForm = document.querySelector('#loginForm a');

    btnChangeForm.addEventListener('click', () => {
        console.log('Has hecho click');
        const logBlock = document.querySelector('#loginForm form');
        let visible = logBlock.style.display === 'flex';
        logBlock.style.display = visible ? 'none' : 'flex';
        const regBlock = document.querySelector('#registerForm form');
        regBlock.style.display = 'flex';
    })

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        // Obtén los valores de los campos del formulario
        const nick = document.getElementById('loginName').value;
        const password = document.getElementById('loginPass').value;

        // Crea un objeto con los datos del formulario
        const formData = {
            name: nick,
            password: password
        };

        // Realiza la solicitud fetch para enviar los datos del formulario
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(function (response) {
                // Maneja la respuesta de la solicitud fetch
                if (response.ok) {
                    // La solicitud fue exitosa
                    console.log(response);
                    return response.json();
                } else {
                    // La solicitud falló
                    throw new Error('Error en la solicitud');
                }
            })
            .then(function (data) {
                // Maneja los datos de respuesta del servidor
                console.log(data);
                const keys = Object.keys(data);
                const primerKey = keys[0];
                const primerValor = data[primerKey];
                if (primerKey === 'message') {
                    console.log(primerKey);
                    const logBlock = document.querySelector('#loginForm form');
                    logBlock.innerHTML += primerValor
                } else {
                    const token = data.token
                    console.log(token);
                    const user = data.user
                    console.log(user[0].name);
                    // document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 2024 00:00:00 UTC; domain=tudominio.com; secure;`;
                    document.cookie = `token=${token}`
                    document.cookie = `user=${user[0].name}`
                    window.location = "http://localhost:3001/templates"
                }



            })
            .catch(function (error) {
                // Maneja los errores
                console.error(error);
            });
    });

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        // Obtén los valores de los campos del formulario
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPass').value;
        const name = document.getElementById('registerName').value;

        // Crea un objeto con los datos del formulario
        const formData = {
            email: email,
            password: password,
            name: name
        };

        // Realiza la solicitud fetch para enviar los datos del formulario
        fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(function (response) {
                // Maneja la respuesta de la solicitud fetch
                if (response.ok) {
                    // La solicitud fue exitosa
                    return response.json();
                } else {
                    // La solicitud falló
                    throw new Error('Error en la solicitud');
                }
            })
            .then(function (data) {
                // Maneja los datos de respuesta del servidor
                console.log(data);
                const keys = Object.keys(data);
                const primerKey = keys[0];
                const primerValor = data[primerKey];
                if (primerKey === 'message') {
                    console.log(primerKey);
                    const regBlock = document.querySelector('#registerForm form');
                    regBlock.innerHTML += primerValor
                } else {
                    const token = data.token
                    console.log(token);
                    const user = data.user
                    console.log(user.name);
                    // document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 2024 00:00:00 UTC; domain=tudominio.com; secure;`;
                    document.cookie = `token=${token}`
                    document.cookie = `user=${user.name}`
                    window.location = "http://localhost:3001/templates"
                }
            })
            .catch(function (error) {
                // Maneja los errores
                console.error(error);
            });
    });
}
