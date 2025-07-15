// const Route=require("../models/route");
// const Bus=require("../models/bus");
// const Booking=require("../models/booking");

// exports.getoneroute = async(req,res) => {
//     let departure = req.params.departure;
//     let arrival= req.params.arrival;
//     let date= req.params.date;

//     let routes=await Route.find().lean().exec();
//     let route=routes.find((route)=>{
//         return(
//             route.departureLocation.name.toLowerCase() ==departure.toLowerCase() &&
//             route.arrivalLocation.name.toLowerCase() == arrival.toLowerCase()
//         );
//     });
//     let buses=await Bus.find();
//     let matchedbuses=buses.filter((bus)=>{
//         return bus.routes.toString()=== route._id.toString();
//     })

//     const booking =await Booking.find().lean().exec();
//     const busidwithseatobj={}
//     for (let i=0;i<matchedbuses.length;i++){
//         let currentbusseats=[]
//         const busbooking=booking.filter((booking)=>{
//             return(
//                 booking.departureDetails.date===date &&
//                 booking.busId.toString() === matchedbuses[i]._id.toString()
//             );
//         });
//     busbooking.forEach((booking)=>{
//         currentbusseats=[...currentbusseats,...booking.seats];
//     });
//     busidwithseatobj[matchedbuses[i]._id.toString()]=currentbusseats;
//     }
//     res.send({route:route,matchedBuses:matchedbuses,busidwithseatobj})

// };
const Route = require("../models/route");
const Bus = require("../models/bus");
const Booking = require("../models/booking");

exports.getoneroute = async (req, res) => {
  const { departure, arrival, date } = req.params;

  try {
    const routes = await Route.find().lean().exec();

    const route = routes.find((r) => {
      return (
        r.departureLocation?.name?.toLowerCase() === departure.toLowerCase() &&
        r.arrivalLocation?.name?.toLowerCase() === arrival.toLowerCase()
      );
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    const buses = await Bus.find();

    const matchedBuses = buses.filter((bus) => {
      return bus.routes.toString() === route._id.toString();
    });

    const bookings = await Booking.find().lean().exec();

    const busidwithseatobj = {};

    for (let i = 0; i < matchedBuses.length; i++) {
      let currentbusseats = [];

      const busBookings = bookings.filter((booking) => {
        return (
          booking.departureDetails?.date === date &&
          booking.busId?.toString() === matchedBuses[i]._id.toString()
        );
      });

      busBookings.forEach((booking) => {
        currentbusseats = [...currentbusseats, ...booking.seats];
      });

      busidwithseatobj[matchedBuses[i]._id.toString()] = currentbusseats;
    }

    res.status(200).json({
      route,
      matchedBuses,
      busidwithseatobj,
    });
  } catch (err) {
    console.error("Error in getoneroute:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
