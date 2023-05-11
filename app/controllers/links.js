const { linksModel, columnasModel } = require("../models/index");

/**
 * Funcion emergencia creada para actualizar la db con el campo orden de cada
 * link en cada panel, no se usa.
 * @param {*} req 
 * @param {*} res 
 */
const setOrder = async (req, res) => {
    try {
        const { body } = req;

        // Obtener los paneles del escritorio
        const data = await linksModel.find({ escritorio: body.escritorio });
        const paneles = [...new Set(data.map((element) => element.panel))];

        // Actualizar el campo "orden" para cada elemento del panel
        for (const panel of paneles) {
            const elementosPanel = await linksModel
                .find({ escritorio: body.escritorio, panel })
                .sort({ orden: 1 });

            for (let i = 0; i < elementosPanel.length; i++) {
                await linksModel.findByIdAndUpdate(
                    elementosPanel[i]._id,
                    { $set: { orden: i } }
                );
            }
        }

        // Obtener la lista ordenada por el campo "orden"
        const lista = await linksModel
            .find({ escritorio: body.escritorio }) //filtrar por panel tmb
            .sort({ orden: 1 });

        //res.send(lista);
        return lista;

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};
/**
* Funcion para ordenar los links de un escritorio y un panel pasados como parametro según su campo * orden, es llamada por: editDragItem, deleteItem
* @param {*} req 
* @param {*} res 
*/
const setOrder2 = async (desk, panel) => {
    try {
        console.log(desk, panel);

        // Actualizar el campo "orden" para cada elemento del panel
        const elementosPanel = await linksModel
            .find({ escritorio: desk, idpanel: panel })
            .sort({ orden: 1 });

        for (let i = 0; i < elementosPanel.length; i++) {
            await linksModel.findByIdAndUpdate(
                elementosPanel[i]._id,
                { $set: { orden: i } }
            );
        }
        // Obtener la lista ordenada por el campo "orden"
        const lista = await linksModel
            .find({ escritorio: desk, idpanel: panel })
            .sort({ orden: 1 });

        //console.log(`La lista es: ${lista}`);
        return lista;

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};
/**
 * Obtener lista de enlaces ordenados por el campo orden ascendente de un escritorio
 * pasado por la query, escritorio entero ojo rendimiento.
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const params = req.query.escritorio;
    const data = await linksModel.find({ escritorio: `${params}` }).sort({ orden: 1 });

    res.send(data);
}
/**
 * Obtener enlace, no se usa pero está exportada
 * @param {*} req 
 * @param {*} res 
 */
const getItemsCount = async (req, res) => {
    const params = req.query.idpanel;
    //const data = await linksModel.countDocuments({ idpanel: `${params}` });
    const data = await linksModel.find({ idpanel: `${params}` });

    res.send(String(data.length));
    //res.send('estas aqui')
}
/**
 * Crear enlace nuevo
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    const { body } = req;
    //console.log(body);
    //const dbIDCol = body.id;
    //console.log(dbIDCol);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.URL = body.URL;
    objeto.imgURL = body.imgURL;
    objeto.escritorio = body.escritorio;
    objeto.panel = body.columna;
    objeto.idpanel = body.id;
    objeto.orden = body.orden;
    //console.log(objeto);
    //Find idpanel si estaba vacio cambiar flag a false
    const count = await linksModel.find({ idpanel: objeto.idpanel })
    if (count.length === 0) {
        console.log("Estaba vacia");
        const documentoActualizado = await columnasModel.findOneAndUpdate({ _id: objeto.idpanel }, { $set: { vacio: false } })
    } else {
        console.log("No estaba vacia");
    }
    const findDuplicate = await linksModel.find({name: body.nombre, idpanel: body.id});
    console.log(findDuplicate);
    console.log(findDuplicate.length);
    if(findDuplicate == 0) {
        const data = await linksModel.create(objeto);
        res.send(data);
    } else {
        const err = { "error": "El link ya existe en esta columna" }
        res.send(err);
    }
    
    
    //const lista = await linksModel.find({panel: `${objeto.panel}`, escritorio: `${objeto.escritorio}`});
    // const lista = await linksModel.find({idpanel: `${objeto.idpanel}`, escritorio: `${objeto.escritorio}`});
    //console.log(lista);

    // Obtener los paneles del escritorio
    const data2 = await linksModel.find({ escritorio: body.escritorio, panel: body.columna });
    const paneles = [...new Set(data2.map((element) => element.panel))];

    // Actualizar el campo "orden" para cada elemento del panel, se podría llamar a setOrder2?
    for (const panel of paneles) {
        const elementosPanel = await linksModel
            .find({ escritorio: body.escritorio, panel })
            .sort({ orden: 1 });

        for (let i = 0; i < elementosPanel.length; i++) {
            await linksModel.findByIdAndUpdate(
                elementosPanel[i]._id,
                { $set: { orden: i } }
            );
        }
    }

    // Obtener la lista ordenada por el campo "orden"
    const lista = await linksModel
        .find({ escritorio: body.escritorio, panel: body.columna })
        .sort({ orden: 1 });

    //res.send(lista);
    
}
/**
 * Actualizar enlace al arrastrar entre columnas
 * @param {*} req 
 * @param {*} res 
 */
const editdragItem = async (req, res) => {
    const { body } = req;
    const objeto = new Object();
    objeto.oldId = body.oldId;
    objeto.newId = body.newId;
    objeto.name = body.name;
    objeto.escritorio = body.escritorio;
    objeto.panel = body.panel;

    //Si el elemento es arrastrado a una columna distinta
    if (objeto.oldId !== objeto.newId) {
        try {
            const documentoActualizado = await linksModel.findOneAndUpdate(
                { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.oldId}` }, // El filtro para buscar el documento
                { $set: { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.newId}`, panel: `${objeto.panel}` } }, // La propiedad a actualizar
                { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
            );
            //Buscar en la old y new y si están vacias o no cambiar
            const count = await linksModel.find({ idpanel: objeto.oldId })
            if (count.length === 0) {
                console.log("Se queda vacia");
                const documentoActualizado2 = await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: true } })
            } else {
                console.log("No se queda vacia");
                const documentoActualizado2 = await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: false } })
            }
            const documentoActualizado3 = await columnasModel.findOneAndUpdate({ _id: objeto.newId }, { $set: { vacio: false } })
    
        } catch (error) {
            console.log(error); // Manejo de errores
            res.send(error)
        }
        let lista = [];
        lista = lista.concat(await setOrder2(objeto.escritorio, objeto.newId));
        lista = lista.concat(await setOrder2(objeto.escritorio, objeto.oldId));
        res.send(lista);

    } else {
        res.send({ "Respuesta": "Elemento arrastrado en la misma columna" })
    }

}
/**
 * Borra enlace
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.panel = body.panel;
    objeto.escritorio = body.escritorio;
    objeto.id = body.id;
    console.log(objeto);
    const data = await linksModel.deleteOne({ name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.id}` });
    //Find y contar si 0 cambiar vacio true
    const count = await linksModel.find({ idpanel: objeto.id })
    if (count.length === 0) {
        console.log("Esta vacia");
        const documentoActualizado = await columnasModel.findOneAndUpdate({ _id: objeto.id }, { $set: { vacio: true } })
    } else {
        console.log("No esta vacia");
    }
    let lista = await setOrder2(objeto.escritorio, objeto.id);
    //console.log(lista);
    res.send(lista);
}
/**
 * Edita enlace
 * @param {*} req 
 * @param {*} res 
 */
