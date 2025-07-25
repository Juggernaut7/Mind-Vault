// src/pages/MindMapPage.jsx
// src/pages/MindMapPage.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react'; // <-- Changed here!
import useNotes from '../hooks/useNotes.js'; // To get our notes
import { motion } from 'framer-motion';

// ... (rest of your MindMapPage.jsx code remains the same)
// Define a custom node type for better styling
const CustomNoteNode = ({ data, id }) => {
  return (
    <div className="bg-steel-dark border border-electric rounded-lg p-3 shadow-md text-text-light min-w-[150px] max-w-[250px] text-center cursor-grab">
      <div className="font-semibold text-electric text-lg mb-1">{data.label}</div>
      <div className="text-xs text-text-dark line-clamp-2">{data.description}</div>
      {/* Optional: Display tags/related topics if space allows */}
    </div>
  );
};

// Define node types for React Flow
const nodeTypes = {
  customNote: CustomNoteNode,
};

const MindMapPage = () => {
  const { notes } = useNotes();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Function to create nodes and edges from our notes data
  const generateFlowElements = useCallback(() => {
    const newNodes = [];
    const newEdges = [];
    const nodeMap = new Map(); // To quickly find existing nodes by note ID

    // Create a base node for each note
    notes.forEach((note, index) => {
      const existingNode = nodeMap.get(note.id);
      if (!existingNode) {
        // Simple positioning logic: spread them out
        const position = {
          x: (index % 5) * 200 + Math.random() * 50,
          y: Math.floor(index / 5) * 150 + Math.random() * 50,
        };

        const newNode = {
          id: note.id.toString(), // ID must be a string for React Flow
          type: 'customNote', // Use our custom node type
          data: { label: note.title, description: note.description, noteId: note.id },
          position,
        };
        newNodes.push(newNode);
        nodeMap.set(note.id, newNode);
      }
    });

    // Create edges based on relatedTopics
    notes.forEach(sourceNote => {
      if (sourceNote.relatedTopics && Array.isArray(sourceNote.relatedTopics)) {
        sourceNote.relatedTopics.forEach(targetTopic => {
          // Find notes that have this targetTopic in their title or tags
          const targetNotes = notes.filter(n =>
            n.title.toLowerCase().includes(targetTopic.toLowerCase()) ||
            (n.tags && n.tags.some(tag => tag.toLowerCase() === targetTopic.toLowerCase()))
          );

          targetNotes.forEach(targetNote => {
            // Avoid self-referencing edges and duplicate edges
            if (sourceNote.id !== targetNote.id &&
                !newEdges.some(e =>
                    (e.source === sourceNote.id.toString() && e.target === targetNote.id.toString()) ||
                    (e.source === targetNote.id.toString() && e.target === sourceNote.id.toString())
                )
            ) {
              newEdges.push({
                id: `e-${sourceNote.id}-${targetNote.id}`,
                source: sourceNote.id.toString(),
                target: targetNote.id.toString(),
                type: 'smoothstep', // Or 'straight', 'default', 'step'
                animated: true,
                style: { stroke: '#4A5C6C' }, // steel color
                markerEnd: {
                  type: 'arrowclosed',
                  color: '#4A5C6C',
                },
              });
            }
          });
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [notes, setNodes, setEdges]);

  // Regenerate flow elements whenever notes change
  useEffect(() => {
    generateFlowElements();
  }, [notes, generateFlowElements]);


  // Handler for connecting nodes (optional, for manual linking later)
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col"> {/* Adjust height based on your header */}
      <h1 className="text-4xl font-bold text-electric mb-6">Knowledge Map</h1>
      <motion.div
        className="flex-1 rounded-lg border border-steel-dark overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {notes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-dark text-lg bg-midnight-900 z-10">
            Add notes with "Related Topics" to see your knowledge map!
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView // Zooms to fit all elements initially
            attributionPosition="bottom-left"
            className="bg-midnight-900" // Set background for React Flow area
          >
            <MiniMap nodeStrokeColor={(n) => {
              if (n.style?.background) return n.style.background;
              if (n.type === 'customNote') return '#00F0FF'; // electric color
              if (n.type === 'input') return '#0041d0';
              if (n.type === 'output') return '#ff0072';
              if (n.type === 'default') return '#1a192b';
              return '#eee';
            }} nodeColor={(n) => {
                if (n.type === 'customNote') return '#00F0FF';
                return '#fff';
            }} maskColor="rgba(10,10,14,0.7)" />
            <Controls className="!bg-midnight-800 !border !border-steel-dark !rounded-md" />
            <Background variant="dots" gap={12} size={1} color="#2C2C38" /> {/* Use a dark color for dots */}
          </ReactFlow>
        )}
      </motion.div>
    </div>
  );
};

export default MindMapPage;