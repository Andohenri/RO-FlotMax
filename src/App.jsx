import React, { useEffect, useState, useCallback } from "react";
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, Position, BackgroundVariant, addEdge, MiniMap, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowHeader from "./components/FlowHeader";

class Graph {
	// Constructeur qui initialise un graphe avec 'vertices' sommets
	// et une matrice d'adjacence remplie de zéros
	constructor(vertices) {
		this.V = vertices;
		this.graph = Array.from({ length: vertices }, () => Array(vertices).fill(0));
	}

	// Méthode pour ajouter une arête du sommet u au sommet v avec une capacité donnée
	addEdge(u, v, capacity) {
		this.graph[u][v] = capacity;
	}

	// Algorithme de parcours en largeur (BFS) pour trouver un chemin augmentant
	// du sommet source au sommet puits dans le graphe résiduel
	bfs(source, sink, parent) {
		// Tableau pour marquer les sommets visités
		let visited = new Array(this.V).fill(false);

		// File d'attente pour le BFS, initialisée avec le sommet source
		let queue = [source];
		visited[source] = true;
		parent[source] = -1;  // Le sommet source n'a pas de parent

		// Tant que la file d'attente n'est pas vide
		while (queue.length) {
			// Extraire le premier sommet de la file
			let u = queue.shift();

			// Parcourir tous les sommets adjacents potentiels
			for (let v = 0; v < this.V; v++) {
				// Si le sommet v n'est pas visité et qu'il existe une capacité résiduelle
				if (!visited[v] && this.graph[u][v] > 0) {
					// Si on a atteint le puits, enregistrer son parent et retourner true
					if (v === sink) {
						parent[v] = u;
						return true;
					}
					// Sinon, ajouter v à la file, marquer comme visité et enregistrer son parent
					queue.push(v);
					parent[v] = u;
					visited[v] = true;
				}
			}
		}
		// Aucun chemin augmentant n'a été trouvé
		return false;
	}

	// Implémentation de l'algorithme de Ford-Fulkerson pour trouver le flot maximum
	fordFulkerson(source, sink) {
		// Tableau pour stocker le chemin (les parents de chaque sommet)
		let parent = new Array(this.V);
		let maxFlow = 0;  // Initialisation du flot maximum à 0

		// Tant qu'il existe un chemin augmentant de la source au puits
		while (this.bfs(source, sink, parent)) {
			// Trouver la capacité résiduelle minimale le long du chemin trouvé
			let pathFlow = Infinity;
			for (let v = sink; v !== source; v = parent[v]) {
				let u = parent[v];
				pathFlow = Math.min(pathFlow, this.graph[u][v]);
			}

			// Mettre à jour les capacités résiduelles des arêtes et des arêtes inverses
			for (let v = sink; v !== source; v = parent[v]) {
				let u = parent[v];
				// Diminuer la capacité de l'arête utilisée
				this.graph[u][v] -= pathFlow;
				// Augmenter la capacité de l'arête inverse (pour permettre l'annulation de flot)
				this.graph[v][u] += pathFlow;
			}

			// Ajouter le flot de ce chemin au flot maximal
			maxFlow += pathFlow;
		}

		// Retourner le flot maximum trouvé
		return maxFlow;
	}
}

const nodeDefaults = {
	sourcePosition: Position.Right,
	targetPosition: Position.Left,
	style: {
		borderRadius: '100%',
		backgroundColor: '#fff',
		width: 50,
		height: 50,
		display: 'flex',
		color: "#000",
		alignItems: 'center',
		justifyContent: 'center',
	},
};

const initialNodes = [
	{ id: "start", data: { label: "α" }, position: { x: 50, y: 200 }, ...nodeDefaults, },
	{ id: "end", data: { label: "Ω" }, position: { x: 600, y: 250 }, ...nodeDefaults, },
];

