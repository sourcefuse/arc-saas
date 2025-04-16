import { SubscriptionServiceApplication } from "./application";
export async function migrate(args:string[]){
    const existingSchema = args.includes('--rebuild') ? 'drop' :'alter';

    const app = new SubscriptionServiceApplication();
    await app.boot();
    await app.migrateSchema([existingSchema]);

    process.exit(0);
}
migrate(process.argv).catch(err=>{
    console.error('Error migrating the database schema:', err);
    process.exit(1);
});