const express = require('express');
const { check } = require('express-validator');

const itemsController = require('../controllers/items-controller');
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', itemsController.getItems);
router.get('/:id', itemsController.getItemById);


// router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .isString(),
        check('description')
        .isLength({ min: 10 })
        .not()
        .isEmpty()
        .isString(),
        check('price')
            .not()
            .isEmpty()
            .isNumeric(),
            
        check('endDate')
            .not()
            .isEmpty()
    ],
    itemsController.createItem
);

router.patch(
    '/:id',
    [
        check('name')
        .not()
        .isEmpty(),
    check('description').isLength({ min: 10 }),
    check('endDate')
        .not()
        .isEmpty()
            
          

    ],
    itemsController.updateItem
);
router.patch(
    '/addBid/:id',
    [
        check('bid')
            .not()
            .isNumeric(),

    ],
    itemsController.updateItemBids
);

router.delete('/:id', itemsController.deleteItem);

module.exports = router;
