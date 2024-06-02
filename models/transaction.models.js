import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    sourceAccountId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account',
         required: true
         },
    destinationAccountId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Account', 
          required: true
         },
    amount: { 
        type: Number, 
        required: true
     },
    currency: { 
        type: String, 
        required: true
     },
    transactionType: { 
        type: String,
         enum: ['transfer', 'scheduled'], 
         required: true 
        },
    status: { 
        type: String,
         enum: ['pending', 'completed', 'failed'],
          default: 'pending' 
        },
    scheduledAt: {
         type: Date
         },
    executedAt: { 
        type: Date 
    }
} ,{timestamps : true})

const Transaction = mongoose.model("Transaction" , transactionSchema)
export default Transaction