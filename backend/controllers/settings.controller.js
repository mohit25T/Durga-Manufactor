import Settings from "../models/Settings.js";

// Default app version if none configured in database yet
const DEFAULT_APP_VERSION = {
    android: {
        latestVersion: "1.0.0",
        minVersion: "1.0.0",
        updateUrl: "https://www.durgamanufactures.com/downloads/durga-dealer-app.apk",
        forceUpdate: false,
        releaseNotes: "Latest performance improvements, fast quotation generation, and order tracking."
    },
    ios: {
        latestVersion: "1.0.0",
        minVersion: "1.0.0",
        updateUrl: "https://www.durgamanufactures.com/install",
        forceUpdate: false,
        releaseNotes: "Latest performance improvements and catalog updates."
    }
};

// GET SETTING BY KEY
export const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await Settings.findOne({ key });
        
        let data = setting ? setting.value : null;

        // Provide defaults for key settings if unset
        if (data === null && key === "app_version") {
            data = DEFAULT_APP_VERSION;
        }

        res.json({
            success: true,
            data
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
