const { CosmosClient } = require("@azure/cosmos");
const { cosmosdbConnect, cosmosDatabase, cosmosContainer } = require("../constants/env");

class CosmosSingleton {
  constructor() {
    this.database = null;
    this.container = null;
  }

  async initialize() {
    if (!this.database || !this.container) {
      const client = new CosmosClient(cosmosdbConnect);
      this.database = client.database(cosmosDatabase);
      this.container = this.database.container(cosmosContainer);

      await this.database.read(); // Ensures database is initialized

      // Ensure container exists with '/id' partition key
      await this.container.read();
      if (!this.container) {
        await this.database.containers.createIfNotExists({
          id: cosmosContainer,
          partitionKey: { paths: ["/id"] }
        });
        this.container = this.database.container(cosmosContainer);
      }
    }
  }

  getDatabase() {
    return this.database;
  }

  getContainer() {
    return this.container;
  }
}

const cosmosSingleton = new CosmosSingleton();
module.exports = cosmosSingleton;
