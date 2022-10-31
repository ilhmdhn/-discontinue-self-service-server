const response = (state, data, message = "succes") =>{
    return {
        state: state,
        data: data,
        message: message    
    }
}

module.exports = {response}