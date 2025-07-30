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
const filelist = {files: null}
async function _init() {
    const data = await api.request("")
    const files = data
        .filter(item => item.type === "file" && item.path.endsWith(".md"))
        .map(item => item.path.slice(0, -3))
    filelist.files = files
    _render_filelist(files)
}
function _render_filtered_filelist() {
    const search = document.querySelector("input[name='search']")
    _render_filelist(filelist.files.filter(filename => filename.includes(search.value.toLowerCase())))
}
function _render_filelist(files) {
    const element = document.getElementById('rute') || document.body
    element.innerHTML = ""
    if (!document.querySelector("header")) {
        const header = document.createElement("header")
        const nav = document.createElement("nav")
        const input = document.createElement("input")
        input.type = "search"
        input.name = "search"
        input.onkeyup = function() {
            _render_filtered_filelist()
        }
        nav.appendChild(input)
        header.appendChild(nav)
        element.parentElement.prepend(header)
    }
    const ul = document.createElement("ul")
    ul.style.textTransform = "capitalize"
    for (const file of files) {
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.textContent = file.replace("-", " ")
        a.href = `#${file}`
        li.appendChild(a)
        ul.appendChild(li)
    }
    element.appendChild(ul)
}
function _logout() {
    for (const key of ["gh_owner", "gh_repo", "gh_token"]) {
        localStorage.removeItem(key)
    }
    location.reload()
}
