import React from 'react';
import {View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

interface WaveformRendererProps {
	waveformData: Array<{min: number, max:number}>
	width: number
	height: number
	color: string
	playedColor: string
	progress: number
}

const WaveformRenderer = ({
	waveformData,
	width,
	height,
	color = '#4a69bd',
	playedColor = '#e74c3c',
	progress = 0 // percentage of the track that has been played (0 to 1)
}: WaveformRendererProps) => {

	const barWidth = width / waveformData.length;
	const progressWidth = width * progress;

	return (
		<View>
			<Svg width={width} height={height}>
				{waveformData.map(({ min, max }, index) => {
					const x = index * barWidth;
					const amplitude = Math.abs(max - min); // Use absolute difference
					const barHeight = Math.max(1, height * amplitude); // Ensure minimum height of 1
					const y = height / 2 - barHeight / 2; // Center the bar vertically

					// Determine if this bar should use the played or unplayed color
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