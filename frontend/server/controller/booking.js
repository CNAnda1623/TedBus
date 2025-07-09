const Booking = require("../models/booking");
const CabBooking=require("../models/cabBooking");

exports.createCabBooking = async (req, res) => {
  console.log('Received booking:', req.body); 
try {
    const newBooking = new CabBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Cab booking saved successfully' });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ error: 'Failed to save booking' });
  }
};

exports.addbooking=async(req,res)=>{
    const booking =await Booking.create(req.body);
    console.log(booking);
    res.send(booking);
}

exports.getBooking =async(req,res)=>{
    let {id}=req.params;
    const booking=await Booking.find().lean().exec();
    let filteredBookings=booking.filter((booking)=>booking.customerId.toString()== id);
    res.send(filteredBookings)
}