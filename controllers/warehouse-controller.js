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
// DELETE a warehouse and all of the inventory items in the give warehouse.
const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
  try{
    const rowsDeletedInventories = await knex("inventories")
    .where("warehouse_id", warehouseId)
    .delete();

      const rowsDeletedWarehouse = await knex("warehouses")
      .where("id", warehouseId)
      .delete();


      if (rowsDeletedWarehouse === 0)  {
        return res.status(404).json({
          message: `Warehouse with ID ${warehouseId} not found`,
        });
      }
      return res.status(204).send();
    } catch(error){
    console.error(error);
    return res.status(500).send();
  }
};

export { index, findOne, inventory, deleteWarehouse };
