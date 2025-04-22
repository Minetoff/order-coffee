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

        const textareaLabel = document.createElement("label");
        textareaLabel.className = "textarea-label";
        textareaLabel.textContent = "И еще вот что";

        const textarea = document.createElement("textarea");
        textarea.className = `additional-notes additional-notes-${drinkCount}`;

        const previewText = document.createElement("p");
        previewText.className = "preview-text";

        textarea.addEventListener("input", () => {
            const highlightedText = textarea.value.replace(
                /(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)/gi,
                m => `<b>${m}</b>`
            );
            previewText.innerHTML = highlightedText;
        });

        newFieldset.appendChild(textareaLabel);
        newFieldset.appendChild(textarea);
        newFieldset.appendChild(previewText);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.innerHTML = "&times;";
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
        beverages.forEach((fs, i) => {
            fs.querySelector(".beverage-count").textContent = `Напиток №${i + 1}`;
            fs.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.name = `milk-${i + 1}`;
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
        overlay.className = "overlay";

        const modal = document.createElement("div");
        modal.className = "modal";

        const closeButton = document.createElement("button");
        closeButton.className = "modal-close";
        closeButton.innerHTML = "&times;";
        closeButton.addEventListener("click", () => {
            modal.remove(); overlay.remove();
        });
        overlay.addEventListener("click", () => {
            modal.remove(); overlay.remove();
        });

        const modalText = document.createElement("p");
        modalText.className = "modal-text";
        modalText.textContent = `Вы заказали ${count} ${word}`;

        const table = document.createElement("table");
        table.className = "order-table";
        const header = table.insertRow();
        ["Напиток", "Молоко", "Дополнительно", "Пожелания"].forEach(txt => {
            const th = document.createElement("th");
            th.textContent = txt;
            header.appendChild(th);
        });
        beverages.forEach(fs => {
            const row = table.insertRow();
            const drink = fs.querySelector("select").selectedOptions[0].textContent;
            const milk = fs.querySelector('input[type="radio"]:checked').nextElementSibling.textContent;
            const opts = Array.from(fs.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.nextElementSibling.textContent).join(", ");
            const notes = fs.querySelector("textarea").value;
            [drink, milk, opts, notes].forEach(val => {
                const cell = row.insertCell();
                cell.textContent = val;
            });
        });

        const timeLabel = document.createElement("label");
        timeLabel.className = "time-label";
        timeLabel.textContent = "Выберите время заказа:";

        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.className = "time-input";

        const confirmBtn = document.createElement("button");
        confirmBtn.type = "button";
        confirmBtn.className = "confirm";
        confirmBtn.textContent = "Оформить";
        confirmBtn.addEventListener("click", () => {
            const val = timeInput.value;
            if (!val) return;
            const [h, m] = val.split(":").map(Number);
            const now = new Date();
            const sel = new Date(now);
            sel.setHours(h, m, 0, 0);
            if (sel <= now) {
                timeInput.style.border = "2px solid red";
                alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее");
            } else {
                modal.remove(); overlay.remove();
            }
        });

        modal.appendChild(closeButton);
        modal.appendChild(modalText);
        modal.appendChild(table);
        modal.appendChild(timeLabel);
        modal.appendChild(timeInput);
        modal.appendChild(confirmBtn);
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    });

    const firstFieldset = document.querySelector(".beverage");
    const textareaLabel = document.createElement("label");
    textareaLabel.className = "textarea-label";
    textareaLabel.textContent = "И еще вот что";
    const textarea = document.createElement("textarea");
    textarea.className = "additional-notes additional-notes-1";
    const previewText = document.createElement("p");
    previewText.className = "preview-text";
    textarea.addEventListener("input", () => {
        const highlightedText = textarea.value.replace(
            /(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)/gi,
            m => `<b>${m}</b>`
        );
        previewText.innerHTML = highlightedText;
    });
    firstFieldset.appendChild(textareaLabel);
    firstFieldset.appendChild(textarea);
    firstFieldset.appendChild(previewText);
    const initialRemoveButton = document.createElement("button");
    initialRemoveButton.type = "button";
    initialRemoveButton.className = "remove-button";
    initialRemoveButton.innerHTML = "&times;";
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
