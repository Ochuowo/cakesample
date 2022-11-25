import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
	{
		// add a reference to the corresponding user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		orderItems: [
			{
				qty: { type: Number, required: true, default: 0 },
				name: { type: String, required: true },
				price: { type: Number, required: true, default: 0 },
				image: { type: String, required: true },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: 'Product',
				},
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			houseNumber: { type: String, required: true },
			building: { type: String, required: true },
			mobile: { type: String, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		// depends on if stripe or paypal method is used
		paymentResult: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email_address: { type: String },
		},
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		totalPaid: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isDelivered: {
			type: Boolean,
			default: false,
		},
		totalBalance: {
			type: Number,
			required: true,
			default: 0.0,
		},
		paidAt: {
			type: Date,
		},
		deliveredAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
