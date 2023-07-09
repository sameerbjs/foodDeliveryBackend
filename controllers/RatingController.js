import Rating from "../model/ratings.js";
import Resturant from "../model/resturant.js";
import User from "../model/user.js";

export const postRating = async (req, res) => {
    try {
        const { resturant, rating, comment, user } = req.body;

        // Create a new rating
        const newRating = new Rating({
            rating: rating,
            comment: comment,
            resturant: resturant,
            user: user
        });

        // Save the rating to the database
        let savedRating = await newRating.save();
        savedRating.populate('user','name profilePic');
        // Find the corresponding restaurant and update its ratings array
        const restaurant = await Resturant.findById(resturant);
        restaurant.ratings.push(savedRating._id);
        await restaurant.save();

        res.status(200).send({ message: 'Rating created successfully', data: savedRating });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create rating' });
    }
}


export const getRating = async (req, res) => {
    try {
        const { id } = req.params
        const ratings = await Rating.find({ resturant: id }).populate('user','name');
        res.status(200).send({ ratings: ratings })
    } catch (error) {
        res.status(500).send({ error: 'Failed to get rating' });
    }
}

export const deleteComments = async (req, res) => {
    try {
        await Rating.findByIdAndDelete(req.params.id);
        return res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};