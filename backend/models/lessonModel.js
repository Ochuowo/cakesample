import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

	},
	{
		timestamps: true,
	}
);

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
