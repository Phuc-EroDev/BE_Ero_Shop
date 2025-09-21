const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dopozqhqk',
    api_key: '856986995914181',
    api_secret: 'Q0zwaUnzMyUjS2FEtiDiI6gcgFc' // Nên di chuyển secret này vào biến môi trường (.env) 
});

module.exports = cloudinary;