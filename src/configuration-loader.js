function loadConfiguration() {
    const configPath = getConfigPath();
    const script = document.createElement("script");
    script.type = "module";
    script.src = configPath;

    document.head.appendChild(script);
}

function getConfigPath() {
    const urlParams = new URLSearchParams(window.location.href);
    if (urlParams.has("config")) {
        return `configurations/${urlParams.get("config")}.js`;
    }
    return "configurations/default.js";
}

loadConfiguration();
