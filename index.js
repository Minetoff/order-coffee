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
        textareaLabel.textContent = "И еще вот что";
        textareaLabel.style.display = "block";
        textareaLabel.style.marginTop = "10px";

        const textarea = document.createElement("textarea");
        textarea.className = `additional-notes-${drinkCount}`;
        textarea.style.width = "100%";
        textarea.style.height = "50px";
        textarea.style.marginBottom = "10px";

        const previewText = document.createElement("p");
        previewText.style.marginTop = "5px";

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
        Object.assign(overlay.style, {
            position: "fixed", top: "0", left: "0",
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: "999"
        });

        const modal = document.createElement("div");
        modal.className = "modal";
        Object.assign(modal.style, {
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px", padding: "20px",
            backgroundColor: "#fff", borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)", zIndex: "1000",
            textAlign: "center"
        });

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "&times;";
        Object.assign(closeButton.style, {
            position: "absolute", top: "10px", right: "10px",
            backgroundColor: "transparent", border: "none",
            fontSize: "24px", cursor: "pointer"
        });
        closeButton.addEventListener("click", () => {
            modal.remove();
            overlay.remove();
        });
        overlay.addEventListener("click", () => {
            modal.remove();
            overlay.remove();
        });

        const modalText = document.createElement("p");
        modalText.textContent = `Вы заказали ${count} ${word}`;
        modalText.style.fontSize = "18px";

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "15px";
        const header = table.insertRow();
        ["Напиток", "Молоко", "Дополнительно", "Пожелания"].forEach(txt => {
            const th = document.createElement("th");
            th.textContent = txt;
            th.style.border = "1px solid #ccc";
            th.style.padding = "8px";
            th.style.textAlign = "left";
            header.appendChild(th);
        });
        beverages.forEach(fs => {
            const row = table.insertRow();
            const drink = fs.querySelector("select").selectedOptions[0].textContent;
            const milk = fs.querySelector('input[type="radio"]:checked')
                .nextElementSibling.textContent;
            const opts = Array.from(fs.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.nextElementSibling.textContent).join(", ");
            const notes = fs.querySelector("textarea").value;
            [drink, milk, opts, notes].forEach(val => {
                const cell = row.insertCell();
                cell.textContent = val;
                cell.style.border = "1px solid #ccc";
                cell.style.padding = "8px";
            });
        });

        const timeLabel = document.createElement("label");
        timeLabel.textContent = "Выберите время заказа:";
        timeLabel.style.display = "block";
        timeLabel.style.marginTop = "15px";
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.style.fontSize = "16px";

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
                modal.remove();
                overlay.remove();
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
    textareaLabel.textContent = "И еще вот что";
    textareaLabel.style.display = "block";
    textareaLabel.style.marginTop = "10px";
    const textarea = document.createElement("textarea");
    textarea.className = "additional-notes-1";
    textarea.style.width = "100%";
    textarea.style.height = "50px";
    textarea.style.marginBottom = "10px";
    const previewText = document.createElement("p");
    previewText.style.marginTop = "5px";
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
    Object.assign(initialRemoveButton.style, {
        position: "absolute", top: "5px", right: "5px",
        backgroundColor: "transparent", border: "none",
        fontSize: "20px", cursor: "pointer"
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