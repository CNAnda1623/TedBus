const express=require("express")
const router=express.Router();
const cabCustomerController = require("../controller/cabCustomer");
const customercontroller = require('../controller/customer'); // or cabCustomer

router.post("/customer",customercontroller.addnewcustomer);
router.post('/cab-customer', cabCustomerController.createCustomer);
// router.get('/cab-customer/:id', cabCustomerController.getCustomerById);

module.exports=router;