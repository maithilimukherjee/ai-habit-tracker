import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';

//get habits

export const getHabits = async (req, res) =>
{
    try
    {
        const { includeArchived } = req.query;
        const filter = { user: req.user._id };

        if(includeArchived !== 'true')
        {
            filter.isArchived = false;
        }

        const habits = await Habit.find(filter).sort({ order: 1, createdAt: 1});
        res.json(habits);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

//create habit
export const createHabit = async (req, res) =>
{
    try
    {
        const { name, description, category, frequency, targetDays, color, icon } = req.body;

        if(!name || name.trim() === "")
        {
            return res.status(400).json({ message: "Please enter a habit name" });
        }

        const count = await Habit.countDocuments({ user: req.user._id });

        const habit = new Habit({
            user: req.user._id,
            name: name.trim(),
            description: description ? description.trim() : "",
            category,
            frequency,
            targetDays,
            color,
            icon,
            order: count
        });

        await habit.save();
        res.status(201).json(habit);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }   
};

//update habit
export const updateHabit = async (req, res) =>
{
    try
    {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

        if(!habit)
        {
            return res.status(404).json({ message: "Habit not found" });
        }

        const fields = ['name', 'description', 'category', 'frequency', 'targetDays', 'color', 'icon', 'order'];

        for (const f of fields)
        {
            if (req.body[f] !== undefined)
            {
                habit[f] = req.body[f];
            }
        }

        await habit.save();
        res.json(habit);    
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHabit = async (req, res) =>
{
    try
    {
        const habit = await Habit.findOneAndDelete(
            {
                _id: req.params.id,
                user: req.user._id
            }
        );

        if(!habit)
        {
            return res.status(404).json({ message: "Habit not found" });
        }

        await HabitLog.deleteMany({ habitId: habit._id, userId: req.user._id });
        res.json({ message: "Habit deleted successfully" });
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const archiveHabit = async (req, res) =>
{
    try
    {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

        if(!habit)
        {
            return res.status(404).json({ message: "Habit not found" });
        }

        habit.isArchived = !habit.isArchived;
        await habit.save();
        res.json(habit);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const reorderHabits = async (req, res) =>
{
    try
    {
        const { order } = req.body;

        if(!Array.isArray(order))
        {
            return res.status(400).json({ message: "Order must be an array of habit IDs" });
        }

        await Promise.all(order.map((id, idx) =>
            Habit.updateOne(
                { _id: id, user: req.user._id },
                { $set: { order: idx } }
            )
        ));

        res.json({ message: "Reordered"});
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};