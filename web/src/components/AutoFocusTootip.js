import { Fragment } from 'react';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Typography,
	IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const AutoFocusTootip = ({ }) => {
	return (
		<Tooltip title={
			<Fragment>
				<Typography color="inherit">Moves the lens to a fixed focal distance, normally given in dioptres (units of 1 / distance in metres).</Typography>
				<Typography color="inherit" sx={{ mt: 1 }}>For example:</Typography>
				<List sx={{ pl: 0.5 }}>
					<ListItem sx={{ py: 0 }}>
						<ListItemIcon sx={{ minWidth: 28 }}>
							<FiberManualRecordIcon sx={{ fontSize: 10, color: 'text.secondary' }} />
						</ListItemIcon>
						<ListItemText
							primary="0 moves the lens to infinity."
							primaryTypographyProps={{ color: 'inherit', sx: { m: 0 } }}
						/>
					</ListItem>
					<ListItem sx={{ py: 0 }}>
						<ListItemIcon sx={{ minWidth: 28 }}>
							<FiberManualRecordIcon sx={{ fontSize: 10, color: 'text.secondary' }} />
						</ListItemIcon>
						<ListItemText
							primary="0.5 moves the lens to focus on objects 2m away."
							primaryTypographyProps={{ color: 'inherit' }}
						/>
					</ListItem>
					<ListItem sx={{ py: 0 }}>
						<ListItemIcon sx={{ minWidth: 28 }}>
							<FiberManualRecordIcon sx={{ fontSize: 10, color: 'text.secondary' }} />
						</ListItemIcon>
						<ListItemText
							primary="2 moves the lens to focus on objects 50cm away."
							primaryTypographyProps={{ color: 'inherit' }}
						/>
					</ListItem>
				</List>
			</Fragment>
		}>
			<IconButton>
				<InfoIcon />
			</IconButton>
		</Tooltip>
	);
};