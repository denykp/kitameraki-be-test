## Running the Project

To run this project, follow these steps:

1. Clone the repository by running `git clone https://github.com/your-username/kitameraki-be-test.git`
2. Install the dependencies by running `npm install`
3. Set the `local.settings.json` file, since there's no secret stuff inside it, i attach it into `local.settings.json.example`, you just need to rename it back to `local.settings.json`
4. I use local emulator for running the Azure Cosmos DB, so the COSMOSDB_CONN should be the same on all machine, but if you use the cloud version of Azure Cosmos DB, you should change `COSMOSDB_CONN` with the connection string provided by your DB configuration
5. Start the Azure Functions emulator by running `npm run start`, or `npm run dev` if you want your change to be watched and automatically reloaded the project
6. Open a web browser and navigate to `http://localhost:7071/api/tasks` to test the API
7. Use a tool like Postman to test the API endpoints
