"use client";

import dynamic from "next/dynamic";

// note: dynamic import is required for components that use the Frame SDK
const MiniAppComponent = dynamic(() => import("~/components/MiniApp"), {
  ssr: false,
});

export default function App() {
  return <MiniAppComponent />;
}
