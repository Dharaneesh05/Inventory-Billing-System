const express = require('express');
const router = express.Router();
const {
    getAllDesigners,
    getDesignerById,
    createDesigner,
    updateDesigner,
    deleteDesigner
} = require('../controllers/designerController');

router.route('/')
    .get(getAllDesigners)
    .post(createDesigner);

router.route('/:id')
    .get(getDesignerById)
    .put(updateDesigner)
    .delete(deleteDesigner);

module.exports = router;
