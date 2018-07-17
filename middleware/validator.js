let validator = {}

validator.validateRequest = (req,res,next)=>{
    if (!req.body.method) {
        res.json({
            status:"ERROR",
            message:"METHOD REQUIRED"
        })
    }
    else if (!req.body.params) {
        res.json({
            status:"ERROR",
            message:"PARAMS REQUIRED"
        })
    }
    else {
        let method = req.body.method
        let params = req.body.params
        switch(method) {
            case "create":
                if (!params.data) {
                    res.json({
                        status:"ERROR",
                        message:"DATA REQUIRED"
                    })
                }
                else {
                    next()
                }
                break;
            case "read":
                if (!params.condition) {
                    res.json({
                        status:"ERROR",
                        message:"CONDITION REQUIRED"
                    })
                }
                else {
                    next()
                }
                break;
            case "update":
                if (!params.condition) {
                    res.json({
                        status:"ERROR",
                        message:"CONDITION REQUIRED"
                    })
                }
                else if (!params.data) {
                    res.json({
                        status:"ERROR",
                        message:"DATA REQUIRED"
                    })
                }
                else {
                    next()
                }
                break;
            default:
                res.json({
                    status:"ERROR",
                    message:"UNKNOWN METHOD"
                })
                break;
        }
    }
}

module.exports = validator