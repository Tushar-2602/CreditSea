const AsyncHandler = (request_handler) => {
    return (req, res, next) => {
        Promise.resolve(request_handler(req, res, next)).catch((err) => {
            console.log(err);
            if (err.message && err.status) {                
                   return res
                    .status(400)
                    .json(err)
            }
            else return res.status(400).send("something horribly went wrong");


          
        })
    }
}


export { AsyncHandler }
