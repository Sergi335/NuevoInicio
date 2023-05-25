const handleHttpError = (res, message = 'Algo va mal', code = 403) => {
    
    //res.status(code);
    //res.send({error:message})
    let locals = {
        code: code, 
        message:message
    }
    res.render("error.pug", locals)
}

module.exports = {handleHttpError}