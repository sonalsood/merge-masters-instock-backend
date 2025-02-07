import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all the inventory items
const index = async (_req, res) => {
  try {
    const items = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error retrieving inventory items.");
  }
};

// GET single inventory item
const findOne = async (req, res) => {
  try {
    const inventoryFound = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", req.params.id);

    if (inventoryFound.length === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(inventoryFound[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Unable to retrieve inventory data for inventory with ID ${req.params.id}`,
    });
  }
};

// POST inventory
const addInventory = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  // Missing fields notification
  if (!warehouse_id) {
    return res.status(400).json({ error: "Warehouse name is required" });
  }
  if (!item_name) {
    return res.status(400).json({ error: "Item name is required" });
  }
  if (quantity === undefined || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const validStatuses = ["In Stock", "Out of Stock"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Valid statuses are: 'In Stock', 'Out of Stock'.",
    });
  }

  if (status === "Out of Stock" && quantity > 0) {
    return res.status(400).json({
      error: "If status is 'Out of Stock', quantity must be 0.",
    });
  }

  if (status === "In Stock" && quantity <= 0) {
    return res.status(400).json({
      error: "If status is 'In Stock', quantity must be greater than 0.",
    });
  }

  try {
    const warehouse = await knex("warehouses")
      .select("id")
      .where("id", warehouse_id)
      .first();

    if (!warehouse) {
      return res.status(400).json({ error: "Invalid warehouse name" });
    }

    // Insert new inventory to database
    const [newInventoryId] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    // Fetch newly added inventory
    const newInventory = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "warehouses.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", newInventoryId)
      .first();

    res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding inventory." });
  }
};

// EDIT/PUT inventory
const editInventory = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  // VALIDATION
  if (!warehouse_id) {
    return res.status(400).json({ error: "Warehouse name is required" });
  }
  if (!item_name) {
    return res.status(400).json({ error: "Item name is required" });
  }
  if (quantity === undefined || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const validStatuses = ["In Stock", "Out of Stock"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Valid statuses are: 'In Stock', 'Out of Stock'.",
    });
  }

  if (status === "Out of Stock" && quantity > 0) {
    return res.status(400).json({
      error: "If status is 'Out of Stock', quantity must be 0.",
    });
  }

  if (status === "In Stock" && quantity <= 0) {
    return res.status(400).json({
      error: "If status is 'In Stock', quantity must be greater than 0.",
    });
  }

  try {
    const warehouse = await knex("warehouses")
      .select("id")
      .where("id", warehouse_id)
      .first();

    if (!warehouse) {
      return res.status(400).json({ error: "Invalid warehouse name" });
    }

    // Insert updated inventory to database
    const rowAffected = await knex("inventories")
      .where({ id: req.params.id })
      .update({
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity,
      });

    if (rowAffected === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    // Fetch updated inventory
    const editedInventory = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", req.params.id)
      .first();

    res.status(200).json(editedInventory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: `Error updating inventory. ${error}` });
  }
};

export { index, findOne, addInventory, editInventory };
