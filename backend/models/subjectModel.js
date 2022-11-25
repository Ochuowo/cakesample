import mongoose from 'mongoose';

// a schema for storing reviews for each product
const reviewsSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: { type: String, required: true },
		avatar: { type: String, required: true },
		rating: { type: Number, required: true, default: 0 },
		review: { type: String, required: true },
	},
	{ timestamps: true }
);

const subjectSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
