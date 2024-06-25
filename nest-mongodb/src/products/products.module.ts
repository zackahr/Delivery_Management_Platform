// src/products/products.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService], // Ensure ProductsService is provided here
    exports: [ProductsService], // Export ProductsService if needed by other modules
})
export class ProductsModule {}
