import { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { apiUrl } from '../env';

export const MediaViewer = ({ media, onNavigate }) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	}, []);

	if (!media) {
		return (
			<Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Typography>No media selected</Typography>
			</Box>
		);
	}

	const handleFullscreen = () => {
		if (!document.fullscreenElement) {
			containerRef.current.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<Box sx={{ height: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box
				ref={containerRef}
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					position: 'relative',
					bgcolor: 'black',
					...(isFullscreen && {
						width: '100vw',
						height: '100vh',
						position: 'fixed',
						top: 0,
						left: 0,
						zIndex: 9999,
					}),
				}}
			>
				{media.type === 'image' ? (
					<img
						src={`${apiUrl}${media.url}`}
						alt="Media content"
						style={{
							maxWidth: '100%',
							maxHeight: '100%',
							objectFit: 'contain',
						}}
					/>
				) : (
					<video
						key={media.url}
						controls
						style={{
							maxWidth: '100%',
							maxHeight: '100%',
						}}
						preload="metadata"
						playsInline
					>
						<source src={media.url} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				)}

				{/* Navigation and fullscreen buttons */}
				<Box sx={{
					position: 'absolute',
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					px: 1,
					pointerEvents: 'none',
				}}>
					<IconButton
						onClick={() => onNavigate('prev')}
						sx={{
							bgcolor: 'rgba(0, 0, 0, 0.5)',
							color: 'white',
							'&:hover': {
								bgcolor: 'rgba(0, 0, 0, 0.7)',
							},
							pointerEvents: 'auto'
						}}
					>
						<NavigateBeforeIcon />
					</IconButton>
					<IconButton
						onClick={() => onNavigate('next')}
						sx={{
							bgcolor: 'rgba(0, 0, 0, 0.5)',
							color: 'white',
							'&:hover': {
								bgcolor: 'rgba(0, 0, 0, 0.7)',
							},
							pointerEvents: 'auto'
						}}
					>
						<NavigateNextIcon />
					</IconButton>
				</Box>

				{/* Fullscreen button */}
				{media.type === 'image' && (
					<IconButton
						onClick={handleFullscreen}
						sx={{
							position: 'absolute',
							bottom: 16,
							right: 16,
							bgcolor: 'rgba(0, 0, 0, 0.5)',
							color: 'white',
							'&:hover': {
								bgcolor: 'rgba(0, 0, 0, 0.7)',
							},
						}}
					>
						{isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
					</IconButton>
				)}
			</Box>
			<Typography variant="body2" color="text.secondary" align="center">
				Captured at: {new Date(media.timestamp).toLocaleString()}
			</Typography>
		</Box>
	);
};