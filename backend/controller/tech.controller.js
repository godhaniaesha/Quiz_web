const Tech = require('../model/tech.model');

// Create a new tech
exports.createTech = async (req, res) => {
    try {
        // Check for existing tech (case-insensitive)
        const existing = await Tech.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Tech name must be unique (case-insensitive)' });
        }
        const techData = {
            ...req.body,
            active: req.body.active !== undefined ? req.body.active : true
        };
        const tech = new Tech(techData);
        const savedTech = await tech.save();
        console.log(savedTech,"savedTech");
        
        res.status(201).json({
            success: true,
            result: savedTech,
            message: 'Tech created successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get all categories (with optional active filter)
exports.getAllTechs = async (req, res) => {
    try {
        const filter = {};
        if (req.query.active !== undefined) {
            filter.active = req.query.active === 'true';
        }
        const categories = await Tech.find(filter);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get active categories only
exports.getActiveTechs = async (req, res) => {
    try {
        const categories = await Tech.find({ active: true });
        // res.status(200).json(categories);
        // const categories = await Tech.find();
        res.status(200).json({
            success: true,
            result: categories,
            message: 'Techs fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get a single tech by ID
exports.getTechById = async (req, res) => {
    try {
        const tech = await Tech.findById(req.params.id);
        if (!tech) return res.status(404).json({ 
            success: false,
            error: 'Tech not found' 
        });
        res.status(200).json({
            success: true,
            result: tech,
            message: 'Tech fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Update a tech by ID
exports.updateTech = async (req, res) => {
    try {
        if (req.body.name) {
            const existing = await Tech.findOne({ name: req.body.name, _id: { $ne: req.params.id } }).collation({ locale: 'en', strength: 2 });
            if (existing) {
                return res.status(400).json({ success: false, error: 'Tech name must be unique (case-insensitive)' });
            }
        }
        const updateData = { ...req.body };
        
        // --- FIX: Map status to active ---
        if (req.body.status !== undefined) {
            updateData.active = req.body.status === "Active";
            delete updateData.status; // Remove status so it doesn't get saved as a field
        }
        // --- END FIX ---
        const updatedTech = await Tech.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedTech) {
            return res.status(404).json({ 
                success: false,
                error: 'Tech not found' 
            });
        }
        res.status(200).json({
            success: true,
            result: updatedTech,
            message: 'Tech updated successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Toggle tech active status
exports.toggleTechStatus = async (req, res) => {
    try {
        const tech = await Tech.findById(req.params.id);
        if (!tech) {
            return res.status(404).json({ error: 'Tech not found' });
        }
        
        tech.active = !tech.active;
        await tech.save();
        
        res.status(200).json({
            message: `Tech ${tech.active ? 'activated' : 'deactivated'} successfully`,
            tech
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tech by ID
exports.deleteTech = async (req, res) => {
    try {
        const deletedTech = await Tech.findByIdAndDelete(req.params.id);
        if (!deletedTech) return res.status(404).json({ 
            success: false,
            error: 'Tech not found' 
        });
        res.status(200).json({ 
            success: true,
            message: 'Tech deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}; 