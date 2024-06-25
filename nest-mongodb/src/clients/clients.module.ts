// src/clients/clients.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client, ClientSchema } from '../schemas/client.schema';
import { ProductsModule } from '../products/products.module'; // Import ProductsModule, not ProductsService

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
        ProductsModule, // Import ProductsModule here
    ],
    controllers: [ClientsController],
    providers: [ClientsService], // ClientsService should be the only service in the providers array
})
export class ClientsModule {}