const editItem = async (req, res) => {
    const { body } = req;
    //console.log(body);
    const objeto = new Object();
    objeto.nameOld = body.nombreOld;
    objeto.name = body.nombre;
    objeto.URL = body.URL;
    objeto.imgURL = body.imgURL;
    objeto.escritorio = body.escritorio;
    objeto.panel = body.columna;
    objeto.id = body.id
    //console.log(objeto);
    try {
        const documentoActualizado = await linksModel.findOneAndUpdate(
            { name: `${objeto.nameOld}`, escritorio: `${objeto.escritorio}`, panel: `${objeto.panel}`, idpanel: `${objeto.id}` }, // El filtro para buscar el documento
            { $set: { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, panel: `${objeto.panel}`, URL: `${objeto.URL}`, imgURL: `${objeto.imgURL}` } }, // La propiedad a actualizar
            { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)   
        );
        res.send(documentoActualizado)
        //console.log(documentoActualizado);
    } catch (error) {
        console.log(error); // Manejo de errores
        res.send(error)
    }
    const lista = await linksModel.find({ panel: `${objeto.panel}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.id}` }); //Ordenar por orden?? .sort?
    //console.log(lista);
    // res.send(lista);
    
}
/**
 * Función para actualizar orden de links dentro del mismo panel
 * @param {*} req 
 * @param {*} res 
 */
const actualizarOrdenElementos = async (req, res) => {
    try {
        const elementos = req.body.body;
        console.log(elementos);
        const idColumna = req.query.idColumna;

        //Creamos un mapa para almacenar el orden actual de los elementos
        const ordenActual = new Map();
        let orden = 0;
        elementos.forEach((elemento) => {
            ordenActual.set(elemento, orden);
            orden++;
        });

        // Actualizamos el campo "orden" de cada elemento en la base de datos
        const updates = elementos.map(async (elemento) => {
            const orden = ordenActual.get(elemento);
            await linksModel.findOneAndUpdate(
                { name: elemento, idpanel: idColumna },
                { orden },
                { new: true }
            );
        });
        await Promise.all(updates);

        const data = await linksModel.find({ idpanel: `${idColumna}` }).sort({ orden: 1 });
        // Enviamos la respuesta
        //res.status(200).json({ message: 'Elementos actualizados correctamente' });
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar los elementos' });
    }
};

module.exports = { getItemsCount, getItems, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos };