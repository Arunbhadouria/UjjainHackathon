const { Zone } = require('../models');
const { io } = require('../src/server');

// Create Zone
exports.createZone = async (req, res) => {
  try {
    const { name, capacity, colorCode, boundary } = req.body;
    const zone = await Zone.create({
      name,
      capacity,
      colorCode,
      boundary: boundary ? { type: 'Polygon', coordinates: boundary } : null,
    });
    res.status(201).json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Zones
exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Zone
exports.updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, colorCode, boundary } = req.body;
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    await zone.update({
      name,
      capacity,
      colorCode,
      boundary: boundary ? { type: 'Polygon', coordinates: boundary } : null,
    });
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Zone
exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    await zone.destroy();
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePopulation = async (req, res) => {
  try {
    const { zoneId, tagId } = req.body;
    const zone = await Zone.findByPk(zoneId);
    if (!zoneId || !tagId) {
      return res.status(400).json({ error: 'zoneId and tagId are required' });
    }
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    // Simulate RFID detection (increment population)
    zone.currentPopulation += 1;
    await zone.save();

    // Emit real-time update
    req.app.get('io').emit('populationUpdate', {
      zoneId,
      currentPopulation: zone.currentPopulation,
    });

    res.json({ message: 'Population updated', currentPopulation: zone.currentPopulation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};