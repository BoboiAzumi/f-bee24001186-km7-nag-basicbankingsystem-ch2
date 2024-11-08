function randomize(){
    return (Math.floor(Math.random() * 100000000) + 1).toString() + new Date().getTime().toString()
}

module.exports = {
    randomize
}