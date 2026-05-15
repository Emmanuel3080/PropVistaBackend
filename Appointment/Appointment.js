const AppointmentModel = require("../Model/AppointmentModel");
const PropertyModel = require("../Model/PropertyModel");
const AdminPropertyBooking = require("../Utils/AdminPropertyBooking");
const ClientPropertyBooking = require("../Utils/BookingConfirmation");

const BookAppointment = async (req, res, next) => {
    const clientInfo = req?.user
    const client_id = req?.user?._id;

    try {
        const { propertyId, agentId, date, time, message, name, email } = req.body;

        // Validate required fields
        // if (!propertyId || !date || !time || !message) {
        //     return res.status(400).json({
        //         Message: "Missing required fields",
        //         Status: "Error"
        //     });
        // }

        // Check if property exists
        const property = await PropertyModel.findById(propertyId).populate("agent")

        if (!property) {
            return res.status(404).json({
                Message: "Property not found",
                Status: "Error"
            });
        }

        //  Check if slot exists in property availability
        const daySlot = property.availableSlots.find(
            (slot) => slot.date === date
        );

        if (!daySlot) {
            return res.status(400).json({
                Message: "No availability for this date",
                Status: "Error"
            });
        }

        // Check time availability
        const timeExists = daySlot.times.includes(time);

        if (!timeExists) {
            return res.status(400).json({
                Message: "Time slot not available",
                Status: "Error"
            });
        }

        // Prevent double booking
        const existingBooking = await AppointmentModel.findOne({
            propertyId,
            time,
            date
        });

        if (existingBooking) {
            return res.status(400).json({
                Message: "This slot is already booked",
                Status: "Error"
            });
        }

        // Create appointment
        const appointment = await AppointmentModel.create({
            name: clientInfo.fullName,
            email: clientInfo.email,
            userId: client_id,
            propertyId,
            date,
            time,
            message: message || "",
            agentId: property.agent._id
        });


        // Booking Info
        const mailPayload = {
            title: property.title,
            price: property.price,
            location: property.location,
            propertyType: property.propertyType,
            bedrooms: property.bedrooms,
            image: property.image,
            viewingDate: date,
            viewingTime: time
        };


        // Send mail to users
        const confirmBooking = await ClientPropertyBooking(clientInfo?.email, clientInfo?.fullName, mailPayload)



        // Send mail to Agent
        const adminMail = await AdminPropertyBooking(
            property.agent.email,     // agentEmail
            clientInfo.fullName,      // clientName
            clientInfo.email,         // clientEmail
            clientInfo.phoneNumber || "N/A",// clientPhone
            property,                 // the full property object for price/title
            date,                     // viewingDate
            time                      // viewingTime
        );

        return res.status(201).json({
            Message: "Booking Successful",
            Status: "Success",
            confirmBooking,
            adminMail,
            appointment
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

const AgentAppointment = async (req, res, next) => {

    const agentId = req?.user?._id
    try {
        const appointments = await AppointmentModel.find({ agentId }).populate("userId", "fullName email phoneNumber")
            .populate("propertyId", "title location image price")
            .sort({ createdAt: -1 });



        if (!appointments) {
            return res.status(404).json({
                Message: "Unable to fetch Agents Appointment",
                Status: "Error",
            })
        }


        return res.status(200).json({
            Message: "Fetched Agents Appointment Successfully",
            Status: "Success",
            count: appointments.length,
            appointments
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}
module.exports = {
    BookAppointment,
    AgentAppointment
};