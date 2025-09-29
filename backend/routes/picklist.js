const express = require("express");
const router = express.Router();

// GET /api/picklist - Get all picklist items
router.get("/", (req, res) => {
  res.json({
    message: "Get all picklist items",
    data: [],
  });
});

// POST /api/picklist - Create new picklist item
router.post("/", (req, res) => {
  const { ordernumber, designid, productSku, description, warehouselocation } =
    req.body;

  res.json({
    message: "Picklist item created",
    data: {
      ordernumber,
      designid,
      productSku,
      description,
      warehouselocation,
    },
  });
});

// PUT /api/picklist/:id/pick - Mark item as picked
router.put("/:id/pick", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `Item ${id} marked as picked`,
    data: {
      id,
      picked: true,
      pickedAt: new Date().toISOString(),
    },
  });
});

// GET /api/picklist/batch/:batchId - Get items by batch
router.get("/batch/:batchId", (req, res) => {
  const { batchId } = req.params;

  res.json({
    message: `Get items for batch ${batchId}`,
    data: [],
  });
});

module.exports = router;
