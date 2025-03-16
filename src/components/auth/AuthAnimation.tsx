
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text3D, useTexture, Center } from '@react-three/drei';
import { Mesh, Group, Vector3 } from 'three';
import { useAccentColor } from '@/hooks/useAccentColor';

function FloatingCube({ position, color, size = 1, speed = 1 }: { 
  position: [number, number, number], 
  color: string, 
  size?: number, 
  speed?: number 
}) {
  const mesh = useRef<Mesh>(null!);
  const initialY = position[1];
  const time = useRef(Math.random() * 100);
  
  useFrame(() => {
    time.current += 0.01 * speed;
    mesh.current.position.y = initialY + Math.sin(time.current) * 0.5;
    mesh.current.rotation.x += 0.01 * speed;
    mesh.current.rotation.y += 0.01 * speed;
  });

  return (
    <RoundedBox 
      ref={mesh} 
      position={position} 
      radius={0.1} 
      smoothness={4}
      args={[size, size, size]}
    >
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </RoundedBox>
  );
}

function Logo({ color }: { color: string }) {
  const group = useRef<Group>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.2;
  });

  return (
    <group ref={group}>
      <Center>
        <Text3D
          font="/fonts/inter_regular.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Automation
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
        </Text3D>
      </Center>
    </group>
  );
}

function Scene() {
  const { accentColorHex } = useAccentColor();
  const primaryColor = accentColorHex || '#9b87f5';
  const secondaryColor = '#6E59A5';
  
  const cubePositions: Array<[number, number, number]> = [
    [-4, 0, -3],
    [4, 0, -3],
    [-3, 1, -2],
    [3, 1, -2],
    [-2, -1, -1],
    [2, -1, -1],
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color={primaryColor} />
      
      <group position={[0, -0.5, 0]}>
        <Logo color={primaryColor} />
      </group>
      
      {cubePositions.map((position, i) => (
        <FloatingCube 
          key={i} 
          position={position} 
          color={i % 2 === 0 ? primaryColor : secondaryColor} 
          size={0.7} 
          speed={0.5 + Math.random() * 0.5} 
        />
      ))}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 3} 
      />
    </>
  );
}

export function AuthAnimation() {
  useEffect(() => {
    // Предзагрузка шрифтов для Text3D
    const preloadFont = async () => {
      try {
        await fetch('/fonts/inter_regular.json');
      } catch (e) {
        console.error('Failed to preload font:', e);
      }
    };
    
    preloadFont();
  }, []);

  return (
    <div className="w-full h-[300px] overflow-hidden rounded-lg">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
