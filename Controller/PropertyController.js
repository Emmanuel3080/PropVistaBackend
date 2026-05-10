const propertyModel = require("../Model/PropertyModel")

const postProperty = async (req, res, next) => {
    const agentId = req?.user._id;

    let propertyData = { ...req.body };

    if (req.body.availableSlots) {
        try {
            propertyData.availableSlots = JSON.parse(req.body.availableSlots);
        } catch (err) {
            return res.status(400).json({ message: "availableSlots must be a valid JSON string" });
        }
    }

    const propertyImage = req.file;
    if (!propertyImage) {
        return res.status(404).json({
            Message: "Property Image Not Found",
            Status: "Error"
        });
    }

    try {
        // FIXED LINE: Use the spread operator (...) 
        const property = await propertyModel.create({
            ...propertyData,
            agent: agentId,
            image: propertyImage.path
        });

        if (!property) {
            return res.status(400).json({
                Message: "Unable to Post Property",
                Status: "Error"
            });
        }

        return res.status(201).json({
            Message: "Property Successfully added",
            Status: "Success",
            property
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}


const singleProperty = async (req, res, next) => {
    const { propertyId } = req.params

    try {
        const property = await propertyModel.findById(propertyId).populate({
            path: "agent",
            select: "fullName email phone agencyName profileImage"
        })
        if (!property) {
            return res.status(400).json({
                Message: "Property Not Found",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Property Fetched Successfully",
            Status: "Success",
            property
        })

    } catch (error) {
        console.log(error);
        next(error)

    }

}

const allProperties = async (req, res, next) => {
    try {
        const properties = await propertyModel.find().populate({
            path: "agent",
            select: "fullName email phone agencyName profileImage"
        })

        if (!properties) {
            return res.status(404).json({
                Message: "Unable to fetch all Properties",
                Status: "Error"
            })
        }
        return res.status(200).json({
            Message: "All Properties Succesfully Listed",
            Status: "Success",
            No_of_Properties_Listed: properties.length,
            properties
        })

    } catch (error) {
        console.log(error);
        next(error)

    }
}



const AgentProperties = async (req, res, next) => {
    const { AgentId } = req.params
    try {

        const property = await propertyModel.find({ agent: AgentId })

        if (!property || property.length == 0) {
            return res.status(400).json({
                Message: "No property has been added by this agent",
                Status: "Error"
            })
        }

        return res.status(200).json({
            Message: "Agent Properties Fetched Succssfully",
            Status: "Success",
            No_of_Properties_Listed: property.length,
            property
        })

    } catch (error) {
        console.log(error);
        next(error)

    }
}

module.exports = {
    postProperty,
    allProperties,
    AgentProperties,
    singleProperty
}