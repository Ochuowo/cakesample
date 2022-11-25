import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@tekkiesafrica.com',
		password: bcrypt.hashSync('pass123', 12),
		isAdmin: true,
		isConfirmed: true,
		avatar: '/images/icon_user.png'
	},
	{
		name: 'Nereah',
		email: 'nereah@tekkiesafrica.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png'
	},
	{
		name: 'Mabishi',
		email: 'mabishi@tekkiesafrica.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png'
	},
	{
		name: 'User',
		email: 'user@tekkiesafrica.com',
		password: bcrypt.hashSync('pass123', 12),
		isConfirmed: true,
		avatar: '/images/icon_user.png'
	},
];

export default users;
