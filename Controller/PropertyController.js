const propertyModel = require("../Model/PropertyModel")

const postProperty = async (req, res, next) => {
    const agentId = req?.user._id

    const propertyImage = req.file
    if (!propertyImage) {
        return res.status(404).json({
            Message: "Property Image Not Found",
            Status: "Error"
        })
    }
    try {
        const property = await propertyModel.create({ ...req.body, agent: agentId, image: propertyImage.path })

        if (!property) {
            return res.status(400).json({
                Message: "Unable to Post Propperty",
                Status: "Error"
            })
        }

        return res.status(201).json({
            Message: "Property Successfully added",
            Status: "Success",
            property
        })

    } catch (error) {
        console.log(error);
        next(error)

    }
}


const singleProperty = async (req, res, next) => {
    const { propertyId } = req.params

    try {

    } catch (error) {

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



module.exports = {
    postProperty,
    allProperties
}