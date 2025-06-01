import axios from 'axios';
import { env, apiUrl } from '../env';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Tabs, Tab, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { MediaViewer } from './MediaViewer';
import { TimelineSlider } from './TimelineSlider';
import { MediaList } from './MediaList';

// Create axios instance with base URL
const api = axios.create({
	baseURL: env === 'development' ? apiUrl : '',
	headers: {
		'Content-Type': 'application/json'
	}
});

export const Home = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTab, setSelectedTab] = useState('all');
	const [mediaList, setMediaList] = useState([]);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [dateRange, setDateRange] = useState({ min: new Date(), max: new Date() });
	const navigate = useNavigate();

	// Load initial date range
	useEffect(() => {
		api.get('/api/date-range')
			.then(response => {
				const range = {
					min: new Date(response.data.min),
					max: new Date(response.data.max)
				};
				setDateRange(range);
				setSelectedDate(range.max); // Start with the most recent date
			})
			.catch(error => {
				console.error('Error fetching date range:', error);
			});
	}, []);

	// Load images when date changes
	useEffect(() => {
		api.get('/api/images', {
			params: { date: selectedDate.toISOString() }
		})
			.then(response => {
				setMediaList(response.data);
				if (response.data.length > 0 && (!selectedMedia || !response.data.find(img => img.id === selectedMedia.id))) {
					setSelectedMedia(response.data[0]);
				}
			})
			.catch(error => {
				console.error('Error fetching images:', error);
			});
	}, [selectedDate, selectedMedia]);

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
		const filteredMedia = getFilteredMedia(newValue);
		if (filteredMedia.length > 0) {
			setSelectedMedia(filteredMedia[0]);
			setSelectedDate(new Date(filteredMedia[0].timestamp));
		}
	};

	const getFilteredMedia = (tab) => {
		if (tab === 'all') return mediaList;
		return mediaList.filter(item => item.type === tab);
	};

	const handleDateChange = (newDate) => {
		setSelectedDate(newDate);
		const filteredMedia = getFilteredMedia(selectedTab);

		// Only try to find closest media if there are any items
		if (filteredMedia && filteredMedia.length > 0) {
			const closest = filteredMedia.reduce((prev, curr) => {
				const prevDiff = Math.abs(new Date(prev.timestamp) - newDate);
				const currDiff = Math.abs(new Date(curr.timestamp) - newDate);
				return prevDiff < currDiff ? prev : curr;
			});
			setSelectedMedia(closest);
		} else {
			setSelectedMedia(null);
		}
	};

	const handleNavigateMedia = (direction) => {
		const filteredMedia = getFilteredMedia(selectedTab);
		const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
		let newIndex;

		if (direction === 'next') {
			newIndex = currentIndex + 1 >= filteredMedia.length ? 0 : currentIndex + 1;
		} else {
			newIndex = currentIndex - 1 < 0 ? filteredMedia.length - 1 : currentIndex - 1;
		}

		const newMedia = filteredMedia[newIndex];
		setSelectedMedia(newMedia);
		setSelectedDate(new Date(newMedia.timestamp));
	};

	const filteredMedia = getFilteredMedia(selectedTab);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Typography variant="h4" component="h1">
						Time Lense
					</Typography>
					<Button
						onClick={() => navigate('/live')}
						variant="contained"
						color="primary"
						startIcon={<VideoCameraFrontIcon />}
						sx={{
							borderRadius: 2,
							px: 3,
							py: 1,
							textTransform: 'none',
							fontSize: '1rem',
							boxShadow: 2,
							background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
							'&:hover': {
								background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
								boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
								transform: 'translateY(-1px)',
							},
							transition: 'all 0.2s ease-in-out',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							Live Preview
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor: '#4CAF50',
									boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.2)',
									animation: 'pulse 1.5s infinite',
									'@keyframes pulse': {
										'0%': {
											transform: 'scale(.95)',
											boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.3)',
										},
										'70%': {
											transform: 'scale(1)',
											boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)',
										},
										'100%': {
											transform: 'scale(.95)',
											boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
										},
									},
								}}
							/>
						</Box>
					</Button>
				</Box>
				<Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
					<Box sx={{ flex: 2 }}>
						<Paper sx={{ p: 2, mb: 2 }}>
							<MediaViewer
								media={selectedMedia}
								onNavigate={handleNavigateMedia}
							/>
						</Paper>
						<Paper sx={{ p: 2 }}>
							<TimelineSlider
								value={selectedDate}
								onChange={handleDateChange}
								minDate={dateRange.min}
								maxDate={dateRange.max}
							/>
						</Paper>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Paper sx={{ p: 2 }}>
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								variant="fullWidth"
								sx={{ mb: 2 }}
							>
								<Tab label="All" value="all" />
								<Tab label="Images" value="image" />
								<Tab label="Videos" value="video" />
							</Tabs>
							<MediaList
								media={filteredMedia}
								selectedMedia={selectedMedia}
								onSelectMedia={(media) => {
									setSelectedMedia(media);
									setSelectedDate(new Date(media.timestamp));
								}}
							/>
						</Paper>
					</Box>
				</Box>
			</Container>
		</LocalizationProvider>
	);
};