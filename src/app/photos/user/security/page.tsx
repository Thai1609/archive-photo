"use client";
import React from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

function ImageSlide({
  url,
  position,
}: {
  url: string;
  position: [number, number, number];
}) {
  const texture = useTexture(url);
  return (
    <mesh position={position}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function SecurityPage() {
  return <></>;
}
