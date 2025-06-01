import axios from 'axios';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	IconButton,
	Paper,
	Container,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { CameraParamSlider } from './CameraParamSlider';
import { AutoFocusTootip } from './AutoFocusTootip';
import { env, apiUrl, uwiHost } from '../env';

export const LivePreview = () => {
	const [qualityAutoCheckbox, setQualityAutoCheckbox] = useState(true);
	const [sharpnessAutoCheckbox, setSharpnessAutoCheckbox] = useState(true);
	const [contrastAutoCheckbox, setContrastAutoCheckbox] = useState(true);
	const [saturationAutoCheckbox, setSaturationAutoCheckbox] = useState(true);
	const [brightnessAutoCheckbox, setBrightnessAutoCheckbox] = useState(true);
	const [isoAutoCheckbox, setIsoAutoCheckbox] = useState(true);
	const [shutterSpeedAutoCheckbox, setShutterSpeedAutoCheckbox] = useState(true);
	const [imageTimestamp, setImageTimestamp] = useState(Date.now());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const defaultValues = {
		exposure: 'auto',
		exposureValue: 0,
		whiteBalance: 'auto',
		autofocusMode: 'auto',
		lensPosition: 'default',
		lensPositionNumber: 1,
		quality: 100,
		sharpness: 1,
		contrast: 1,
		saturation: 1,
		brightness: 0,
		// iso: 450,
		shutterSpeed: 0.01,
	};

	const {
		watch,
		control,
		getValues,
		setValue,
		resetField,
	} = useForm({
		defaultValues,
		mode: "onChange"
	});

	const isManualFocus = watch('autofocusMode') === 'manual';
	const isLensPosition = watch('lensPosition') === 'number';
	const isCustomExposure = watch('exposure') === 'custom';

	const handleCapture = async () => {
		setIsSubmitting(true);
		const values = getValues();

		// Create axios instance with base URL
		const api = axios.create({
			baseURL: env === 'development' ? apiUrl : '',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		api.post('/api/image-tuning', values)
			.then(function (response) {
				if (response.status === 200) {
					setImageTimestamp(Date.now())
					setIsSubmitting(false);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<IconButton
				onClick={() => navigate('/')}
				sx={{
					position: 'absolute',
					top: 16,
					right: 16,
					bgcolor: 'rgba(0, 0, 0, 0.5)',
					color: 'white',
					'&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
					zIndex: 2,
				}}
			>
				<CloseIcon />
			</IconButton>
			<Paper sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'black', p: 2 }}>

				<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100vh - 150px)' }}>
					{/* Live Preview Section */}
					<Box sx={{ flex: 2, position: 'relative', minWidth: 0 }}>
						<img key={imageTimestamp} src={`${uwiHost}/camera/test-image.jpg`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								p: 2,
								display: 'flex',
								justifyContent: 'center',
								bgcolor: 'rgba(0, 0, 0, 0.5)',
							}}
						>
							<Button
								variant="contained"
								color="primary"
								startIcon={<PhotoCameraIcon />}
								onClick={handleCapture}
								disabled={isSubmitting}
								sx={{ px: 4, py: 1.5 }}
							>
								Capture
							</Button>
						</Box>
					</Box>

					<Box sx={{ flex: 1, bgcolor: 'background.paper', p: 3, ml: { md: 3 }, mt: { xs: 3, md: 0 }, borderRadius: 2, boxShadow: 2, minWidth: 280, maxWidth: 350, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', maxHeight: '100%', overflowY: 'auto' }}>
						{/* Exposure Form Section */}
						<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Exposure</Typography>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<Controller
								name="exposure"
								control={control}
								render={({ field }) => (
									<>
										<InputLabel id="exposure-select-label">Exposure</InputLabel>
										<Select
											{...field}
											labelId="exposure-select-label"
											label="Exposure"
											value={field.value}
											onChange={(e) => {
												setValue('exposure', e.target.value);
											}}
										>
											<MenuItem value="auto">Auto</MenuItem>
											<MenuItem value="normal">Normal</MenuItem>
											<MenuItem value="long">Long</MenuItem>
											<MenuItem value="custom">Custom</MenuItem>
										</Select>
									</>
								)}
							/>
						</FormControl>

						{/* Custom Exposure Value */}
						{isCustomExposure && (
							<CameraParamSlider
								min={-10}
								max={10}
								step={0.1}
								name="exposureValue"
								title="Exposure Value"
								control={control}
								defaultValue={0}
							/>
						)}

						{/* White Balance Form Section */}
						<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>White Balance</Typography>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<Controller
								name="whiteBalance"
								control={control}
								render={({ field }) => (
									<>
										<InputLabel id="white-balance-select-label">White Balance</InputLabel>
										<Select
											{...field}
											labelId="white-balance-select-label"
											value={field.value}
											label="White Balance"
											onChange={(e) => {
												setValue('whiteBalance', e.target.value);
											}}
										>
											<MenuItem value="auto">Auto (2500K - 3000K)</MenuItem>
											<MenuItem value="incadescent">Incadescent (2500K - 3000K)</MenuItem>
											<MenuItem value="tungsten">Tungsten (3000K ~ 3500K)</MenuItem>
											<MenuItem value="fluorescent">Fluorescent (4000K - 4700K)</MenuItem>
											<MenuItem value="indoor">Indoor (3000K - 5000K)</MenuItem>
											<MenuItem value="daylight">Daylight (5500K - 6500K)</MenuItem>
											<MenuItem value="cloudy">Cloudy (7000K - 8500K)</MenuItem>
											<MenuItem value="custom">Custom</MenuItem>
										</Select>
									</>
								)}
							/>
						</FormControl>

						{/* Autofocus Mode Form Section */}
						<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
							Autofocus Mode
							<AutoFocusTootip />
						</Typography>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<Controller
								name="autofocusMode"
								control={control}
								render={({ field }) => (
									<>
										<InputLabel id="autofocus-mode-select-label">Autofocus Mode</InputLabel>
										<Select
											{...field}
											labelId="autofocus-mode-select-label"
											value={field.value}
											label="Autofocus Mode"
											onChange={(e) => {
												setValue('autofocusMode', e.target.value);
											}}
										>
											<MenuItem value="auto">Auto</MenuItem>
											<MenuItem value="default">Default</MenuItem>
											<MenuItem value="manual">Manual</MenuItem>
											<MenuItem value="continuous">Continuous</MenuItem>
										</Select>
									</>
								)}
							/>
						</FormControl>

						{isManualFocus && (
							<>
								<FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
									<Controller
										name="lensPosition"
										control={control}
										render={({ field }) => (
											<>
												<InputLabel id="manual-autofocus-select-label">Lens Position</InputLabel>
												<Select
													{...field}
													labelId="manual-autofocus-select-label"
													value={field.value}
													label="Lens Position"
													onChange={(e) => {
														setValue('lensPosition', e.target.value);
													}}
												>
													<MenuItem value="0.0">0</MenuItem>
													<MenuItem value="number">Number</MenuItem>
													<MenuItem value="default">Default</MenuItem>
												</Select>
											</>
										)}
									/>
								</FormControl>
								{isManualFocus && isLensPosition && (
									<CameraParamSlider
										min={0}
										max={32}
										step={0.1}
										name="lensPositionNumber"
										title="Lens Position"
										control={control}
										defaultValue={1}
									/>
								)}
							</>
						)}

						{/* Quality Form Section */}
						<CameraParamSlider
							min={0}
							max={100}
							step={1}
							name="quality"
							title="Quality"
							control={control}
							isChecked={qualityAutoCheckbox}
							resetField={resetField}
							setChcekbox={setQualityAutoCheckbox}
							defaultValue={100}
						/>

						{/* Sharpness Form Section */}
						<CameraParamSlider
							min={0}
							max={16}
							step={0.1}
							name="sharpness"
							title="Sharpness"
							control={control}
							isChecked={sharpnessAutoCheckbox}
							resetField={resetField}
							setChcekbox={setSharpnessAutoCheckbox}
							defaultValue={1}
						/>

						{/* Contrast Form Section */}
						<CameraParamSlider
							min={0}
							max={32}
							step={0.1}
							name="contrast"
							title="Contrast"
							control={control}
							isChecked={contrastAutoCheckbox}
							resetField={resetField}
							setChcekbox={setContrastAutoCheckbox}
							defaultValue={1}
						/>

						{/* Saturation Form Section */}
						<CameraParamSlider
							min={0}
							max={32}
							step={0.1}
							name="saturation"
							title="Saturation"
							control={control}
							isChecked={saturationAutoCheckbox}
							resetField={resetField}
							setChcekbox={setSaturationAutoCheckbox}
							defaultValue={1}
						/>

						{/* Brightness Form Section */}
						<CameraParamSlider
							min={-1}
							max={1}
							step={0.1}
							name="brightness"
							title="Brightness"
							control={control}
							isChecked={brightnessAutoCheckbox}
							resetField={resetField}
							setChcekbox={setBrightnessAutoCheckbox}
							defaultValue={0}
						/>

						{/* ISO Form Section */}
						{/* <CameraParamSlider
							min={100}
							max={800}
							step={1}
							name="iso"
							title="ISO"
							control={control}
							isChecked={isoAutoCheckbox}
							resetField={resetField}
							setChcekbox={setIsoAutoCheckbox}
							defaultValue={450}
						/> */}

						{/* Shutter Speed Form Section */}
						<CameraParamSlider
							min={0.01} // in milliseconds (min 100ms)
							max={25} // in milliseconds (max 25000000ms)
							step={0.01}
							name="shutterSpeed"
							title="Shutter Speed"
							control={control}
							isChecked={shutterSpeedAutoCheckbox}
							resetField={resetField}
							setChcekbox={setShutterSpeedAutoCheckbox}
							defaultValue={0.01}
						/>

						<Button variant="contained" color="secondary" sx={{ my: 2 }}>
							Save
						</Button>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};