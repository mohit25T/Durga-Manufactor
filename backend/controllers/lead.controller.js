import Lead from "../models/Lead.js";

// CREATE LEAD (Customer Inquiry)
export const createLead = async (req, res) => {
    try {

        const lead = new Lead(req.body);

        await lead.save();

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            data: lead
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// GET ALL LEADS (Admin Panel)
export const getLeads = async (req, res) => {
    try {

        const leads = await Lead.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: leads.length,
            data: leads
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};