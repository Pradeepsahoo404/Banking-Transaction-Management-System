import express from "express"
import {
    transferMoney,
    transactionList,
    transactionById,
    transactionUpdate,
    transactionDelete,
} from "../controller/transaction.controller.js"
import {auth , authorizeRoles} from "../middleware/auth.js"
const router  = express.Router()

router.post("/transfer", auth, authorizeRoles("regularUser", "manager"), transferMoney);
router.get("/transaction_list", auth, authorizeRoles("regularUser", "manager"), transactionList);
router.get("/transaction/:id", auth, authorizeRoles("regularUser", "manager"), transactionById);
router.put("/transaction_update/:id", auth, authorizeRoles("regularUser", "manager"), transactionUpdate);
router.delete("/transaction_delete/:id", auth, authorizeRoles("regularUser", "manager"), transactionDelete);


export default router
