const User = require("../models/User");
const Job = require("../models/Job");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        const allJobs = await Job.find({});
        const usersWithJobCount = users.map((user) => {
            if (user.role === "client") {
                const jobsCount = allJobs.filter((job) => job.userId.toString() === user._id.toString()).length;
                return {
                    ...user._doc,
                    jobs_count: jobsCount,
                };
            }
            return {
                ...user._doc,
                jobs_count: 0,
            };
        });

        res.status(200).json(usersWithJobCount);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const updateUserPermissions = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const {permissions} = req.body
        if (!Array.isArray(permissions) || permissions.length < 1) {
            return res.status(400).json({ error: 'invalid permissions array' });
        }
        user.permissions = permissions
        await user.save()
        res.status(200).json({ message: 'Permissions updated successfully' });
    }catch (e) {
        res.status(500).send({error: e});
    }
}

const changeJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus } = req.body;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid job status' });
        }
        job.status = newStatus;
        await job.save();
        res.status(200).json({ message: 'Status changed successfully', job });
    } catch (e) {
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByIdAndDelete(id)
        if (!job){
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    }catch (e) {
        res.status(500).json({ error: 'Error deleting job' });
    }
}

const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error changing user role' });
    }
};


module.exports = {getUsers, updateUserPermissions,changeJobStatus,deleteJob,changeUserRole}