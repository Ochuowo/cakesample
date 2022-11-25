import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			// required: true,
		},
		isConfirmed: {
			type: Boolean,
			required: true,
			default: false,
		},
		avatar: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true
		},
		Age: {
			type: String,
			required: true
		},
		subjectId: {
			type: String,
			required: true
		},
		salary: {
			type: String,
			required: true
		},
		// one of the following 4 will be filled, or the password field will be used
		googleID: {
			type: String,
		},
		githubID: {
			type: String,
		},
		twitterID: {
			type: String,
		},
		facebookID: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// function to check if passwords are matching
teacherSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password before saving
teacherSchema.pre('save', async function (next) {
	const teacher = this;
	if (!teacher.isModified('password')) {
		return next();
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(teacher.password, salt);
	teacher.password = hash;
	next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
