const Route=require("../models/route");
const Bus=require("../models/bus");
const Booking=require("../models/booking");

exports.getoneroute = async(req,res) => {
    let departure = req.params.departure;
    let arrival= req.params.arrival;
    let date= req.params.date;

    let routes=await Route.find().lean().exec();
    let route=routes.find((route)=>{
        return(
            route.departureLocation.name.toLowerCase() ==departure.toLowerCase() &&
            route.arrivalLocation.name.toLowerCase() == arrival.toLowerCase()
        );
    });
    let buses=await Bus.find();
    let matchedbuses=buses.filter((bus)=>{
        return bus.routes.toString()=== route._id.toString();
    })

    const booking =await Booking.find().lean().exec();
    const busidwithseatobj={}
    for (let i=0;i<matchedbuses.length;i++){
        let currentbusseats=[]
        const busbooking=booking.filter((booking)=>{
            return(
                booking.departureDetails.date===date &&
                booking.busId.toString() === matchedbuses[i]._id.toString()
            );
        });
    busbooking.forEach((booking)=>{
        currentbusseats=[...currentbusseats,...booking.seats];
    });
    busidwithseatobj[matchedbuses[i]._id.toString()]=currentbusseats;
    }
    res.send({route:route,matchedBuses:matchedbuses,busidwithseatobj})

};
// const Route = require("../models/route");
// const Bus = require("../models/bus");
// const Booking = require("../models/booking");

// exports.getoneroute = async (req, res) => {
//   try {
//     console.log("✅ Route Hit: /routes/:departure/:arrival/:date");
//     console.log("🔵 Incoming request:", req.params);

//     const departure = req.params.departure;
//     const arrival = req.params.arrival;
//     const date = req.params.date;

//     const routes = await Route.find().lean().exec();
//     console.log("📦 All Routes from DB:", routes.map(r => ({
//       id: r._id,
//       departure: r.departureLocation?.name,
//       arrival: r.arrivalLocation?.name
//     })));

//     const route = routes.find((r) =>
//       r.departureLocation?.name?.toLowerCase() === departure.toLowerCase() &&
//       r.arrivalLocation?.name?.toLowerCase() === arrival.toLowerCase()
//     );

//     if (!route) {
//       console.log("❌ No matching route found.");
//       return res.status(404).json({ message: "Route not found" });
//     }

//     console.log("✅ Matched Route:", route);

//     const buses = await Bus.find();
//     const matchedBuses = buses.filter((bus) =>
//       bus.routes.toString() === route._id.toString()
//     );
//     console.log("🚌 Matched Buses:", matchedBuses.map(b => b._id));

//     const bookings = await Booking.find().lean().exec();
//     const busidwithseatobj = {};

//     for (let bus of matchedBuses) {
//       const busBookings = bookings.filter(
//         (b) =>
//           b.departureDetails.date === date &&
//           b.busId.toString() === bus._id.toString()
//       );

//       let currentbusseats = [];
//       busBookings.forEach((booking) => {
//         currentbusseats.push(...booking.seats);
//       });

//       busidwithseatobj[bus._id.toString()] = currentbusseats;
//     }

//     res.send({
//       route: route,
//       matchedBuses: matchedBuses,
//       busidwithseatobj: busidwithseatobj
//     });

//   } catch (err) {
//     console.error("🔥 Error in getoneroute:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
