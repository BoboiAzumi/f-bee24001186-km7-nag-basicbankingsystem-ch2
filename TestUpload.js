const { ImageKitService } = require('./services/ImageKit');

const imagekit = new ImageKitService()

imagekit.upload('./img/4120337065a644c8120f690ba5c63d91.jpg', 'itsuki')