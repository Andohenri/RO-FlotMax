import React, { useState, useEffect } from 'react';
import { Play, Plus, Save, Upload, Download, Settings, HelpCircle, X } from 'lucide-react';

const FlowHeader = ({
	onAddNode,
	onRunMaxFlow,
	onSave,
	onLoad,
	onSettings,
	nodes = [],
	onSourcesChange,
	onDestinationsChange,
	sourceNodes = [],
	destinationNodes = [],
	// Nouveaux props pour gérer les valeurs maximales
	sourceMaxValues = {},
	destinationMaxValues = {},
	onSourceMaxValueChange,
	onDestinationMaxValueChange
}) => {
	const [nodeName, setNodeName] = useState('');
	const [nodeSymbol, setNodeSymbol] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [selectedSourceNode, setSelectedSourceNode] = useState('');
	const [selectedDestinationNode, setSelectedDestinationNode] = useState('');
	// Nouvelles états pour les valeurs maximales
	const [sourceMaxValue, setSourceMaxValue] = useState('');
	const [destinationMaxValue, setDestinationMaxValue] = useState('');


	const handleRunMaxFlow = () => {
		setIsLoading(true);
		// Simulate execution time
		setTimeout(() => {
			onRunMaxFlow();
			setIsLoading(false);
		}, 800);
	};

	const handleAddSource = () => {
		if (selectedSourceNode && !sourceNodes.includes(selectedSourceNode)) {
			// Ajout du nœud source avec sa valeur maximale si définie
			onSourcesChange([...sourceNodes, selectedSourceNode]);
			// Si une valeur maximale a été définie, on l'enregistre
			if (sourceMaxValue && !isNaN(parseFloat(sourceMaxValue))) {
				onSourceMaxValueChange({
					...sourceMaxValues,
					[selectedSourceNode]: parseFloat(sourceMaxValue)
				});
			}
			setSelectedSourceNode('');
			setSourceMaxValue('');
		}
	};

	const handleAddDestination = () => {
		if (selectedDestinationNode && !destinationNodes.includes(selectedDestinationNode)) {
			onDestinationsChange([...destinationNodes, selectedDestinationNode]);
			// Si une valeur maximale a été définie, on l'enregistre
			if (destinationMaxValue && !isNaN(parseFloat(destinationMaxValue))) {
				onDestinationMaxValueChange({
					...destinationMaxValues,
					[selectedDestinationNode]: parseFloat(destinationMaxValue)
				});
			}
			setSelectedDestinationNode('');
			setDestinationMaxValue('');
		}
	};

	const handleRemoveSource = (nodeId) => {
		onSourcesChange(sourceNodes.filter(id => id !== nodeId));
		// Supprimer également la valeur maximale associée
		if (sourceMaxValues[nodeId]) {
			const newSourceMaxValues = { ...sourceMaxValues };
			delete newSourceMaxValues[nodeId];
			onSourceMaxValueChange(newSourceMaxValues);
		}
	};

	const handleRemoveDestination = (nodeId) => {
		onDestinationsChange(destinationNodes.filter(id => id !== nodeId));
		// Supprimer également la valeur maximale associée
		if (destinationMaxValues[nodeId]) {
			const newDestinationMaxValues = { ...destinationMaxValues };
			delete newDestinationMaxValues[nodeId];
			onDestinationMaxValueChange(newDestinationMaxValues);
		}
	};

	// Fonction pour mettre à jour la valeur maximale d'un nœud source existant
	const handleUpdateSourceMaxValue = (nodeId, value) => {
		const parsedValue = parseFloat(value);
		if (!isNaN(parsedValue)) {
			onSourceMaxValueChange({
				...sourceMaxValues,
				[nodeId]: parsedValue
			});
		} else if (value === '') {
			// Si la valeur est vide, on peut la supprimer
			const newSourceMaxValues = { ...sourceMaxValues };
			delete newSourceMaxValues[nodeId];
			onSourceMaxValueChange(newSourceMaxValues);
		}
	};

	// Fonction pour mettre à jour la valeur maximale d'un nœud destination existant
	const handleUpdateDestinationMaxValue = (nodeId, value) => {
		const parsedValue = parseFloat(value);
		if (!isNaN(parsedValue)) {
			onDestinationMaxValueChange({
				...destinationMaxValues,
				[nodeId]: parsedValue
			});
		} else if (value === '') {
			// Si la valeur est vide, on peut la supprimer
			const newDestinationMaxValues = { ...destinationMaxValues };
			delete newDestinationMaxValues[nodeId];
			onDestinationMaxValueChange(newDestinationMaxValues);
		}
	};

	// Get node label by id
	const getNodeLabel = (nodeId) => {
		const node = nodes.find(node => node.id === nodeId);
		return node ? (node.data?.label || node.id) : nodeId;
	};

	// Filter available nodes (not in the opposite list)
	const availableSourceNodes = nodes.filter(node => !destinationNodes.includes(node.id));
	const availableDestinationNodes = nodes.filter(node => !sourceNodes.includes(node.id));

	return (
		<div className="w-full z-10 relative top-0 bg-gray-800 text-white p-4 shadow-md">
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center">
						<h1 className="text-xl font-bold mr-4">Recherche de Flot Maximum</h1>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={handleRunMaxFlow}
							disabled={isLoading || sourceNodes.length === 0 || destinationNodes.length === 0}
							className={`flex items-center justify-center gap-1 ${isLoading || sourceNodes.length === 0 || destinationNodes.length === 0
								? 'bg-blue-700 opacity-70 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-700'
								} text-white px-3 py-2 rounded transition-colors`}
						>
							{isLoading ? (
								<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
							) : (
								<Play size={18} />
							)}
							<span className="hidden sm:inline">Exécuter</span>
						</button>

						<button
							onClick={onAddNode}
							className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
						>
							<Plus size={18} />
							<span className="hidden sm:inline">Ajouter</span>
						</button>

						<div className="flex gap-2">
							<button onClick={onSave} className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors">
								<Save size={18} />
							</button>
							<button onClick={onLoad} className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors">
								<Upload size={18} />
							</button>
							<button onClick={onSettings} className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors">
								<Settings size={18} />
							</button>
							<button className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors">
								<HelpCircle size={18} />
							</button>
						</div>
					</div>
				</div>

				{/* Multiple Sources Selection with Max Values */}
				<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4">
					{/* Sources Section */}
					<div className="w-full md:w-1/2 space-y-2">
						<h3 className="font-medium">Nœuds de dépôt (sources):</h3>

						<div className="flex items-center gap-2">
							<select
								value={selectedSourceNode}
								onChange={(e) => setSelectedSourceNode(e.target.value)}
								className="px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
								disabled={availableSourceNodes.length === 0}
							>
								<option value="">Sélectionnez un nœud source</option>
								{availableSourceNodes.map(node => (
									<option
										key={`source-opt-${node.id}`}
										value={node.id}
										disabled={sourceNodes.includes(node.id)}
									>
										{`${node.data?.label || '?'} (${node.id})`}
									</option>
								))}
							</select>

							{/* Champ pour la valeur maximale de la source */}
							<input
								type="number"
								value={sourceMaxValue}
								onChange={(e) => setSourceMaxValue(e.target.value)}
								placeholder="Max"
								className="px-3 py-2 bg-gray-700 rounded w-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>

							<button
								onClick={handleAddSource}
								disabled={!selectedSourceNode}
								className={`flex items-center justify-center ${!selectedSourceNode ? 'bg-green-700 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
									} text-white px-3 py-2 rounded transition-colors`}
							>
								<Plus size={18} />
							</button>
						</div>

						{/* Selected Sources with Max Values */}
						<div className="flex flex-wrap gap-2 mt-2">
							{sourceNodes.length === 0 ? (
								<p className="text-gray-400 text-sm italic">Aucune source sélectionnée</p>
							) : (
								sourceNodes.map(nodeId => {
									const label = getNodeLabel(nodeId);
									return (
										<div
											key={`source-${nodeId}`}
											className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm"
										>
											<span>{`${label} (${nodeId})`}</span>
											<input
												type="number"
												value={sourceMaxValues[nodeId] || ''}
												onChange={(e) => handleUpdateSourceMaxValue(nodeId, e.target.value)}
												placeholder="Max"
												className="px-1 py-0 bg-blue-700 rounded w-16 text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-white text-xs"
											/>
											<button
												onClick={() => handleRemoveSource(nodeId)}
												className="text-white hover:text-gray-200 focus:outline-none ml-1"
											>
												<X size={14} />
											</button>
										</div>
									);
								})
							)}
						</div>
					</div>

					{/* Destinations Section */}
					<div className="w-full md:w-1/2 space-y-2">
						<h3 className="font-medium">Nœuds de destination (puits):</h3>

						<div className="flex items-center gap-2">
							<select
								value={selectedDestinationNode}
								onChange={(e) => setSelectedDestinationNode(e.target.value)}
								className="px-3 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
								disabled={availableDestinationNodes.length === 0}
							>
								<option value="">Sélectionnez un nœud destination</option>
								{availableDestinationNodes.map(node => (
									<option
										key={`dest-opt-${node.id}`}
										value={node.id}
										disabled={destinationNodes.includes(node.id)}
									>
										{`${node.data?.label || '?'} (${node.id})`}
									</option>
								))}
							</select>

							{/* Champ pour la valeur maximale de la destination */}
							<input
								type="number"
								value={destinationMaxValue}
								onChange={(e) => setDestinationMaxValue(e.target.value)}
								placeholder="Max"
								className="px-3 py-2 bg-gray-700 rounded w-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>

							<button
								onClick={handleAddDestination}
								disabled={!selectedDestinationNode}
								className={`flex items-center justify-center ${!selectedDestinationNode ? 'bg-green-700 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
									} text-white px-3 py-2 rounded transition-colors`}
							>
								<Plus size={18} />
							</button>
						</div>

						{/* Selected Destinations with Max Values */}
						<div className="flex flex-wrap gap-2 mt-2">
							{destinationNodes.length === 0 ? (
								<p className="text-gray-400 text-sm italic">Aucune destination sélectionnée</p>
							) : (
								destinationNodes.map(nodeId => {
									const label = getNodeLabel(nodeId);
									return (
										<div
											key={`dest-${nodeId}`}
											className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-lg text-sm"
										>
											<span>{`${label} (${nodeId})`}</span>
											<input
												type="number"
												value={destinationMaxValues[nodeId] || ''}
												onChange={(e) => handleUpdateDestinationMaxValue(nodeId, e.target.value)}
												placeholder="Max"
												className="px-1 py-0 bg-purple-700 rounded w-16 text-white placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-white text-xs"
											/>
											<button
												onClick={() => handleRemoveDestination(nodeId)}
												className="text-white hover:text-gray-200 focus:outline-none ml-1"
											>
												<X size={14} />
											</button>
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FlowHeader;