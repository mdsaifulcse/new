const Head = require('./Head')

class HeadController{

//View all Data
    index(req,res,next){
        Head.find()
            .then(allData => {
                res.status(200).json(allData)
            })
            .catch(err => {
                res.status(500).json({
                    message:'Some Error found!',
                    error:err
                })
            })
    }
//single user show
    show(req,res,next){
        Head.findById(req.params.id).then(data => {
            res.status(200).json(data)
        })
            .catch(err => {
                res.status(500).json({
                    message:'Some Error found!',
                    error:err
                })
            })
    }
//Store Data into DB
    store(req,res,next){
        let input = req.body;
        const data = new Head(input)
        data.save().then(data=>{
            res.status(201).json({
                message:'Data successfully inserted.',
                result:data
            }).catch(err => {
                res.status(500).json({
                    message:'Some Error found!',
                    error:err
                })
            })
        })
    }
    // Update single data
    update (req,res,next) {
        let id = req.params.id
        let inputData = req.body;
        inputData.updated_at = new Date()

        Head.findByIdAndUpdate(id,{$set:inputData})
            .then(data=>{
                Head.findById(data.id).then(newData=>{
                    res.json({data:newData})
                })
            })
            .catch(err=>{
                res.status(500).json({
                    message:'Something error found!',
                    error:err
                })
            })
    }
    //Delete data
    destroy(req, res,next) {
        Head.remove({
            _id: req.params.id
        }, function (err, result) {
            if (err)
                res.send(err)
            res.send({
                success: true
            })
        })
    }
    bulkStore(req,res,next){
        let input = req.body;
        const data = new Head(input)
        Head.collection.insert(input, function (err, docs) {
            if (err){
                res.status(500).json({
                    message:'Some Error found!',
                    error:err
                })
            } else {
                res.status(201).json({
                    message:'Bulk Data successfully inserted.',
                })
            }
        });
    }
    heads(req,res,next){
        Head.find().then(allData => {
            res.status(200).json(allData)
        })
            .catch(err => {
                res.status(500).json({
                    message:'Some Error found!',
                    error:err
                })
            })
    }
}
module.exports = new HeadController;