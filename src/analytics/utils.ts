import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import csv from "csv-parser";

// initialize the S3 client
const s3 = new S3Client({
    region: "ca-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// def a function to load the CSV from AWS S3
export async function loadCsvFromAWSS3(bucketName: string, key: string) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const { Body } = await s3.send(command);

        const stream = Body as Readable;

        const results: any[] = [];

        return new Promise<any[]>((resolve, reject) => {
            stream
                .pipe(csv())
                .on("data", (data: any) => results.push(data))
                .on("end", () => resolve(results))
                .on("error", (error: any) => reject(error));
        });
    } catch (error) {
        console.error("Error loading CSV from AWS S3:", error);
        throw error;
    }
}
