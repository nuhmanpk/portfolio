const siteWrap = document.querySelector(".site-wrap");
const themeSwitcher = document.querySelector(".theme-switcher");
const themeSwitcherToggleButton = document.querySelector(".themes__toggle");
const themeRadioInputs = themeSwitcher.querySelectorAll("input[type='radio']");
const content = document.querySelector(".content");
const ELEMENTS_TYPES = ["header", "main", "footer", "section", "h1", "h2", "nav", "ul", "li", "a", "p"];
const currentThemeLink = document.querySelector("#current-theme");
const allElementsInsideContent = Array.from(content.querySelectorAll("*"));
const elementsThatNeedTags = allElementsInsideContent.filter((el) => el.closest(".no-tags") === null);

const THEMES = {
    "shades-of-purple": {
        name: "Shades of Purple",
        url: "https://marketplace.visualstudio.com/items?itemName=ahmadawais.shades-of-purple",
    },
    "dracula": {
        name: "Dracula",
        url: "https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula",
    },
    "rose-pine-moon": {
        name: "Rosé Pine Moon",
        url: "https://marketplace.visualstudio.com/items?itemName=mvllow.rose-pine",
    },
    "fairyfloss": {
        name: "Fairyfloss",
        url: "https://marketplace.visualstudio.com/items?itemName=nopjmp.fairyfloss",
    },
    "oceanic": {
        name: "Oceanic",
        url: "https://marketplace.visualstudio.com/items?itemName=your-username.oceanic-theme",
    },
    "nord": {
        name: "Nord",
        url: "https://marketplace.visualstudio.com/items?itemName=your-username.nord-theme",
    },
    "solarized-dark": {
        name: "Solarized Dark",
        url: "https://marketplace.visualstudio.com/items?itemName=your-username.solarized-dark-theme",
    },
};


const init = () => {
    const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elementsThatNeedTags.forEach((el) => renderElement(el));
    themeSwitcherToggleButton.addEventListener("click", toggleThemeSwitcher);

    if (!isMotionReduced && window.innerWidth > 800) {
        Draggable.create(".site-wrap", {
            type: "x,y",
            trigger: ".window__bar",
            bounds: document.querySelector("body"),
            edgeResistance: 0.3
        });
    }
};

const getTags = (el, elType) => {
    let attribute = {};

    if (elType === "a") {
        attribute.name = `href`;
        attribute.value = `${el.getAttribute("href")}`;
    } else if (elType === "section") {
        attribute.name = `id`;
        attribute.value = `${el.getAttribute("id")}`;
    }

    if (Object.keys(attribute).length > 0) {
        attribute.el = `<span class="attr">${attribute.name}</span>=<span class="value">"${attribute.value}"</span>`;
    }

    return {
        opening: `<span class="keyword">&lt;</span>${elType}${attribute.el ? " " + attribute.el : ""}<span class="keyword">&gt;</span>`,
        closing: `<span class="keyword">&lt;/</span>${elType}<span class="keyword">&gt;</span>`,
    };
};

function createTagElement(tag) {
    return `<span aria-hidden="true" class="tag no-indent">${tag}</span>`;
}

function cleanUpWhitespace(el) {
    let elChildNodes = Array.from(el.childNodes);

    elChildNodes.forEach((childN, index) => {
        const isTextNode = childN.nodeType === 3;
        const parent = childN.parentNode;

        if (isTextNode && !childN.textContent.trim()) {
            parent.removeChild(childN);
        } else if (isTextNode && childN.textContent.trim()) {
            childN.textContent = childN.textContent.trim();
        }
    });
}

const changeBackgroundColor = () => {
    const randomColor = generateRandomColor();
    document.body.style.backgroundColor = randomColor;
}

const generateRandomColor = () => {
    const letters = "012345J6789";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

const renderElement = (el) => {
    let elType = el.tagName.toLowerCase();
    let elementTags = getTags(el, elType);

    el.insertAdjacentHTML("afterbegin", createTagElement(elementTags.opening));
    el.insertAdjacentHTML("beforeend", createTagElement(elementTags.closing));

    cleanUpWhitespace(el);
};

const toggleThemeSwitcher = (e) => {
    const isExpanded = !JSON.parse(e.currentTarget.getAttribute("aria-expanded"));
    e.currentTarget.setAttribute("aria-expanded", isExpanded);

    if (isExpanded) {
        themeRadioInputs.forEach((input) => input.addEventListener("input", handleThemeInput));
    } else {
        themeRadioInputs.forEach((input) => input.removeEventListener("input", handleThemeInput));
    }
};

const handleThemeInput = (e) => {
    const currentTheme = e.currentTarget.value;

    siteWrap.setAttribute("data-theme", currentTheme);
    currentThemeLink.textContent = THEMES[currentTheme].name;
    currentThemeLink.href = THEMES[currentTheme].url;
    renderElement(currentThemeLink);
};

document.addEventListener("DOMContentLoaded", init);