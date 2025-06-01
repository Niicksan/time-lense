import {
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Typography,
	Box,
	Chip,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/VideoFile';

export const MediaList = ({ media, selectedMedia, onSelectMedia }) => {
	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h6">
					Media Library
				</Typography>
				<Chip
					label={`${media.length} items`}
					size="small"
					color="primary"
				/>
			</Box>
			<List sx={{ maxHeight: 500, overflow: 'auto' }}>
				{media.map((item) => (
					<ListItem
						key={item.id}
						disablePadding
						sx={{ mb: 1 }}
					>
						<ListItemButton
							selected={selectedMedia?.id === item.id}
							onClick={() => onSelectMedia(item)}
							sx={{
								borderRadius: 1,
								'&.Mui-selected': {
									backgroundColor: 'primary.main',
									'&:hover': {
										backgroundColor: 'primary.dark',
									},
								},
							}}
						>
							<ListItemAvatar>
								<Avatar
									sx={{
										bgcolor: item.type === 'image' ? 'success.main' : 'secondary.main',
									}}
								>
									{item.type === 'image' ? <ImageIcon /> : <VideoIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography>
											{item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.id}
										</Typography>
										<Chip
											label={item.type}
											size="small"
											color={item.type === 'image' ? 'success' : 'secondary'}
											sx={{ height: 20 }}
										/>
									</Box>
								}
								secondary={new Date(item.timestamp).toLocaleString()}
								secondaryTypographyProps={{
									sx: {
										color: selectedMedia?.id === item.id ? 'white' : 'text.secondary',
									},
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</>
	);
};