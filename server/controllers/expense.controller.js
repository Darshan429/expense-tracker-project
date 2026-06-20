const { Expense , User } = require('../models/index')

exports.createExpense = async (req,res)=>{
    try{
        const {amount , description , category } = req.body;

        const newExpense = await Expense.create({
            amount,
            description,
            category,
            status:'PENDING',
            user_id:req.user.id
        })
        res.status(201).json({message:'Expense submitted successfully',expense:newExpense});
    }catch(error){
        console.error('Create Expense Error:',error);
        res.status(500).json({error:'Failed to submit the expense'});
    }
};

exports.approveExpense = async(req,res)=>{
    try{
        const {status , remarks } = req.body;

        if(!['APPROVED','REJECTED'].includes(status)){
            return res.status(400).json({error:"status must be APPROVED or REEJECTED"})
        }

        const expense = await Expense.findByPk(req.params.id);
        if(!expense){
            return  res.status(404).json({error:"Expense not found"})
        }
        expense.status = status
        await expense.save();
        res.status(200).json({message:`Expense ${status.toLowerCase()} Successfully`,expense})
    }catch(error){
        
    }
}

exports.deleteExpense = async(req,res)=>{
    try{
        const expense = await Expense.findByPk(req.params.id);
        if(!expense){
            return res.status(404).json({error:'Expense not found'})
        }

        await expense.destroy();
        res.status(200).json({message:'Expense Deleted Successfully'})
    }catch(error){
        console.error('Delete expense Error',error);
        res.status(500).json({error:'Failed to delete the Expense'})
    }
}