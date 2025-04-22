document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const addDrinkButton = document.querySelector(".add-button");
    const submitButton = document.querySelector(".submit-button");

    let drinkCount = 1;
    const drinkTemplate = document.getElementById("drink-template");

    function declOfNum(n, titles) {
        return titles[
            (n % 10 === 1 && n % 100 !== 11) ? 0
                : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1
                    : 2
            ];
    }

    function createDrinkForm() {
        drinkCount++;
        const templateContent = drinkTemplate.content.cloneNode(true);
        const newFieldset = templateContent.querySelector(".beverage");

        const beverageCount = newFieldset.querySelector(".beverage-count");
        beverageCount.textContent = `Напиток №${drinkCount}`;

        newFieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.name = `milk-${drinkCount}`;
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.innerHTML = "&times;";
        Object.assign(removeButton.style, {
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer"
        });
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
            fieldset.querySelector(".beverage-count")
                .textContent = `Напиток №${index + 1}`;

            fieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.name = `milk-${index + 1}`;
            });
        });
        drinkCount = beverages.length;
    }

    addDrinkButton.addEventListener("click", createDrinkForm);

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const beverages = document.querySelectorAll(".beverage");
        const count = beverages.length;
        const word = declOfNum(count, ["напиток", "напитка", "напитков"]);

        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "999"
        });

        const modal = document.createElement("div");
        modal.className = "modal";
        Object.assign(modal.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: "1000",
            textAlign: "center"
        });

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "&times;";
        Object.assign(closeButton.style, {
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer"
        });

        const modalText = document.createElement("p");
        modalText.textContent = `Вы заказали ${count} ${word}`;
        modalText.style.fontSize = "18px";

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "15px";

        const header = table.insertRow();
        ["Напиток", "Молоко", "Дополнительно"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            th.style.border = "1px solid #ccc";
            th.style.padding = "8px";
            th.style.textAlign = "left";
            header.appendChild(th);
        });

        beverages.forEach(fieldset => {
            const row = table.insertRow();
            const select = fieldset.querySelector("select");
            const drinkText = select.options[select.selectedIndex].textContent;
            const milkInput = fieldset.querySelector('input[type="radio"]:checked');
            const milkLabel = fieldset.querySelector(`input[value="${milkInput.value}"]`).nextElementSibling.textContent;
            const options = Array.from(fieldset.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.nextElementSibling.textContent)
                .join(", ");

            [drinkText, milkLabel, options].forEach(cellText => {
                const cell = row.insertCell();
                cell.textContent = cellText;
                cell.style.border = "1px solid #ccc";
                cell.style.padding = "8px";
            });
        });

        closeButton.addEventListener("click", () => {
            modal.remove();
            overlay.remove();
        });
        overlay.addEventListener("click", () => {
            modal.remove();
            overlay.remove();
        });

        modal.appendChild(closeButton);
        modal.appendChild(modalText);
        modal.appendChild(table);
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    });

    const firstFieldset = document.querySelector(".beverage");
    const initialRemoveButton = document.createElement("button");
    initialRemoveButton.type = "button";
    initialRemoveButton.className = "remove-button";
    initialRemoveButton.innerHTML = "&times;";
    Object.assign(initialRemoveButton.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer"
    });
    initialRemoveButton.addEventListener("click", () => {
        const beverages = document.querySelectorAll(".beverage");
        if (beverages.length > 1) {
            firstFieldset.remove();
            updateDrinkNumbers();
        }
    });
    firstFieldset.appendChild(initialRemoveButton);

    firstFieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.name = 'milk-1';
    });
});