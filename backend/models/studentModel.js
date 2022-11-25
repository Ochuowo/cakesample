import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = mongoose.Schema(
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
			required: true,
		},
		age: {
			type: String,
			required: true,
		},
		lessonId: {
			type: String,
			required: true,
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
studentSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password before saving
studentSchema.pre('save', async function (next) {
	const student = this;
	if (!student.isModified('password')) {
		return next();
	}
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(student.password, salt);
	student.password = hash;
	next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
