import Rating from "../model/ratings.js";

export const postRating = async (req, res) => {
    const { rating, comment, resturant, user } = req.body;

    try {
        const ratings = await Rating.create({
            rating: rating,
            comment: comment,
            resturant: resturant,
            user: user
        })

        if (ratings) {
            return res
                .status(200)
                .send({ message: "Rating added successfully" });
        } else {
            return res.status(400).send({ error: "Rating not posted" });
        }
    } catch (error) {
        return res.status(400).send({ error: error });
    }
}