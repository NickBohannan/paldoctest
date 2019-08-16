function getDate() {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yy = today.getFullYear()
    return mm + "/" + dd + "/" + yy
}

module.exports = getDate