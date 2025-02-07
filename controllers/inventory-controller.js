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
    console.log(err);
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

    const inventoryData = inventoryFound[0];
    res.status(200).json(inventoryData);
  } catch (error) {
    console.log(error);
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

  // Validate that field can only be 'In Stock' or 'Out of Stock')
  const validStatuses = ["In Stock", "Out of Stock"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Valid statuses are: 'In stock', 'Out of Stock'.",
    });
  }

  // Regex validation for fields
  const itemNameRegex = /^[a-zA-Z0-9\s]+$/;
  if (!itemNameRegex.test(item_name)) {
    return res.status(400).json({
      error: "Item name must contain only letters, numbers, and spaces.",
    });
  }

  const descriptionRegex = /^[a-zA-Z0-9\s,\.!?\-]*$/;
  if (description && !descriptionRegex.test(description)) {
    return res.status(400).json({
      error: "Description contains invalid characters.",
    });
  }

  const categoryRegex = /^[A-Z][a-zA-Z\s]*$/;
  if (!categoryRegex.test(category)) {
    return res.status(400).json({
      error:
        "Category should start with a capital letter and only contain letters and spaces.",
    });
  }

  try {
    // Validate if the warehouse exists
    const warehouse = await knex("warehouses")
      .select("id")
      .where("id", warehouse_id)
      .first();

    if (!warehouse) {
      return res.status(400).json({ error: "Invalid warehouse name" });
    }

    // Insert new inventory
    const [newInventoryId] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    // Fetch the newly added inventory
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

export { index, findOne, addInventory };
