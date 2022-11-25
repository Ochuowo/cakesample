import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { CakeSharp, School, Class, People, Person } from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Burger } from '../../components/UI/burger';
import './navbar.scss';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		// display: 'flex'
	},
	// drawer
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	// upper bar
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth
		},
		backgroundColor: '#2c3e50',
		color: 'White'
	},
	// toggle button
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		},
		color: 'white'
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	// edit drawer styles
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: '#2c3e50'
	},
	// content: {
	// 	flexGrow: 1,
	// 	padding: theme.spacing(3)
	// }
	content: {
		[theme.breakpoints.up('sm')]: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`
		}
	}
}));

function ResponsiveDrawer(props) {
	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	const [ mobileOpen, setMobileOpen ] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<Burger/>
			<List>
				{[ 'About', 'Subjects', 'Teachers', 'Lessons', 'Students' ].map((text, index) => (
					<NavLink to={`/${text}`} activeClassName='navActive' className='navItemLink' key={index}>
						<ListItem button key={text}>
							<ListItemIcon>
								{text === 'About' ? (
                  					<CakeSharp />
                				) : text === 'Subjects' ? (
									<School />
								) : text === 'Lessons' ? (
									<Class />
								) : text === 'Teachers' ? (
									<Person />
								) : text === 'Students' ? (
									<People />
								) : null}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					</NavLink>
				))}
			  </List>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<nav className={classes.drawer} aria-label='mailbox folders'>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation='css'>
					<Drawer
						container={container}
						variant='temporary'
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper
						}}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation='css'>
					<Drawer
						classes={{
							paper: classes.drawerPaper
						}}
						variant='permanent'
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />

				{/* my app content */}

				<div className='appBody'>
					<div className='container'>{props.children}</div>
				</div>
			</main>
		</div>
	);
}

ResponsiveDrawer.propTypes = {
	/**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
	window: PropTypes.func
};

export default ResponsiveDrawer;
