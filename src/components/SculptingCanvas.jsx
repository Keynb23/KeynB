import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

// Function to handle the GLB download
const downloadGLB = (mesh) => {
  if (!mesh) {
    console.error('Mesh is null. Cannot export GLB.');
    return;
  }

  const exporter = new GLTFExporter();
  exporter.parse(
    mesh,
    (gltf) => {
      const blob = new Blob([gltf], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sculpted_sphere.glb';
      a.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('An error happened during GLTF export', error);
    }
  );
};

// The sculptable sphere component
const SculptableSphere = ({ tool, sculpting, onSculpt, onGrab }) => {
  const meshRef = useRef();
  const { raycaster, mouse } = useThree();

  useFrame(() => {
    // Only perform raycasting and sculpting if the tool is active
    if (sculpting.active) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        // The normal is crucial for determining the sculpting direction
        const normal = intersection.face.normal;

        // Pass the intersection data to the parent component for handling
        onSculpt(point, normal, tool, sculpting.modifier);
      }
    }
  });

  return (
    <Sphere
      args={[1, 64, 64]} // Radius, width segments, height segments
      ref={meshRef}
      onPointerMove={(e) => {
        // Update mouse coordinates for raycasting
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
      onPointerDown={(e) => {
        // Stop OrbitControls on left-click to allow sculpting
        if (e.button === 0) e.stopPropagation();
      }}
    >
      <meshStandardMaterial color="gray" />
    </Sphere>
  );
};

// The main component that renders the canvas and UI
const SculptingCanvas = () => {
  const meshRef = useRef();
  const controlsRef = useRef();
  const [isActive, setIsActive] = useState(false);
  const [tool, setTool] = useState('sculpt'); // 'sculpt' or 'grab'
  const [sculpting, setSculpting] = useState({
    active: false,
    modifier: 'none', // 'none', 'shift', or 'ctrl'
  });

  // Main sculpting logic
  const onSculpt = (point, normal, tool, modifier) => {
    const sphereGeometry = meshRef.current.children[0].geometry;
    const positionAttribute = sphereGeometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Sculpting properties
    const brushRadius = 0.1;
    let strength = 0.05;

    // Invert strength if Ctrl is held
    if (modifier === 'ctrl') {
      strength *= -1;
    }

    // A simple loop to find and deform nearby vertices
    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      vertex.applyMatrix4(meshRef.current.children[0].matrixWorld);

      const distance = point.distanceTo(vertex);
      if (distance < brushRadius) {
        // Calculate falloff to make the brush feel smooth
        const falloff = 1 - (distance / brushRadius);

        // Deform the vertex based on the normal and tool
        const direction = normal.clone().multiplyScalar(strength * falloff);
        const newPosition = vertex.add(direction);

        positionAttribute.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
      }
    }

    // Crucial step: signal that the geometry has changed
    positionAttribute.needsUpdate = true;
    sphereGeometry.computeVertexNormals(); // Recalculate normals for correct lighting
  };

  // Event handlers for mouse and keyboard
  const handlePointerDown = (e) => {
    // Left-click (sculpt/grab)
    if (e.button === 0) {
      setSculpting({ ...sculpting, active: true, modifier: e.shiftKey ? 'shift' : e.ctrlKey ? 'ctrl' : 'none' });
      if (controlsRef.current) controlsRef.current.enabled = false;
    }
    // Right-click (rotate)
    else if (e.button === 2) {
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  };

  const handlePointerUp = () => {
    setSculpting({ ...sculpting, active: false });
    if (controlsRef.current) controlsRef.current.enabled = true;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'g' || e.key === 'G') setTool('grab');
    if (e.key === 's' || e.key === 'S') setTool('sculpt');
  };

  // Add keyboard listeners on component mount
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handler for activating the scene on click
  const handleContainerClick = () => {
    setIsActive(true);
  };

  return (
    <div
      onClick={handleContainerClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()} // Prevents right-click context menu
      style={{
        position: 'relative',
        width: '800px',
        height: '600px',
        border: '1px solid #ccc',
        margin: '20px auto',
        cursor: isActive ? 'default' : 'pointer',
      }}
    >
      {isActive ? (
        <>
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 3] }}
            onCreated={({ scene }) => {
              meshRef.current = scene;
            }}
          >
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <SculptableSphere tool={tool} sculpting={sculpting} onSculpt={onSculpt} />
            <OrbitControls ref={controlsRef} mouseButtons={{ LEFT: THREE.MOUSE.RIGHT, RIGHT: THREE.MOUSE.LEFT }} />
          </Canvas>
          <button
            onClick={handleDownload}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              padding: '10px 20px',
              fontSize: '16px',
            }}
          >
            Download GLB
          </button>
        </>
      ) : (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
        }}>
          Click to activate sculpting
        </div>
      )}
    </div>
  );
};

export default SculptingCanvas;