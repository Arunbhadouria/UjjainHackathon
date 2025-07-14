const express = require('express');
const router = express.Router();
const { createZone, getZones, updateZone, deleteZone, updatePopulation } = require('../controllers/zoneController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, createZone);
router.get('/', authenticateToken, getZones);
router.put('/:id', authenticateToken, updateZone);
router.delete('/:id', authenticateToken, deleteZone);
router.post('/population', authenticateToken, updatePopulation);

module.exports = router;