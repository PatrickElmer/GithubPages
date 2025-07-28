class GithubAPI {
    constructor(owner, repo, token) {
        this.headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
        this.url = `https://api.github.com/repos/${owner}/${repo}/contents/`
        this.sha = {path: null, value: null}
    }
    async request(path, method="GET", body=null) {
        const options = {method: method, headers: this.headers}
        if (body) {
            body.message = body.message.replace("{}", path)
            options.body = JSON.stringify(body)
        }
        const result = await fetch(this.url + path, options)
        if (result.ok) {
            return await result.json()
        }
    }
    async create(path, content) {
        await this.request(path, "PUT", {
            message: "Create '{}'",
            content: Base64.encode(content)
        })
    }
    async open(path) {
        const data = await this.request(path)
        this.sha = {path: path, value: data.sha}
        return Base64.decode(data.content)
    }
    async save(path, content) {
        if (path !== this.sha.path) {
            const data = await this.request(path)
            this.sha = {path: path, value: data.sha}
        }
        await this.request(path, "PUT", {
            message: "Update '{}'",
            content: Base64.encode(content),
            sha: this.sha.value,
        })
    }
    async remove(path) {
        await this.request(path, "DELETE", {
            message: "Delete '{}'",
            sha: this.sha,
        })
    }
}
