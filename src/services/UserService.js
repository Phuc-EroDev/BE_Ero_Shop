const createUser = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({});
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

module.exports = {
    createUser
};
