import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
         },
    accountType: {
        type: String,
        enum: ['Savings', 'Current', 'BasicSavings'],
        required: true 
        },
    balance: {
         type: Number,
          required: true 
        },
    currency: {
         type: String,
          required: true 
        },
    isBlocked: { 
        type: Boolean, 
        default: false
     }
} ,{timestamps : true})

const Account = mongoose.model("Account" , accountSchema)
export default Account