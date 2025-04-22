document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const addDrinkButton = document.querySelector(".add-button");
    const submitButton = document.querySelector(".submit-button");
  
    let drinkCount = 1;
  
    const drinkTemplate = document.getElementById("drink-template");
  
    function createDrinkForm() {
      drinkCount++;
      const templateContent = drinkTemplate.content.cloneNode(true);
      const newFieldset = templateContent.querySelector(".beverage");
  
      const beverageCount = newFieldset.querySelector(".beverage-count");
      beverageCount.textContent = `Напиток №${drinkCount}`;
  
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-button";
      removeButton.innerHTML = "&times;";
      removeButton.style.position = "absolute";
      removeButton.style.top = "5px";
      removeButton.style.right = "5px";
      removeButton.style.backgroundColor = "transparent";
      removeButton.style.border = "none";
      removeButton.style.fontSize = "20px";
      removeButton.style.cursor = "pointer";
  
      removeButton.addEventListener("click", () => {
        const beverages = document.querySelectorAll(".beverage");
        if (beverages.length > 1) {
          newFieldset.remove();
          updateDrinkNumbers();
        }
      });
  
      newFieldset.appendChild(removeButton);
      form.insertBefore(newFieldset, addDrinkButton.parentElement);
    }
  
    function updateDrinkNumbers() {
      const beverages = document.querySelectorAll(".beverage");
      beverages.forEach((fieldset, index) => {
        const beverageCount = fieldset.querySelector(".beverage-count");
        beverageCount.textContent = `Напиток №${index + 1}`;
      });
    }
  
    addDrinkButton.addEventListener("click", createDrinkForm);
  
    submitButton.addEventListener("click", (event) => {
      event.preventDefault(); 

      const modal = document.createElement("div");
      modal.className = "modal";
      modal.style.position = "fixed";
      modal.style.top = "50%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.width = "500px";
      modal.style.padding = "20px";
      modal.style.backgroundColor = "#fff";
      modal.style.borderRadius = "8px";
      modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      modal.style.zIndex = "1000";
      modal.style.textAlign = "center";
  
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "&times;";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.style.backgroundColor = "transparent";
      closeButton.style.border = "none";
      closeButton.style.fontSize = "24px";
      closeButton.style.cursor = "pointer";
  
      const modalText = document.createElement("p");
      modalText.textContent = "Заказ принят!";
      modalText.style.fontSize = "18px";
  
      modal.appendChild(closeButton);
      modal.appendChild(modalText);
  
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.zIndex = "999";
  
      document.body.appendChild(overlay);
      document.body.appendChild(modal);
  
      closeButton.addEventListener("click", () => {
        modal.remove();
        overlay.remove();
      });
  
      overlay.addEventListener("click", () => {
        modal.remove();
        overlay.remove();
      });
    });

    const firstFieldset = document.querySelector(".beverage");
    const initialRemoveButton = document.createElement("button");
    initialRemoveButton.type = "button";
    initialRemoveButton.className = "remove-button";
    initialRemoveButton.innerHTML = "&times;";
    initialRemoveButton.style.position = "absolute";
    initialRemoveButton.style.top = "5px";
    initialRemoveButton.style.right = "5px";
    initialRemoveButton.style.backgroundColor = "transparent";
    initialRemoveButton.style.border = "none";
    initialRemoveButton.style.fontSize = "20px";
    initialRemoveButton.style.cursor = "pointer";
  
    initialRemoveButton.addEventListener("click", () => {
      const beverages = document.querySelectorAll(".beverage");
      if (beverages.length > 1) {
        firstFieldset.remove();
        updateDrinkNumbers();
      }
    });
  
    firstFieldset.appendChild(initialRemoveButton);
  });