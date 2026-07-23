import 'dotenv/config';
import { logger } from '../../utils/logger.js';
import { connectDB, getDb } from './db.context.js';
import { devicesTable, telemetryTable, usersTable } from './schema.js';
import { BcryptService } from '../../services/hash.service.js';

const rawTelemetryData = [
    { device_id: "DEV-1004", battery: 27.7, temperature: 28.3, lat: 29.7698, lng: 31.52071, status: "OK", timestamp: "2026-07-10T07:54:03Z" },
    { device_id: "DEV-1004", battery: 76.9, temperature: 30.4, lat: 29.785596, lng: 30.892424, status: "OK", timestamp: "2026-07-10T08:20:02Z" },
    { device_id: "DEV-1003", battery: 70.9, temperature: 24.1, lat: 29.815402, lng: 30.944606, status: "OK", timestamp: "2026-07-10T06:08:21Z" },
    { device_id: "DEV-1005", battery: 40.9, temperature: 33.7, lat: 30.232593, lng: 31.311273, status: "OK", timestamp: "2026-07-10T08:06:09Z" },
    { device_id: "DEV-1004", battery: 74.8, temperature: 24.0, lat: 30.08255, lng: 31.070623, status: "OK", timestamp: "2026-07-10T08:44:00Z" },
    { device_id: "DEV-1001", battery: 91.6, temperature: 19.0, lat: 29.874403, lng: 31.612753, status: "OK", timestamp: "2026-07-10T06:08:28Z" },
    { device_id: "DEV-1004", battery: 96.6, temperature: 40.3, lat: 30.263204, lng: 30.89349, status: "OK", timestamp: "2026-07-10T06:02:16Z" },
    { device_id: "DEV-1005", battery: 23.7, temperature: 32.6, lat: 29.693079, lng: 31.445749, status: "OK", timestamp: "2026-07-10T08:00:22Z" }
];

async function seed() {
    await connectDB();
    const db = getDb()

    try {
        logger.info('Creating owner user...');
        const [user] = await db.insert(usersTable).values({
            name: 'Admin',
            email: 'admin@cypod.com',
            passwordHash: await new BcryptService().hash("12345")
        }).returning();

        const uniqueDeviceNames = [...new Set(rawTelemetryData.map(d => d.device_id))];

        logger.info(`Creating ${uniqueDeviceNames.length} devices...`);
        const insertedDevices = await db.insert(devicesTable).values(
            uniqueDeviceNames.map(name => ({
                name,
                ownerId: user.id
            }))
        ).returning();

        const deviceIdMap = insertedDevices.reduce((acc, device) => {
            acc[device.name] = device.id;
            return acc;
        }, {} as Record<string, number>);

        logger.info(`Inserting ${rawTelemetryData.length} telemetry records...`);
        const telemetryToInsert = rawTelemetryData.map(data => {
            const payload: any = {
                deviceId: deviceIdMap[data.device_id],
                battery: data.battery,
                temperature: data.temperature,
                lat: data.lat,
                lng: data.lng,
                status: data.status,
                timestamp: new Date(data.timestamp),
            };

            return payload;
        });

        await db.insert(telemetryTable).values(telemetryToInsert);

        logger.info('Seeding completed successfully!');
    } catch (error) {
        logger.error(error, 'Error during seeding');
        process.exit(1);
    }
}

seed();