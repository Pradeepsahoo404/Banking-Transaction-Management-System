import Account from "../models/account.models.js"

export const createAccount = async(req , res)=>{
    try {
        const userId = req.user.id
        const {accountType, initialBalance, currency} = req.body;
        if (accountType === 'BasicSavings' && initialBalance > 50000) {
            return res.status(400).json({
                success : false,
                message: 'Balance cannot exceed Rs. 50,000 for BasicSavings account'
                 });
        }
        const account = new Account({ userId, accountType, balance: initialBalance, currency });
  
        const savedAccount = await account.save();
        res.status(201).json({
            success: true,
            data: savedAccount,
            message: "Account created successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot create account ",
        });
    }
}

export const getAllAccount = async(req , res)=>{
    try {
        const account = await Account.find();
        res.status(200).json({
            success: true,
            data: account,
            message: "Account fetched successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch account",
        });
    }
}

export const updateAccount = async(req , res)=>{
    try {
        const updatedAccount = await Account.findOneAndUpdate(
            {userId : req.user.id},
            req.body,
            { new: true }
        );
        res.status(200).json({
            success: true,
            data: updatedAccount,
            message: "Account updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot update account",
        });
    }
}

export const deleteAccount = async(req , res)=>{
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Account type deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot delete account type",
        });
    }
}

export const getByIdAccount = async(req , res)=>{
    try {
        const account = await Account.findOne({userId : req.user.id});
        res.status(200).json({
            success: true,
            data: account,
            message: "Account fetched successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot get account",
        });
    }
}
