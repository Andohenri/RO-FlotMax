# Vite + React Flow Graph

## Description
Ce projet est une application React utilisant **Vite** pour la configuration du build et **React Flow** pour la visualisation et la manipulation de graphes. L'application permet de créer des nœuds et des arêtes, de définir des capacités maximales pour les arêtes, et d'exécuter l'algorithme de **Ford-Fulkerson** pour trouver le flot maximum dans un graphe.

## Fonctionnalités
- **Création de nœuds** : Ajoutez des nœuds au graphe en cliquant sur le bouton "Ajouter".
- **Création d'arêtes** : Connectez des nœuds en cliquant et en faisant glisser entre eux, puis définissez la capacité de l'arête.
- **Modification des arêtes** : Cliquez sur une arête pour modifier sa capacité.
- **Suppression des arêtes** : Cliquez avec le bouton droit sur une arête pour la supprimer.
- **Exécution de l'algorithme de Ford-Fulkerson** : Trouvez le flot maximum entre les nœuds source et puits sélectionnés.
- **Interface utilisateur intuitive** : Utilisation de **Tailwind CSS** pour un design moderne et réactif.

## Installation
1. **Clonez le dépôt** :
   ```sh
   git clone https://github.com/Andohenri/RO-FlotMax.git
   cd RO-FlotMax.git
   ```

2. **Installez les dépendances** :
   ```sh
   npm install
   ```

3. **Lancez l'application en mode développement** :
   ```sh
   npm run dev
   ```

4. **Ouvrez votre navigateur à l'adresse suivante** :
   ```
   http://localhost:3000
   ```

## Scripts disponibles
- `npm run dev` : Lance l'application en mode développement.
- `npm run build` : Construit l'application pour la production.
- `npm run preview` : Prévisualise l'application construite.
- `npm run lint` : Analyse le code avec ESLint.

## Technologies utilisées
- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Vite** : Outil de build rapide pour les projets modernes.
- **React Flow** : Librairie pour la construction de graphes interactifs.
- **Tailwind CSS** : Framework CSS utilitaire pour un design rapide et réactif.

## Contribution
Les contributions sont les bienvenues ! Veuillez soumettre une **pull request** ou ouvrir une **issue** pour discuter des améliorations que vous souhaitez apporter.

## Licence
Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---


