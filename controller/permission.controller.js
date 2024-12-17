const User = require("../models/User");


const togglePermission = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const {permissions} = req.body;
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ error: 'No permissions provided or invalid format' });
        }
        user.permissions = permissions
        await user.save();
        return res.status(200).json({ message: 'Permissions updated successfully', user });
    }catch (e) {
        return res.status(500).json({error: e})
    }
}


module.exports = {togglePermission}
