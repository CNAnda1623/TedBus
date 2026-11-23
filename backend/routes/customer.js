const express=require("express")
const router=express.Router();
const cabCustomerController = require("../controller/cabCustomer");
const customercontroller = require('../controller/customer'); // or cabCustomer
const customBusCustomerController = require("../controller/customBusCustomer");

router.post("/customer",customercontroller.addnewcustomer);
router.post('/cab-customer', cabCustomerController.createCustomer);
router.post('/custom-bus-customer', customBusCustomerController.saveBusCustomer);

module.exports=router;