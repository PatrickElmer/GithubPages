for (const key of ["gh_owner", "gh_repo", "gh_token"]) {
    let value = localStorage.getItem(key)
    if (value === null) {
        value = prompt(key)
        if (value !== null) localStorage.setItem(key, value)
    }
}
const api = new GithubAPI(
    owner=localStorage.getItem("gh_owner"),
    repo=localStorage.getItem("gh_repo"),
    token=localStorage.getItem("gh_token"),
)
async function _init() {
    const data = await api.request("")
    const files = data
        .filter(item => item.type === "file" && item.path.endsWith(".html"))
        .map(item => item.path.slice(0, -5))
    document.body.innerHTML = ""
    for (const file of files) {
        const a = document.createElement("a")
        a.textContent = file
        a.href = `#${file}`
        document.body.appendChild(a)
    }
}
function _logout() {
    for (const key of ["gh_owner", "gh_repo", "gh_token"]) {
        localStorage.removeItem(key)
    }
    location.reload()
}
