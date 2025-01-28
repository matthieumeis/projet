document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs des champs de formulaire
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const API_URL = 'https://api.jsonbin.io/v3/b/6798ed28ad19ca34f8f5d8ac'; // Remplacez par votre ID de Bin
    const API_KEY = '$2a$10$AXpJEL1LMo3VGk/MlNZ0/ut2wQKWVMywMLK7NmoQQTpQWh3bXSYHS'; // Remplacez par votre clé API JSONBin

    try {
        // Charger les données utilisateur depuis JSONBin
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY, // Clé d'accès à JSONBin
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données utilisateur.');
        }

        const { record: data } = await response.json();

        // Vérifier si les identifiants sont corrects
        const user = data.users.find(user => user.username === username && user.password === password);

        if (user) {
            // Générer un token et le stocker dans le sessionStorage
            const token = generateToken(user.username);
            sessionStorage.setItem('authToken', token);

            // Afficher une notification et attendre 3 secondes avant la redirection
            showNotification('Connexion réussie ! Redirection dans 3 secondes...', 'success', 5000);

            setTimeout(() => {
                window.location.href = 'site.html';
            }, 3000);
        } else {
            // Afficher une notification d'erreur
            showNotification('Nom d\'utilisateur ou mot de passe incorrect.', 'error', 5000);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
    }
});

/**
 * Fonction pour générer un token simple
 * @param {string} username - Nom d'utilisateur
 * @returns {string} - Token généré
 */
function generateToken(username) {
    // Un token simple encodé en base64 (peut être amélioré avec une librairie comme JWT)
    return btoa(`${username}:${new Date().getTime()}`);
}

/**
 * Fonction pour afficher une notification
 * @param {string} message - Le message de la notification
 * @param {string} type - Le type de notification ('success' ou 'error')
 * @param {number} duration - La durée d'affichage en millisecondes
 */
function showNotification(message, type, duration) {
    const notificationContainer = document.getElementById('notification-container') || createNotificationContainer();

    const notification = document.createElement('div');
    notification.classList.add('notification', type); // Ajoute une classe spécifique pour le type
    notification.textContent = message;

    // Ajouter la notification au conteneur
    notificationContainer.appendChild(notification);

    // Garder la notification visible pour la durée spécifiée
    setTimeout(() => {
        notification.classList.add('fade-out'); // Ajouter une classe pour animer la disparition
    }, duration - 1000); // Déclenche le fade-out avant la suppression

    // Supprimer complètement la notification après la durée spécifiée
    setTimeout(() => {
        notification.remove();
    }, duration);
}

/**
 * Crée et ajoute un conteneur pour les notifications s'il n'existe pas déjà
 */
function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
    return container;
}

// Vérification automatique de l'authentification sur une page protégée
if (window.location.pathname === '/site.html') {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        // Si pas de token, redirection vers la page de connexion
        window.location.href = 'login.html';
    } else {
        console.log('Utilisateur authentifié avec succès.');
    }
}
