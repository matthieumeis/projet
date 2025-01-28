// Obtenir l'élément canvas et son contexte
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Définir les dimensions du canvas
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Tableau des caractères utilisés dans l'animation
const characters = [
  "!",
  "?",
  "$",
  "*",
  "%",
  "§",
  "1",
  "2",
  "/3",
  "9",
  "8",
  "7",
  "6",
  "5",
  "3",
  "2",
];

// Déterminer le nombre de colonnes
const columns = Math.floor(canvasWidth / 20);

// Initialiser les positions Y des colonnes
const yPositions = [];
for (let i = 0; i < columns; i++) {
  yPositions[i] = Math.random() * canvasHeight;
}

// Fonction pour mettre à jour l'animation Matrix
function updateMatrix() {
  // Couleur de fond avec légère transparence pour créer l'effet de traînée
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Couleur et style du texte
  ctx.fillStyle = "red";
  ctx.font = "12px timesnewroman";

  // Parcourir chaque colonne pour dessiner les caractères
  for (let i = 0; i < columns; i++) {
    const character = characters[Math.floor(Math.random() * characters.length)];
    const y = yPositions[i];

    // Dessiner le caractère à la position actuelle
    ctx.fillText(character, i * 20, y);

    // Déplacer la colonne vers le bas
    yPositions[i] += 20;

    // Réinitialiser la position si elle dépasse le bas du canvas
    if (yPositions[i] > canvasHeight && Math.random() > 0.98) {
      yPositions[i] = 0;
    }
  }
}

// Fonction pour démarrer l'animation
function renderMatrix() {
  requestAnimationFrame(renderMatrix);
  updateMatrix();
}

// Lancer l'animation Matrix
renderMatrix();
