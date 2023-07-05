import Order from "../model/order.js";
import Product from "../model/products.js";
import User from "../model/user.js";

export const placeOrder = async (req, res) => {
    try {
        const { userId, products, city, address, phone, price } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ success: false, error: 'User not found' });
        }

        // Create an array to store ordered items
        const orderedItems = [];

        for (const productData of products) {
            const { productId, quantity, totalPrice } = productData;

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({ success: false, error: 'Product not found' });
            }

            const orderedItem = {
                product: productId,
                quantity: quantity,
                totalPrice: totalPrice,
            };

            orderedItems.push(orderedItem);
        }

        const order = new Order({
            user: userId,
            city: city,
            address: address,
            phone: phone,
            products: orderedItems,
            status: 'Pending',
            overAllPrice: price
        });

        await order.save();
        res.status(200).send({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Failed to place order' });
    }
}

export const getResturantAllOrders = async (req, res) => {
    const { status } = req.query;
    const { id } = req.params;

    let orders;
    if (status) {
        orders = await Order.find({ status: status }).populate({
            path: "products.product",
            match : {rest_id : id}
        });
        res.status(200).send({ orders })
    } else {
        orders = await Order.find({}).populate({
            path: "products.product",
            match : {rest_id : id}
        });
        res.status(200).send({ orders })
    }
}

export const getOrderDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('user').populate('products.product');
        res.status(200).send({ order });
    } catch (error) {
        res.status(400).send({ error: error })
    }
}

export const changeOrderStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }

        const { data } = req.body;
        await Order.findByIdAndUpdate(
            id,
            {
                status: data
            },
            { new: true }
        );

        res.status(200).send({ message: 'Status update successfully' });
    } catch (error) {
        res.status(400).send({ error: error })
    }
}

export const getOrderById = async (req, res) => {
    const { rest_id, search, status } = req.query;
    try {
        const filter = {
            $expr: {
                $regexMatch: {
                    input: { $toString: '$_id' },
                    regex: search,
                    options: 'i',
                },
            },
        };

        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter).populate({ path: "products.product", match: { rest_id: rest_id } });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Interval server error', err: error.message });
    }
};

export const getUserAllOrders = async (req, res) => {
    const { status } = req.query;
    const { id } = req.params;
    let orders;
    if (status) {
        orders = await Order.find({ user: id, status: status }).populate("products.product");
        res.status(200).send({ orders })
    } else {
        orders = await Order.find({ user: id }).populate("products.product");
        res.status(200).send({ orders })
    }
}