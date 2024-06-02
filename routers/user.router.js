import express from "express"
import {registerUser ,
    loginUser , 
    logoutUser ,
    getByIdUser ,
    getAllUser ,
    deleteUser,
    updateUser,
    changePassword,
    forgetPassword,
    } from "../controller/user.controller.js"
import {auth , authorizeRoles} from "../middleware/auth.js"
const router  = express.Router()

router.post("/register_user" , registerUser)
router.post("/login" , loginUser)
router.post("/logout" , auth , logoutUser)


router.get("/get_user" ,auth, authorizeRoles("regularUser" , "manager"), getByIdUser)
router.get("/get_all_user" , auth ,authorizeRoles("admin" , "manager"), getAllUser)
router.delete("/delete_user" ,auth ,authorizeRoles("regularUser" ,"manager" ), deleteUser)
router.put("/update_user" ,auth,authorizeRoles("admin" ,"regularUser", "manager"), updateUser)

router.post("/change-password" ,auth,authorizeRoles("admin" ,"regularUser", "manager"), changePassword)
router.post("/forget-password" , forgetPassword)


export default router
