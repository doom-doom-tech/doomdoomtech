import React from 'react';
import {View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

interface WaveformRendererProps {
	waveformData: Array<{ min: number; max: number }>;
	width: number;
	height: number;
	color?: string;
	playedColor?: string;
	progress?: number;
}

const WaveformRenderer = ({
							  waveformData,
							  width,
							  height,
							  color = '#4a69bd',
							  playedColor = '#e74c3c',
							  progress = 0,
						  }: WaveformRendererProps) => {
	const barWidth = width / waveformData.length;
	const progressWidth = width * progress;

	// Transformation exponent (0.5 = square root); adjust this for more/less compression
	const gamma = 0.5;

	// Step 1: Calculate raw amplitudes
	const amplitudes = waveformData.map(({ min, max }) => Math.abs(max - min));

	// Step 2: Apply transformation to compress dynamic range
	const transformedAmps = amplitudes.map(amp => Math.pow(amp, gamma));

	// Step 3: Find the maximum transformed amplitude
	const maxTransformedAmp = Math.max(...transformedAmps);

	// Step 4: Calculate scaling factor based on transformed max
	const scalingFactor = maxTransformedAmp > 0 ? height / maxTransformedAmp : 0;

	return (
		<View style={{ opacity: 1 }}>
			<Svg width={width} height={height}>
				{waveformData.map(({ min, max }, index) => {
					const x = index * barWidth;
					const amplitude = Math.abs(max - min);
					const transformedAmp = Math.pow(amplitude, gamma);

					// Step 5: Compute bar height with transformation and scaling
					const barHeight = Math.max(1, transformedAmp * scalingFactor);

					// Center the bar vertically
					const y = height / 2 - barHeight / 2;

					const barColor = x < progressWidth ? playedColor : color;

					return (
						<Rect
							key={index}
							x={x}
							y={y}
							width={barWidth * 0.8}
							height={barHeight}
							fill={barColor}
						/>
					);
				})}
			</Svg>
		</View>
	);
};

export default WaveformRenderer;