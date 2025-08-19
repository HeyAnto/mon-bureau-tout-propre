// Constantes
const BASE_PRICE_PER_M2 = 1.5;
const TVA_RATE = 0.2;
const WINDOW_CLEANING_SURCHARGE = 0.1;

// Éléments
const officeAreaInput = document.getElementById("officeArea");
const cleaningFrequencySelect = document.getElementById("cleaningFrequency");
const windowCleaningCheckbox = document.getElementById("cleaningType");
const montantHTElement = document.querySelector(
  ".ticket-item:nth-child(1) .ticket-amount"
);
const tvaElement = document.querySelector(
  ".ticket-item:nth-child(2) .ticket-amount"
);
const montantTTCElement = document.querySelector(".ticket-amount-ttc");

// Calculer le prix
function calculatePrice() {
  const surface = parseFloat(officeAreaInput.value) || 0;
  const frequency = parseInt(cleaningFrequencySelect.value) || 1;
  const includeWindows = windowCleaningCheckbox.checked;

  // Vérification
  if (surface <= 0) {
    resetDisplay();
    return;
  }

  // A. Calcul du tarif de base
  const basePrice = surface * BASE_PRICE_PER_M2;

  // B. Application de la fréquence
  const priceWithFrequency = basePrice * frequency;

  // C. Application des options (vitres)
  const finalPriceHT = includeWindows
    ? priceWithFrequency * (1 + WINDOW_CLEANING_SURCHARGE)
    : priceWithFrequency;

  // D. Calcul de la TVA et du montant TTC
  const tva = finalPriceHT * TVA_RATE;
  const priceTTC = finalPriceHT + tva;

  // Mise à jour de l'affichage
  updateDisplay(finalPriceHT, tva, priceTTC);
}

// Update affichage
function updateDisplay(montantHT, tva, montantTTC) {
  montantHTElement.textContent = `${montantHT.toFixed(2)} €`;
  tvaElement.textContent = `${tva.toFixed(2)} €`;
  montantTTCElement.textContent = `${montantTTC.toFixed(2)} €`;
}

// Réinitialiser l'affichage
function resetDisplay() {
  montantHTElement.textContent = "0.00 €";
  tvaElement.textContent = "0.00 €";
  montantTTCElement.textContent = "0.00 €";
}

// Valider la saisie
function validateSurfaceInput(event) {
  const value = event.target.value;
  // Sécurité
  const validValue = value.replace(/[^0-9.,]/g, "");
  const normalizedValue = validValue.replace(",", ".");

  const parts = normalizedValue.split(".");
  if (parts.length > 2) {
    event.target.value = parts[0] + "." + parts.slice(1).join("");
  } else {
    event.target.value = normalizedValue;
  }
}

// Écouteurs d'événements
document.addEventListener("DOMContentLoaded", function () {
  calculatePrice();

  // Recalculer automatiquement
  officeAreaInput.addEventListener("input", function (event) {
    validateSurfaceInput(event);
    calculatePrice();
  });

  cleaningFrequencySelect.addEventListener("change", calculatePrice);
  windowCleaningCheckbox.addEventListener("change", calculatePrice);

  // Validation
  officeAreaInput.addEventListener("keypress", function (event) {
    const char = String.fromCharCode(event.which);
    if (!/[0-9.,]/.test(char)) {
      event.preventDefault();
    }
  });
});
