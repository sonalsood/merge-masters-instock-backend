import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// GET all warehouse items
const index = async (_req, res) => {
  try {
    const items = await knex("warehouses").select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    );
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error getting warehouse items.");
  }
};

// GET single warehouse items
const findOne = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .where({
        id: req.params.id,
      });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehouseFound[0];
    res.status(200).json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

//Edit warehouse
const editWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res
      .status(400)
      .json("Error adding warehouse because of missing properties");
  }
  if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(contact_phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }
  if (!/\S+@\S+\.\S+/.test(contact_email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  try {
    const warehouseId = await knex("warehouses").where({id: req.params.id}).update(req.body)
  }
};

//POST warehouse
const addWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res
      .status(400)
      .json("Error adding warehouse because of missing properties");
  }
  if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(contact_phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }
  if (!/\S+@\S+\.\S+/.test(contact_email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const newWarehouseId = await knex("warehouses").insert(req.body);
    const newWarehouse = await knex("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .where({
        id: newWarehouseId[0],
      });
    res.status(201).json(newWarehouse);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Error adding warehouse. ${error}` });
  }
};

// a list of all inventories for a given warehouse ID
const inventory = async (req, res) => {
  try {
    const posts = await knex("warehouses")
      .join("inventories", "inventories.warehouse_id", "warehouses.id")
      .where({ warehouse_id: req.params.id })
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({
      message: `no inventory found with this warehouse ID ${req.params.id}: ${error}`,
    });
  }
};

export { index, findOne, editWarehouse, addWarehouse, inventory };
