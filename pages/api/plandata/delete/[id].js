import cosmosSingleton from "../../../../lib/cosmos";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await cosmosSingleton.initialize();
      const container = cosmosSingleton.getContainer();

      const { resource: existingData } = await container.item(id, id).read();

      if (!existingData) {
        res.status(404).json({ message: "Data not found." });
        return;
      }

      await container.item(id, id).delete();
      res.status(200).json({ message: "Data deleted successfully." });
    } catch (error) {
      console.error("Error deleting data:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
