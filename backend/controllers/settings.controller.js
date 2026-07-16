import Settings from "../models/Settings.js";

// GET SETTING BY KEY
export const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await Settings.findOne({ key });
        
        res.json({
            success: true,
            data: setting ? setting.value : null
        });
    } catch (error) {
        console.error("GET SETTING ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE OR CREATE SETTING BY KEY
export const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (value === undefined || value === null) {
            return res.status(400).json({
                success: false,
                message: "Value is required"
            });
        }

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Setting updated successfully",
            data: setting.value
        });
    } catch (error) {
        console.error("UPDATE SETTING ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
