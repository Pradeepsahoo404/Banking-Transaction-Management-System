import Account from "../models/account.models.js"
import Transaction from "../models/transaction.models.js";
import {sendMail} from "../utils/mailsender.js"
import { CURRENT_LIMIT , SAVINGS_LIMIT , BASIC_SAVINGS_LIMIT , SAVINGS , CURRENT , BASIC_SAVINGS} from "../utils/constants.js";
import User from "../models/user.model.js";


export const transferMoney = async(req ,res)=> {
    try{
        const sourceAccountId = req.user.id
        const {destinationAccountId, amount, currency, transactionType, scheduledAt } = req.body;
        const sourceAccount = await Account.findOne({userId :sourceAccountId })
        const destinationAccount = await Account.findOne({userId : destinationAccountId})
        const sourceDetail = await User.findById(sourceAccountId)
        
        if(!sourceAccount || !destinationAccount){
            return res.status(404).json({
                success: false,
                message: "Source or destination account not found",
            });
        }
        //limit for deferent Accounts
        let accountLimit;
        if (sourceAccount.accountType === SAVINGS) {
            accountLimit = SAVINGS_LIMIT;
        } else if (sourceAccount.accountType === CURRENT) {
            accountLimit = CURRENT_LIMIT;
        } else if (sourceAccount.accountType === BASIC_SAVINGS) {
            accountLimit = BASIC_SAVINGS_LIMIT;
        }
        if (amount > accountLimit) {
            
            // send mail
            const toMail = sourceDetail.email;
            const subject = 'Account Limit Exceeded';
            const content = `Your account (${sourceAccount.accountType}) has exceeded the limit of ${accountLimit}.`;
            await sendMail(toMail, subject, content);
        }
        
        
        if(transactionType === "transfer" && sourceAccount.balance < amount){
            return res.status(400).json({
                success: false,
                message: "Insufficient balance in source account",
            });
        }
        
        console.log("one11")
           
        const newTransaction = new Transaction({
            sourceAccountId,
            destinationAccountId,
            amount,
            currency,
            transactionType,
            scheduledAt,
            status : transactionType === "scheduled" ? "pending" : "completed",
            executedAt : transactionType === "transfer" ?  new Date() : undefined,
        })

       

        const savedTransaction = await newTransaction.save();

        if(transactionType === "transfer"){
            sourceAccount.balance -= amount;
            destinationAccount.balance += amount;

            await sourceAccount.save()
            await destinationAccount.save()
        }

         //send mail 
         const toMail = sourceDetail.email;
         const subject = 'Transaction Report';
         const content = `Your transaction status is ${savedTransaction.status}.`;
         await sendMail(toMail, subject, content);


        res.status(201).json({
            success: true,
            data: savedTransaction,
            message: "Transaction created successfully",
        });

    }catch(err){
        console.error("Error transferring money:", err);
        res.status(500).json({
            success: false,
            message: "Cannot transfer money",
        })
    }
}

//list by filteration
export const transactionList = async(req, res) => {
    try {
        const id = req.user.id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;

        // Create a filter object
        const filter = {};
        filter.sourceAccountId = id
        

        if (req.query.currency) {
            filter.currency = req.query.currency;
        }
        if (req.query.transactionType) {
            filter.transactionType = req.query.transactionType;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }


        const totalTransactions = await Transaction.countDocuments(filter);
        const totalPages = Math.ceil(totalTransactions / limit);
  
        const transactions = await Transaction.find(filter)
            .limit(limit)
            .skip(startIndex);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                totalPages,
                currentPage: page,
                totalTransactions,
            },
            message: "Transactions fetched successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch transactions",
        });
    }
};

export const transactionById = async(req , res) => {
    try {
        const transaction = await Transaction.findOne({_id : req.params.id , sourceAccountId : req.user.id});
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            success: true,
            data: transaction,
            message: "Transaction fetched successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot fetch transaction",
        });
    }
}

export const transactionUpdate = async(req , res) => {
    try {
        const { status, executedAt } = req.body;
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {_id : req.params.id , sourceAccountId : req.user.id},
            { status, executedAt },
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            success: true,
            data: updatedTransaction,
            message: "Transaction updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot update transaction",
        });
    }
}

export const transactionDelete = async(req , res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({_id : req.params.id , sourceAccountId : req.user.id},);
        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            success: true,
            data: deletedTransaction,
            message: "Transaction deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cannot delete transaction",
        });
    }
}
