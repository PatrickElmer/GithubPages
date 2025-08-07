class GithubAPI {
    constructor(owner, repo, token) {
        this.headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
        this.url = `https://api.github.com/repos/${owner}/${repo}/contents/`
    }
    async request(path, method="GET", body=null) {
        const options = {method: method, headers: this.headers}
        if (body) {
            body.message = body.message.replace("{}", path)
            options.body = JSON.stringify(body)
        }
        const response = await fetch(this.url + path, options)
        if (response.ok) {
            console.debug(method, path, "request successful!")
            return await response.json()
        }
        console.warn(method, path, "request failed!", response.status)
        return null
    }
    async create(path, content) {
        await this.request(path, "PUT", {
            message: "Create '{}'",
            content: Base64.encode(content)
        })
    }
    async open(path) {
        const data = await this.request(path)
        if (data == null) return ""
        return Base64.decode(data.content)
    }
    async save(path, content) {
        const data = await this.request(path)
        await this.request(path, "PUT", {
            message: "Update '{}'",
            content: Base64.encode(content),
            sha: data.sha,
        })
    }
    async remove(path) {
        const data = await this.request(path)
        await this.request(path, "DELETE", {
            message: "Delete '{}'",
            sha: data.sha,
        })
    }
}
