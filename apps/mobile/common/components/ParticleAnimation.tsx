import React, {useCallback, useEffect, useState} from 'react'
import {Animated, DeviceEventEmitter, Dimensions, StyleSheet, View} from 'react-native'

export const PARTICLE_EVENT = 'particle:trigger';

interface ParticleEventData {
    element: React.ReactElement;
    burstCount?: number; // Allow dynamic burst count
}

interface Particle {
    id: number;
    startX: number;
    y: Animated.Value;
    opacity: Animated.Value;
    scale: number;
    delay: number;
    fadeDelay: number;
}

interface ParticleEmojiProps {
    defaultBurstCount?: number;
}

const ParticleAnimation: React.FC<ParticleEmojiProps> = ({ defaultBurstCount = 30 }) => {
    const [particleElement, setParticleElement] = useState<React.ReactElement | null>(null);
    const [particles, setParticles] = useState<Particle[]>([]);
    const { width, height } = Dimensions.get('window');

    const createBurst = useCallback((amount: number) => {
        return Array(amount).fill(null).map((_, index) => {
            const horizontalSpread = width * 0.8;
            const startX = (width * 0.1) + (Math.random() * horizontalSpread);
            const verticalVariance = 150;
            const startY = height - (50 + Math.random() * verticalVariance);
            const baseDelay = Math.random() * 800;
            const fadeDelay = baseDelay + Math.random() * 200;
            const sizePattern = index % 3;
            let scale;
            switch (sizePattern) {
                case 0:
                    scale = 0.7 + Math.random() * 0.3;
                    break;
                case 1:
                    scale = 1.1 + Math.random() * 0.3;
                    break;
                case 2:
                    scale = 1.4 + Math.random() * 0.3;
                    break;
                default:
                    scale = 1.0;
            }

            return {
                id: Math.random(),
                startX,
                y: new Animated.Value(startY),
                opacity: new Animated.Value(0),
                scale,
                delay: baseDelay,
                fadeDelay,
            };
        });
    }, [width, height]);

    const animateParticle = (particle: Particle) => {
        const duration = 2000 + Math.random() * 800;
        const finalY = Math.random() * (height * 0.7);

        setTimeout(() => {
            Animated.timing(particle.y, {
                toValue: finalY,
                duration,
                useNativeDriver: true,
            }).start();
        }, particle.delay);

        setTimeout(() => {
            Animated.sequence([
                Animated.timing(particle.opacity, {
                    toValue: 0.95,
                    duration: duration * 0.3,
                    useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                    toValue: 0,
                    duration: duration * 0.7,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setParticles(current => current.filter(p => p.id !== particle.id));
            });
        }, particle.fadeDelay);
    };

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(
            PARTICLE_EVENT,
            ({ element, burstCount }: ParticleEventData) => {
                setParticleElement(element);
                const newParticles = createBurst(burstCount ?? defaultBurstCount); // Use dynamic burstCount if provided
                setParticles(newParticles);
                newParticles.forEach(animateParticle);
            }
        );

        return () => {
            subscription.remove();
        };
    }, [defaultBurstCount, createBurst]);

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map(particle => (
                <Animated.View
                    key={particle.id}
                    style={[
                        styles.particle,
                        {
                            transform: [
                                { translateX: particle.startX },
                                { translateY: particle.y },
                                { scale: particle.scale },
                            ],
                            opacity: particle.opacity,
                        },
                    ]}
                >
                    {particleElement}
                </Animated.View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    particle: {
        position: 'absolute',
    },
});

// ✅ 2️⃣ Update useParticleEmitter to accept burstCount dynamically
export const useParticleEmitter = () => {
    return useCallback((element: React.ReactElement, burstCount?: number) => {
        DeviceEventEmitter.emit(PARTICLE_EVENT, { element, burstCount });
    }, []);
}

export default ParticleAnimation;