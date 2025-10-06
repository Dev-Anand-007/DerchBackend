const validate=(schema)=>{
    return (req,res,next)=>{
        const {error,value}=schema.validate(req.body,{
            abortEarly: false,
            stripUnknown:true,
            convert:true,
            allowUnknown:false,

        });
        if(error){
            return res.status(400).json({
                success:false,
                errors: error.details.map((err)=>err.message)
            });
        }

        req.body=value;
        next();
    }
}

//MiddleWare for validating URL parameters
const ValidateParams= (schema)=>{
    return (req,res,next)=>{
        const {error,value}=schema.validate(req.params)
            if(error){
                return res.status(400).json({
                    success: false,
                    message: 'Invalid parameters',
                    error: error.details[0].message
                })
            }
            req.params=value;
            next();
        
    };
};

module.exports={validate,ValidateParams};