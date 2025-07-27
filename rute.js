const _root = document.getElementById('rute') || document.body
let _rute = {
    ext: _root.getAttribute('ext') || 'html',
    dir: _root.getAttribute('dir') || 'pages',
    version: _root.getAttribute('version') || '',
    page_404: _root.getAttribute('404'),
    default: _root.getAttribute('default') || 'index',
    backend: _root.getAttribute('backend') || '',
}

let rute = {}

window.addEventListener('DOMContentLoaded', onRouteChange)
window.addEventListener('hashchange', onRouteChange)

async function onRouteChange() {
    let hashParams = getHashParams()
    if (hashParams.hash === null) {
        _init()
    } else {
        const content = await api.open(`${hashParams.hash}.${_rute.ext}`)
        updateContent(apply_conversions(content, hashParams))
    }
}

function getHashParams() {
    const [hash, query] = window.location.hash.split('?', 2)
    return {
        'hash': hash.substring(1).replace(/^\//, '') || null,//_rute.default,
        'query': Object.fromEntries(new URLSearchParams(query || window.location.search).entries())
    }
}

function apply_conversions(content, data) {
    Object.values(rute).forEach(fn => { content = fn(content, data) })
    return content
}

function updateContent(content) {
    _root.innerHTML = content
    _root.scrollTo(0, 0)
}
