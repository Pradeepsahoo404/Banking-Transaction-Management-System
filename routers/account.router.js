import express from "express"
import { createAccount,
         getAllAccount,
         updateAccount,
         deleteAccount,
         getByIdAccount,      
} from "../controller/account.controller.js"
import {auth , authorizeRoles} from "../middleware/auth.js"
const router  = express.Router()

router.post("/create_account" ,auth, authorizeRoles("admin" , "regularUser", "manager"), createAccount)
router.get("/get_all_account" , auth , authorizeRoles("admin") , getAllAccount)
router.get("/get_account" , auth , authorizeRoles("admin" ,"regularUser", "manager") , getByIdAccount)
router.put("/update_account" , auth , authorizeRoles("admin" , "regularUser", "manager") , updateAccount)
router.delete("/delete_account/:id" , auth , authorizeRoles("admin") , deleteAccount)


export default router
