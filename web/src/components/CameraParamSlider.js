import { Controller } from 'react-hook-form';
import {
	Box,
	Slider,
	Checkbox,
	Typography,
	FormControl,
	FormControlLabel,
	TextField,
} from '@mui/material';

export const CameraParamSlider = ({
	min,
	max,
	step,
	name,
	title,
	control,
	isChecked,
	resetField,
	setChcekbox,
	defaultValue,
}) => {
	return (
		<FormControl fullWidth sx={{ mt: 1 }}>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<>
						{isChecked !== undefined && (
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<Typography variant="h6" gutterBottom>{title}</Typography>
								<FormControlLabel
									control={<Checkbox checked={isChecked} onChange={(e) => {
										setChcekbox(e.target.checked);
										if (e.target.checked) {
											resetField(name);
										}
									}} />}
									label="Auto"
									labelPlacement="start"
									sx={{ ml: 2 }}
								/>
							</Box>
						)}
						{name === 'shutterSpeed' && (
							<TextField
								label="Shutter Speed (seconds)"
								type="number"
								inputProps={{
									min: 0.01,
									max: 25,
									step: 0.01,
								}}
								{...field}
								disabled={isChecked}
								value={field.value}
								fullWidth
								sx={{ my: 2 }}
							/>
						)}
						<Slider
							{...field}
							value={field.value}
							name={name}
							min={min}
							max={max}
							step={step}
							defaultValue={defaultValue}
							marks={name === 'shutterSpeed' ?
								[
									{ value: min, label: min },
									{ value: 5, label: 5 },
									{ value: 10, label: 10 },
									{ value: 15, label: 15 },
									{ value: 20, label: 20 },
									{ value: defaultValue, label: defaultValue },
									{ value: max, label: max }
								] :
								[
									{ value: min, label: min },
									{ value: defaultValue, label: defaultValue },
									{ value: max, label: max }
								]
							}
							valueLabelDisplay="auto"
							disabled={isChecked !== undefined ? isChecked : false}
							sx={{ mb: 2 }}
						/>
						<Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
							Current: {name === 'shutterSpeed' ? field.value < 1 ? `1/${Math.floor(10 / field.value)}s` : `${field.value}s` : field.value}
						</Typography>
					</>
				)}
			/>
		</FormControl>
	);
};