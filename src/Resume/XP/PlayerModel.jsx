import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// This component loads and displays your 3D model.
const Model = () => {
  // useGLTF will automatically load the .gltf, .bin, and texture files
  // as long as they are in the public folder.
  const { scene } = useGLTF('/Toad/scene.gltf');
  const modelRef = useRef();

  // This hook runs on every frame, allowing for animation.
  useFrame(() => {
    // Make the model bob up and down slightly for a lively effect.
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.1;
    }
  });

  // The 'primitive' object is a way to directly render a loaded scene.
  // The rotation on the Y-axis has been changed to face the model to the right.
  return <primitive object={scene} ref={modelRef} scale={25} rotation={[0, -Math.PI / 2, 0]} />;
};

const PlayerModel = () => {
  return (
    <>
      {/* Basic lighting for the scene */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model />
    </>
  );
};

// Preload the model so it's ready when the component mounts.
useGLTF.preload('/Toad/scene.gltf');

export default PlayerModel;
