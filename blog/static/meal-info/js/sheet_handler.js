const foodEmojis = [
    "🍆",
    "🥔",
    "🥕",
    "🌽",
    "🌶️",
    "🫑",
    "🥒",
    "🥬",
    "🥦",
    "🧄",
    "🧅",
    "🫘",
    "🍖",
    "🍗",
    "🥩",
    "🥗",
    "🥚",
    "🍛",
    "🥛",
    "🍽️",
];
const randomEmoji =
    foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#food-emoji").innerHTML = randomEmoji;
    changeFavicon();
});

function changeFavicon() {
    document.querySelector(
        "link[rel~='icon']"
    ).href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${randomEmoji}</text></svg>`;
}

setTimeout(loadSheet, 400);

function loadSheet() {
    fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQrJgFgWrx8wV5VtwINSpGashMSD2YCgpDLf9_7UiMMdEiWIjqadpugRVPyDfvjAzwRK0PLcmC3E_aK/pubhtml?gid=1252127450&single=true"
    )
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const parsedHTML = parser.parseFromString(html, "text/html");
            parsedHTML.querySelector("title").innerHTML =
                "Meal Information | Alam Student Palace";
            parsedHTML.querySelector("#doc-title").innerHTML =
                "Meal information";
            parsedHTML.querySelector("#doc-title").classList.add("head-text");
            table = parsedHTML.querySelector("table > tbody");
            let tableRowString = "";
            for (let rowNum = 0; rowNum < 76; rowNum++) {
                let rowElement = table.children[rowNum];
                rowElement.children[0].children[0].innerHTML = " ";
                tableRowString += table.children[rowNum].outerHTML;
            }
            table.innerHTML = tableRowString;

            let date_cell = table.querySelector(
                "tr:nth-child(1) > td:nth-child(3)"
            );

            const currentTime = new Date();
            const alertingTime = new Date();
            alertingTime.setHours(22);
            alertingTime.setMinutes(15);

            if (currentTime > alertingTime) {
                date_cell.classList.add("blinking-date");
            }

            parsedHTML.querySelector("#footer > span").innerHTML =
                'Made with ❤️ by <a target="_blank title="Visit portfolio" href="https://jarx64.com">Jahangir Alam Rocky</a>';

            const footer = parsedHTML.querySelector("#footer");
            footer.children[1].remove();
            footer.children[1].remove();
            footer.children[2].innerHTML = "Updated automatically everyday";

            parsedHTML.head.innerHTML += `<link rel="stylesheet" href="css/style.css" />`;
            parsedHTML.head.innerHTML += `
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJDQJWPFCC"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-KJDQJWPFCC');
            </script>
            `;

            document.write(
                parsedHTML.head.outerHTML + parsedHTML.body.outerHTML
            );
            changeFavicon();
        })
        .catch((err) => {
            console.log(err);
        });
}
