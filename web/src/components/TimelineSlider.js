import React from 'react';
import dayjs from 'dayjs';
import { Box, Slider, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export const TimelineSlider = ({ value, onChange, minDate, maxDate }) => {
	// Handle date picker change (day only)
	const handleDatePickerChange = (newValue) => {
		const newDate = new Date(value);
		const selectedDate = newValue.toDate();
		newDate.setFullYear(selectedDate.getFullYear());
		newDate.setMonth(selectedDate.getMonth());
		newDate.setDate(selectedDate.getDate());
		onChange(newDate);
	};

	// Handle slider change (time within day)
	const handleSliderChange = (_, newValue) => {
		// Prevent slider from going beyond 23:59 (1439 minutes)
		if (newValue >= 1440) {
			return;
		}
		const newDate = new Date(value);
		const hours = Math.floor(newValue / 60);
		const minutes = newValue % 60;
		newDate.setHours(hours, minutes, 0, 0);
		onChange(newDate);
	};

	// Convert current time to minutes for slider
	const timeToMinutes = (date) => {
		return date.getHours() * 60 + date.getMinutes();
	};

	// Format minutes to time string
	const formatTimeLabel = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
	};

	return (
		<Box sx={{ width: '100%', px: 2 }}>
			<Box sx={{ mb: 2 }}>
				<DatePicker
					label="Select Date"
					value={dayjs(value)}
					onChange={handleDatePickerChange}
					minDate={dayjs(minDate)}
					maxDate={dayjs(maxDate)}
					sx={{ width: '100%' }}
					// Show only the date picker, no time selection
					views={['year', 'month', 'day']}
					// Format to show only the date
					format="YYYY-MM-DD"
				/>
			</Box>
			<Box>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					Time: {formatTimeLabel(timeToMinutes(value))}
				</Typography>
				<Slider
					value={timeToMinutes(value)}
					onChange={handleSliderChange}
					min={0}
					max={1439} // 23 hours and 59 minutes
					step={1} // 15 minutes steps
					marks={[
						{ value: 0, label: '00:00' },
						{ value: 360, label: '06:00' },
						{ value: 720, label: '12:00' },
						{ value: 1080, label: '18:00' },
						{ value: 1439, label: '23:59' }
					]}
					valueLabelDisplay="auto"
					valueLabelFormat={formatTimeLabel}
					sx={{
						'& .MuiSlider-thumb': {
							// Prevent the thumb from going beyond the end of the track
							'&:after': {
								content: '""',
								position: 'absolute',
								width: '100%',
								height: '100%',
								borderRadius: '50%',
							},
						},
					}}
				/>
			</Box>
		</Box>
	);
};