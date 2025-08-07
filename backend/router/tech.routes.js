const express = require('express');
const router = express.Router();
const {
    createTech,
    getAllTechs,
    getTechById,
    updateTech,
    deleteTech
} = require('../controller/tech.controller');
const { uploadHandlers, handleMulterError, convertJfifToJpeg } = require('../middleware/imageupload');

// For single image upload with field name 'image'
router.post(
    '/',
    uploadHandlers.single('image'),
    convertJfifToJpeg,
    handleMulterError,
    createTech
);

router.get('/', getAllTechs);
router.get('/:id', getTechById);

router.put(
    '/:id',
    uploadHandlers.single('image'),
    convertJfifToJpeg,
    handleMulterError,
    updateTech
);

router.delete('/:id', deleteTech);
router.patch('/:id/toggle-status', require('../controller/tech.controller').toggleTechStatus);

module.exports = router; 