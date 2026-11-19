const Route = require("../models/route");
const Bus = require("../models/bus");
const Booking = require("../models/booking");

exports.getoneroute = async (req, res) => {
  const { departure, arrival, date } = req.params;

  console.log("📥 Incoming Params:", { departure, arrival, date }); // ✅ Log input params

  try {
    const routes = await Route.find().lean().exec();
    console.log("📦 Total Routes Found:", routes.length); // ✅ Log total routes

    const route = routes.find((r) => {
      return (
        r.departureLocation?.name?.toLowerCase() === departure.toLowerCase() &&
        r.arrivalLocation?.name?.toLowerCase() === arrival.toLowerCase()
      );
    });

    console.log("🔍 Matched Route:", route); // ✅ Log matched route (may be null)

    if (!route) {
      console.warn("⚠️ No matching route found for input!");
      return res.status(404).json({ message: "Route not found." });
    }

    const buses = await Bus.find();
    console.log("🚌 Total Buses Found:", buses.length); // ✅ Optional

    const matchedBuses = buses.filter((bus) => {
      return bus.routes.toString() === route._id.toString();
    });

    console.log("✅ Matched Buses:", matchedBuses.length); // ✅ Optional

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

    console.log("🪑 Bus Seat Map:", busidwithseatobj); // ✅ Optional

    res.status(200).json({
      route,
      matchedBuses,
      busidwithseatobj,
    });
  } catch (err) {
    console.error("❌ Error in getoneroute:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
