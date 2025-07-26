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
const path = document.querySelector("input[name='gh_path']")
const contents = document.querySelector("textarea[name='content']")
async function _open() {
    contents.value = await api.open(path.value)
}
async function _save() {
    await api.save(path.value, contents.value)
}
async function _init() {
    const files = await api.filelist()
    for (const file of files) {
        const p = document.createElement("p")
        p.textContent = file
        document.body.appendChild(p)
    }
}
function _logout() {
    for (const key of ["gh_owner", "gh_repo", "gh_token"]) {
        localStorage.removeItem(key)
    }
    location.reload()
}
addEventListener("DOMContentLoaded", (event) => {
    _init()
})
