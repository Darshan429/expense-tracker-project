// server/controllers/receipt.controller.js
// MOCK VERSION — replace with real OpenAI when you have API key

const VALID_CATEGORIES = ['Travel', 'Meals', 'Software', 'Office', 'Other'];

exports.scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No receipt image uploaded' });
    }

    // Simulate 2 second AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
      success: true,
      data: {
        amount:      1250.00,
        vendor:      'Mock Vendor Pvt Ltd',
        category:    'Travel',
        date:        new Date().toISOString().split('T')[0],
        description: 'Mock receipt — add OpenAI key to enable real scanning'
      }
    });

  } catch (error) {
    console.error('Receipt scan error:', error);
    res.status(500).json({ error: 'Receipt scanning failed' });
  }
};

function isValidDate(str) {
  if (!str || typeof str !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d);
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}