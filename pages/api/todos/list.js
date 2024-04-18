import cosmosSingleton from "../../../lib/cosmos";

export default async function handle(req, res) {
  try {
    await cosmosSingleton.initialize();
    const container = cosmosSingleton.getContainer();

    if (req.method === "GET") {
      const { resources: plans } = await container.items.query("SELECT * from plandata").fetchAll();
      res.status(200).json(plans);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
