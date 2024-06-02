import cron from "node-cron"
import Transaction from "../models/transaction.models.js"
import Account from "../models/account.models.js"
import User from "../models/user.model.js"
import {sendMail} from "./mailsender.js"
import { CURRENT_LIMIT ,SAVINGS_LIMIT , BASIC_SAVINGS_LIMIT , SAVINGS , CURRENT , BASIC_SAVINGS} from "./constants.js"

cron.schedule('* * * * *' , async()=>{
    try{
        const now = new Date();
        const transactions = await Transaction.find({
            transactionType: 'scheduled',
            status: 'pending',
            scheduledAt: { $lte: now }
        })

        for (const transaction of transactions) {
            const sourceAccount = await Account.findOne({sourceAccountId :transaction.sourceAccountId})
            const destinationAccount = await Account.findOne({ destinationAccountId :transaction.destinationAccountId});
            const sourceDetail = await User.findById(transaction.sourceAccountId)
        

            let accountLimit;
            if (sourceAccount.accountType === SAVINGS) {
                accountLimit = SAVINGS_LIMIT;
            } else if (sourceAccount.accountType === CURRENT) {
                accountLimit = CURRENT_LIMIT;
            } else if (sourceAccount.accountType === BASIC_SAVINGS) {
                accountLimit = BASIC_SAVINGS_LIMIT;
            }
    
            if (amount > accountLimit) {
                const toMail = sourceDetail.email;
                const subject = 'Account Limit Exceeded';
                const content = `Your account (${sourceAccount.accountType}) has exceeded the limit of ${accountLimit}.`;
                await sendMail(toMail, subject, content);
            }

            if (sourceAccount.balance >= transaction.amount) {
                sourceAccount.balance -= transaction.amount;
                destinationAccount.balance += transaction.amount;

                await sourceAccount.save();
                await destinationAccount.save();

                transaction.status = 'completed';
                transaction.executedAt = new Date();
            } else {
                transaction.status = 'failed';
            }
            
            await transaction.save();

         //send mail 
         const toMail = sourceDetail.email;
         const subject = 'Transaction Report';
         const content = `Your transaction status is ${transaction.status}.`;
         await sendMail(toMail, subject, content);

        }

    }catch(err){
        console.error('Error processing scheduled transactions:', err);
    }
})