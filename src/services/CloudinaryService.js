const cloudinary = require('../configs/cloudinaryConfig'); // Thêm dòng này để import cloudinary

const uploadToCloudinary = (image) => {
    return new Promise((resolve, reject) => {
        // Nếu base64 có phần prefix "data:image/..." thì giữ nguyên, nếu không thì thêm vào
        const imageData = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

        cloudinary.uploader.upload(
            imageData,
            {
                folder: 'EroShop/productImages',
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('Lỗi khi upload ảnh:', error);
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );
    });
};

module.exports = {
    uploadToCloudinary,
};
