const prisma = require('../utils/db')

exports.getAllTours = async(req,res) => {
    try {
        const tours = await prisma.tour.findMany();

        res.status(200).json({
        status:'success',
        numberoftours:tours.length,
        data:{
            tours
        }   })
    } catch (error) {
        res.status(400).json({
            status:'fail',
            message:error.message
        })
        
    }
}

exports.getTour = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.createTour = async(req,res) => {

    try {
    const tour =await prisma.tour.create({data:req.body})

         res.status(200).json({
        status:'success',
        data:{
            tour
        }   
        })
        
    } catch (error) {
        res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
}

exports.updateTour = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.deleteTour = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}
