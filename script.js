var typed = new Typed(".typing", {
  strings: ["", "Etudiant en CyberSécurité", "En Filière CIEL"],
  typeSpeed: 100,
  BackSpeed: 60,
  loop: true,
});

// Aside
const nav = document.querySelector(".nav"),
  navList = nav.querySelectorAll("li"),
  totalNavList = navList.length,
  allSection = document.querySelectorAll(".section"),
  totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
  const a = navList[i].querySelector("a");
  a.addEventListener("click", function () {
    for (let k = 0; k < totalSection; k++) {
      allSection[k].classList.remove("back-section");
    }
    // Loop for removing active class
    for (let j = 0; j < totalNavList; j++) {
      if (navList[j].querySelector("a").classList.contains("active")) {
        allSection[j].classList.add("back-section");
      }
      navList[j].querySelector("a").classList.remove("active");
    }
    // Adding active class
    this.classList.add("active");
    showSection(this); // Function call
    // Nav click event - Hiding the nav menu
    if (window.innerWidth < 1200) {
      asideSectionTogglerBtn();
    }
  });
}

function showSection(element) {
  // Loop for removing active class
  for (let k = 0; k < totalSection; k++) {
    allSection[k].classList.remove("active");
  }
  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}

// For Hire me section
document.querySelector(".hire-me").addEventListener("click", function () {
  showSection(this);
  updateNav(this);
});

function updateNav(element) {
  for (let i = 0; i < totalNavList; i++) {
    navList[i].querySelector("a").classList.remove("active");
    const target = element.getAttribute("href").split("#")[1];
    if (
      target ===
      navList[i].querySelector("a").getAttribute("href").split("#")[1]
    ) {
      navList[i].querySelector("a").classList.add("active");
    }
  }
}

// For Nav Toggler Button
const navTogglerBtn = document.querySelector(".nav-toggler"),
  aside = document.querySelector(".aside");
navTogglerBtn.addEventListener("click", () => {
  asideSectionTogglerBtn();
});

function asideSectionTogglerBtn() {
  aside.classList.toggle("open");
  navTogglerBtn.classList.toggle("open");
}

// Récupérer les éléments nécessaires
const passwordInput = document.getElementById("passwordInput");
const testPasswordBtn = document.getElementById("testPasswordBtn");
const passwordStrengthText = document.getElementById('passwordStrength');
const passwordScore = document.getElementById('passwordScore');
const resultContainer = document.getElementById("resultContainer");
const passwordFeedback = document.createElement("p"); // Élément pour afficher les commentaires
passwordFeedback.classList.add('password-feedback'); // Ajouter une classe pour le style
resultContainer.appendChild(passwordFeedback); // Ajouter le commentaire dans la boîte de résultats

// Fonction pour évaluer la force du mot de passe avec zxcvbn
function evaluatePasswordStrength(password) {
  const result = zxcvbn(password); // Utiliser zxcvbn pour évaluer la force
  let score = result.score; // Score de 0 à 4
  const feedback = result.feedback.suggestions.join(" "); // Récupérer les suggestions

  // Critères supplémentaires de complexité
  const lengthCriteria = password.length >= 12; // Longueur minimale
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calcul de l'entropie
  const entropy = calculateEntropy(password);
  if (entropy < 40) {
    score = Math.min(score, 2); // Entropie faible = score plus bas
  }

  // Si le mot de passe a moins de 15 caractères, on force le score à être inférieur à 10/10
  if (password.length < 20) {
    score = Math.min(score, 3); // Score maximum de 2 pour les mots de passe trop courts
  }

  // Mappage du score en note sur 10
  const scoreOnScaleOf10 = (score / 4) * 10;

  // Afficher le score et les retours
  resultContainer.style.display = "block"; // Afficher la boîte de résultats
  passwordStrengthText.innerText = `Force du mot de passe : ${getStrengthText(score)}`;
  passwordScore.innerText = `${Math.round(scoreOnScaleOf10)} / 10`;

  // Ajouter une classe de couleur selon la force
  passwordScore.className = '';
  if (score <= 1) {
    passwordScore.classList.add('weak');
  } else if (score === 2) {
    passwordScore.classList.add('moderate');
  } else if (score >= 3) {
    passwordScore.classList.add('strong');
  }

  // Afficher les suggestions de manière lisible
  if (feedback.length > 0) {
    passwordFeedback.innerText = `Problème(s) détecté(s) : ${feedback}`;
    // Ajouter une classe pour colorer le commentaire en fonction de la force du mot de passe
    passwordFeedback.classList.remove('weak', 'moderate', 'strong');
    if (score <= 1) {
      passwordFeedback.classList.add('weak');
    } else if (score === 2) {
      passwordFeedback.classList.add('moderate');
    } else {
      passwordFeedback.classList.add('strong');
    }
  } else {
    passwordFeedback.innerText = "Le mot de passe est solide !";
    passwordFeedback.classList.remove('weak', 'moderate', 'strong');
    passwordFeedback.classList.add('strong'); // Si pas de suggestion, classe "fort"
  }
}

// Fonction pour calculer l'entropie du mot de passe
function calculateEntropy(password) {
  const length = password.length;
  const uniqueChars = new Set(password).size;
  const entropy = Math.log2(Math.pow(uniqueChars, length));
  return entropy;
}

// Fonction pour obtenir le texte de la force du mot de passe en fonction du score
function getStrengthText(score) {
  switch (score) {
    case 0:
    case 1:
      return "Très faible";
    case 2:
      return "Modéré";
    case 3:
    case 4:
      return "Fort";
    default:
      return "Inconnu";
  }
}

// Ajouter un gestionnaire d'événement pour tester le mot de passe lors du clic sur le bouton
testPasswordBtn.addEventListener("click", function() {
  const password = passwordInput.value;
  evaluatePasswordStrength(password);
});

// Ajouter un gestionnaire d'événement pour la touche "Entrée"
passwordInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Empêcher la soumission par défaut du formulaire (si nécessaire)
    event.preventDefault();
    
    // Simuler un clic sur le bouton Tester
    testPasswordBtn.click();
  }
});

// Fonction pour générer un mot de passe complexe
function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Ajout d'un gestionnaire d'événements pour le bouton "Générer"
document.getElementById("generatePasswordBtn").addEventListener("click", function() {
  const password = generatePassword(16); // Générer un mot de passe de 16 caractères
  document.getElementById("generatedPassword").value = password; // Afficher le mot de passe dans le champ
});

// Fonction pour basculer la visibilité du mot de passe
document.getElementById("togglePasswordBtn").addEventListener("click", function() {
  const passwordField = document.getElementById("generatedPassword");
  const icon = this.querySelector("i");

  // Changer le type du champ input entre "password" et "text"
  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash"); // Icône "œil barré"
  } else {
    passwordField.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye"); // Icône "œil"
  }
});

