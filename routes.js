const express = require('express')
const router = express.Router()
const crud = require('./helper/crud')

const validator = require('./middleware/validator')

router.post('/query', validator.validateRequest, (req,res)=>{
    let method = req.body.method
    let params = req.body.params
    Object.keys(params).forEach((key) => {
        if (/RegExp$/.test(key)) {
            let newKey = key.replace("RegExp","")
            params[newKey] = new RegExp(params[key],"i")
            delete params[key]
        }
    });

    crud[method](params,(response,data)=>{
        res.json({
            status:response,
            message:data
        })
    })
})

module.exports = router