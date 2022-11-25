import bcrypt from 'bcryptjs';

const students = [
	{
		firstName: 'Kinje',
		lastName: 'Ketille',
		email: 'ketille@gmail.com',
		password: bcrypt.hashSync('kinje', 12),
		gender: 'Female',
		age: 21,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
		lessonId: '02',
	},
	{
		firstName: 'Shaka',
		lastName: 'Zulu',
		email: 'shaka@gmail.com',
		password: bcrypt.hashSync('zulu', 12),
		gender: 'Male',
		age: 41,
		isConfirmed: false,
		avatar: '/images/icon_user.png',
		lessonId: '01',
	},
	{
		firstName: 'Argwings',
		lastName: 'Kodek',
		email: 'kodek@live.com',
		password: bcrypt.hashSync('kodek', 12),
		gender: 'Male',
		age: 21,
		isConfirmed: true,
		avatar: '/images/icon_user.png',
		lessonId: '02',
	},
];

export default students;
