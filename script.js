let memes = [];
let currentMemeIndex = 0;
let smashCount = 0;
let passCount = 0;
let smashMemes = [];  // Stocke les memes "Smash"
let passMemes = [];   // Stocke les memes "Pass"
const MAX_MEMES = 100;

const memeImg = document.getElementById('meme-img');
const passBtn = document.getElementById('pass-btn');
const smashBtn = document.getElementById('smash-btn');
const resultDiv = document.getElementById('result');
const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const smashList = document.getElementById('smash-list');
const passList = document.getElementById('pass-list');
const scoreText = document.getElementById('score-text');

// Sélectionner les fichiers audio
const smashSound = document.getElementById('smash-sound');
const passSound = document.getElementById('pass-sound');

// Fonction pour charger les memes à partir de l'API Imgflip
async function loadMemesFromAPI() {
    try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        memes = shuffleArray(data.data.memes).slice(0, MAX_MEMES); // Mélange et limite à 100 memes
        loadMeme();
    } catch (error) {
        console.error('Erreur lors du chargement des memes:', error);
        resultDiv.innerHTML = 'Erreur lors du chargement des memes.';
    }
}

// Mélanger le tableau de memes
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fonction pour afficher un meme
function loadMeme() {
    if (currentMemeIndex < memes.length) {
        memeImg.src = memes[currentMemeIndex].url;
        resultDiv.innerHTML = `Smash: ${smashCount} | Pass: ${passCount}`;
    } else {
        showFinalScore();
    }
}

// Passer au meme suivant
function nextMeme() {
    currentMemeIndex++;
    loadMeme();
}

// Actions pour les boutons
passBtn.addEventListener('click', () => {
    passCount++;
    passMemes.push(memes[currentMemeIndex]);  // Ajout du meme dans la liste "Pass"
    passSound.play();  // Jouer le son "Pass"
    nextMeme();
});

smashBtn.addEventListener('click', () => {
    smashCount++;
    smashMemes.push(memes[currentMemeIndex]);  // Ajout du meme dans la liste "Smash"
    smashSound.play();  // Jouer le son "Smash"
    nextMeme();
});

// Afficher la page de score final avec les images dans des tableaux
function showFinalScore() {
    gameContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
    
    scoreText.innerHTML = `Vous avez cliqué "Smash" ${smashCount} fois et "Pass" ${passCount} fois.`;

    // Afficher les memes "Smash" dans un tableau
    smashList.innerHTML = '';
    for (let i = 0; i < smashMemes.length; i += 2) {
        let row = document.createElement('tr');
        
        for (let j = 0; j < 2; j++) {
            let cell = document.createElement('td');
            if (smashMemes[i + j]) {
                let img = document.createElement('img');
                img.src = smashMemes[i + j].url;
                cell.appendChild(img);
            }
            row.appendChild(cell);
        }

        smashList.appendChild(row);
    }
    
    // Afficher les memes "Pass" dans un tableau
    passList.innerHTML = '';
    for (let i = 0; i < passMemes.length; i += 2) {
        let row = document.createElement('tr');
        
        for (let j = 0; j < 2; j++) {
            let cell = document.createElement('td');
            if (passMemes[i + j]) {
                let img = document.createElement('img');
                img.src = passMemes[i + j].url;
                cell.appendChild(img);
            }
            row.appendChild(cell);
        }

        passList.appendChild(row);
    }
}

// Rejouer le jeu
function restartGame() {
    smashCount = 0;
    passCount = 0;
    smashMemes = [];  // Réinitialiser la liste "Smash"
    passMemes = [];   // Réinitialiser la liste "Pass"
    currentMemeIndex = 0;
    gameContainer.style.display = 'block';
    scoreContainer.style.display = 'none';
    loadMemesFromAPI(); // Recharge de nouveaux memes aléatoires
}

// Charger les memes depuis l'API au démarrage
loadMemesFromAPI();
