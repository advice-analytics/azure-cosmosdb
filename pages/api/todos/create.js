import { v4 as uuidv4 } from "uuid";
import cosmosSingleton from "../../../lib/cosmos";
import { clean } from "../../../lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await cosmosSingleton.initialize();
      const container = cosmosSingleton.getContainer();

      // Assuming req.body contains the data to be created
      const { data } = req.body;
      
      // Generate a unique ID for the new data item
      const id = uuidv4();

      // Construct the new data item with required properties
      const newDataItem = { id, ...data };

      // Create the new data item in the Cosmos DB container
      const { resource: createdDataItem } = await container.items.create(clean(newDataItem));

      // Return the created data item in the response
      res.status(201).json(createdDataItem);
    } catch (error) {
      console.error("Error creating data:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
