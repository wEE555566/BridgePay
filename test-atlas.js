const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Pawee:Pawee@cluster0.rcmx2l1.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