// const initialEdges = [
//     // { id: "e0-1", source: "0", target: "1", label: "45" },
//     // { id: "e0-2", source: "0", target: "2", label: "25" },
//     // { id: "e0-3", source: "0", target: "3", label: "30" },
//     // { id: "e1-4", source: "1", target: "4", label: "10" },
//     // { id: "e1-5", source: "1", target: "5", label: "15" },
//     // { id: "e1-7", source: "1", target: "7", label: "20" },
//     // { id: "e2-4", source: "2", target: "4", label: "20" },
//     // { id: "e2-5", source: "2", target: "5", label: "5" },
//     // { id: "e2-6", source: "2", target: "6", label: "15" },
//     // { id: "e3-6", source: "3", target: "6", label: "10" },
//     // { id: "e3-7", source: "3", target: "7", label: "15" },
//     // { id: "e4-8", source: "4", target: "8", label: "30" },
//     // { id: "e5-8", source: "5", target: "8", label: "10" },
//     // { id: "e6-8", source: "6", target: "8", label: "20" },
//     // { id: "e7-8", source: "7", target: "8", label: "40" },
// ];

export default function App() {
	const [char, setChar] = useState(['@']);
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState([]);

	const onNodesChange = useCallback(
		(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[],
	);

	const handleChange = (source, target, value) => {
		setEdges(prevEdges => {
			// Vérifier si une arête avec ces source et target existe déjà
			const existingEdgeIndex = prevEdges.findIndex(edge => edge.source === source && edge.target === target);

			// Si l'arête existe, on la modifie
			if (existingEdgeIndex !== -1) {
				const updatedEdges = [...prevEdges];
				updatedEdges[existingEdgeIndex] = {
					...updatedEdges[existingEdgeIndex],
					label: value
				};
				return updatedEdges;
			}
			// Sinon, on ajoute une nouvelle arête
			else {
				const newEdge = {
					id: `e${source}-${target}`,
					source: source,
					target: target,
					label: `${value} (0)`,
					markerEnd: {
						type: MarkerType.ArrowClosed
					},
					type: 'straight',
				};
				return [...prevEdges, newEdge];
			}
		});
	};

	const addNode = () => {
		const newChar = String.fromCharCode(char[char.length - 1].charCodeAt(0) + 1);
		const nodeCount = nodes.length;
		const xPos = 50 * (char.length - 1);
		const yPos = 100 + (nodeCount % 3) * 50 + Math.floor(Math.random() * 200);
		const newNode = {
			id: newChar,
			data: { label: newChar },
			position: { x: xPos, y: yPos },
			...nodeDefaults,
		};
		if (!nodes.includes(newNode)) {
			setChar([...char, newChar]);
			setNodes([...nodes, newNode]);
		}
	};

	const onConnect = useCallback(
		(params) => {
			const value = prompt("Entrez le label de l'edge :"); // 📌 Demande à l'utilisateur un label
			handleChange(params.source, params.target, value);
		}, [setEdges],
	);

	const updateEdgeLabel = (edgeId) => {
		const newLabel = prompt("Modifier le valeur :"); // 🔄 Demande un nouveau label
		if (!newLabel) return; // Si aucun label, on annule

		setEdges((prevEdges) =>
			prevEdges.map((edge) =>
				edge.id === edgeId ? { ...edge, label: `${newLabel} (0)` } : edge
			)
		);
	};

	const onEdgeClick = (event, edge) => {
		event.preventDefault();
		updateEdgeLabel(edge.id); // 🎯 Modifier le label du edge sélectionné
	};

	const deleteEdge = (edgeId) => {
		setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
	};

	const onEdgeRightClick = (event, edge) => {
		event.preventDefault();
		const confirmDelete = window.confirm("Voulez-vous supprimer cet edge ?");
		if (confirmDelete) {
			deleteEdge(edge.id);
		}
	};

	return (
		<main className="h-screen flex flex-col">
			<FlowHeader nodes={nodes} onAddNode={addNode} />
			<div className="flex-1 w-full">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// fitView
					onConnect={onConnect}
					onEdgeClick={onEdgeClick} // Modifier un edge en cliquant
					onEdgeContextMenu={onEdgeRightClick} // Supprimer un edge avec clic droit
					style={{ backgroundColor: "#F7F9FB" }}
				>
					<Background />
					<Controls />
					<MiniMap />
				</ReactFlow>
			</div>
		</main>
	);
};