import bcrypt from 'bcryptjs';

const teachers = [
	{
		firstName: 'Mandela',
		lastName: 'Nelson',
		email: 'mandela@gmail.com',
		password: bcrypt.hashSync('mandela', 12),
		gender: 'Male',
		Age: 95,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
		subjectId: 'baking',
		salary: 5000
	},
	{
		firstName: 'Sankara',
		lastName: 'Thomas',
		email: 'sankara@burkina.com',
		password: bcrypt.hashSync('mandela', 12),
		gender: 'Male',
		Age: 35,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
		subjectId: 'preps',
		salary: 400
	},
	{
		firstName: 'Kwame',
		lastName: 'Mkurumah',
		email: 'nkurumah@ghana.com',
		password: bcrypt.hashSync('mandela', 12),
		gender: 'Male',
		Age: 55,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
		subjectId: 'deco',
		salary: 10000
	},
];

export default teachers;
