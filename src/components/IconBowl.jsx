import { useEffect, useRef } from "react";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Body,
} from "matter-js";
import CodeTIcon from "../assets/Cred/CodeT.png";
import CssIcon from "../assets/Cred/Css.svg";
import JsIcon from "../assets/Cred/JS.svg";
import PostmanIcon from "../assets/Cred/Postman.svg";
import SQLIcon from "../assets/Cred/SQL.svg";
import TSIcon from "../assets/Cred/TS.svg";
import ThreejsIcon from "../assets/Cred/Threejs.svg";
import ReactIcon from "../assets/Cred/logo.svg";
import PythonIcon from "../assets/Cred/python.svg";
import BlenderIcon from "../assets/Cred/Blender.svg";
import UnrealEngineIcon from "../assets/Cred/UE5.png";
import "./IconBowl.css";

const icons = [
  { src: CodeTIcon, alt: "CodeT" },
  { src: CssIcon, alt: "CSS" },
  { src: JsIcon, alt: "JavaScript" },
  { src: PostmanIcon, alt: "Postman" },
  { src: SQLIcon, alt: "SQL" },
  { src: TSIcon, alt: "TypeScript" },
  { src: ThreejsIcon, alt: "Three.js" },
  { src: ReactIcon, alt: "React" },
  { src: PythonIcon, alt: "Python" },
  { src: BlenderIcon, alt: "Blender" },
  { src: UnrealEngineIcon, alt: "Unreal Engine" },
];

const preloadImages = (imageSources) => {
  return Promise.all(
    imageSources.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          resolve({
            src: img.src,
            alt: img.alt,
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        };
        image.src = img.src;
      });
    })
  );
};

const IconBowl = () => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const hasMountedRef = useRef(false); // Prevent double setup in StrictMode/dev

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    let engine, runner, render;

    const setupMatter = async () => {
      const container = containerRef.current;
      if (!container) return;

      const loadedIcons = await preloadImages(icons);
      const iconSize = 60;

      const width = container.clientWidth;
      const height = container.clientHeight;

      engine = Engine.create();
      engine.gravity.y = 0;
      engineRef.current = engine;

      render = Render.create({
        element: container,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "transparent",
        },
      });

      // Create walls
      const wallOptions = { isStatic: true, render: { visible: false } };
      const walls = [
        Bodies.rectangle(width / 2, 0, width, 50, wallOptions),
        Bodies.rectangle(width / 2, height, width, 50, wallOptions),
        Bodies.rectangle(0, height / 2, 50, height, wallOptions),
        Bodies.rectangle(width, height / 2, 50, height, wallOptions),
      ];
      Composite.add(engine.world, walls);

      // Create icon bodies
      const iconBodies = loadedIcons.map((icon) => {
        const xScale = iconSize / icon.width;
        const yScale = iconSize / icon.height;
        const radius = iconSize / 2;

        return Bodies.circle(
          Math.random() * width,
          Math.random() * height,
          radius,
          {
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            density: 0.001,
            render: {
              sprite: {
                texture: icon.src,
                xScale,
                yScale,
              },
            },
          }
        );
      });

      Composite.add(engine.world, iconBodies);

      // Apply random forces
      iconBodies.forEach((body) => {
        const forceMagnitude = 0.002;
        const angle = Math.random() * 2 * Math.PI;
        const force = {
          x: forceMagnitude * Math.cos(angle),
          y: forceMagnitude * Math.sin(angle),
        };
        Body.applyForce(body, body.position, force);
      });

      // Mouse constraint
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;

      // Run Matter.js
      runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
    };

    setupMatter();

    // Cleanup
    return () => {
      if (render) {
        Render.stop(render);
        if (render.canvas && render.canvas.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
        render.textures = {};
      }
      if (runner) Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }, []);

  return <div ref={containerRef} className="icon-bowl" />;
};

export default IconBowl;