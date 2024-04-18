import cosmosSingleton from "../../../../lib/cosmos";
import { clean } from "../../../../lib/utils";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      await cosmosSingleton.initialize();
      const container = cosmosSingleton.getContainer();
      
      const updatedData = req.body;

      const { resource: existingData } = await container.item(id, id).read();

      if (!existingData) {
        res.status(404).json({ message: "Data not found." });
        return;
      }

      const updatedItem = { ...existingData, ...clean(updatedData) };
      await container.item(id, id).replace(updatedItem);

      res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating data:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
