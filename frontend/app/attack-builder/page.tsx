"use client";

import React from 'react';
import 'reactflow/dist/style.css';

// Import providers
import { NodeProvider } from '../../v2/context/node-context';
import { SimulationProvider } from '../../v2/context/simulation-context';
import { ReactFlowProvider } from 'reactflow';

// Import components
import Canvas from '../../v2/components/canvas/canvas';
import Toolbar from '../../v2/components/layout/toolbar';
import Sidebar from '../../v2/components/layout/sidebar';

// Force client-side rendering
const AttackBuilderPage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ReactFlowProvider>
        <SimulationProvider>
          <NodeProvider>
            <div className="flex h-full w-full">
              <Sidebar />
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Toolbar />
                <main className="flex-1 relative overflow-hidden">
                  <Canvas />
                </main>
              </div>
            </div>
          </NodeProvider>
        </SimulationProvider>
      </ReactFlowProvider>
    </div>
  );
};

export default AttackBuilderPage;
