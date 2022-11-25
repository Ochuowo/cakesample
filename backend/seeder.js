import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import lessons from './data/lessons.js';
import students from './data/students.js';
import teachers from './data/teachers.js';
import subjects from './data/subjects.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Token from './models/tokenModel.js';
import Lesson from './models/lessonModel.js';
import Student from './models/studentModel.js';
import Teacher from './models/teacherModel.js';
import Subject from './models/subjectModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
	try {
		// delete all the current data in all eight collections
		await User.deleteMany();
		await Product.deleteMany();
		await Order.deleteMany();
		await Token.deleteMany();
		await Lesson.deleteMany();
		await Student.deleteMany();
		await Teacher.deleteMany();
		await Subject.deleteMany();

		// create an array of objects to seed into the DB
		const newUsers = await User.insertMany(users);

		// get the admin user document's id
		const adminUser = newUsers[0]._id;

		// add this admin user as the user that added all these products into the DB
		const sampleProducts = products.map((product) => ({
			...product,
			user: adminUser,
		}));

		await Product.insertMany(sampleProducts);
		await Lesson.insertMany(lessons);
		await Student.insertMany(students);
		await Teacher.insertMany(teachers);
		await Subject.insertMany(subjects);

		console.log('Data inserted in to the DB'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(`Error: ${err.message}`.red.inverse);
	}
};

const destroyData = async () => {
	try {
		// delete all the current data in all eight collections
		await User.deleteMany();
		await Product.deleteMany();
		await Order.deleteMany();
		await Token.deleteMany();
		await Lesson.deleteMany();
		await Student.deleteMany();
		await Teacher.deleteMany();
		await Subject.deleteMany();

		console.log('Data deleted from the DB'.red.inverse);
		process.exit();
	} catch (err) {
		console.error(`Error: ${err.message}`.red.inverse);
	}
};

// check the npm flag and call appropriate function
if (process.argv[2] === '-d') destroyData();
else importData();
