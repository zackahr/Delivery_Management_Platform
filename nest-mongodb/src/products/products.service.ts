// src/products/products.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

    async createProduct(createProductDto: CreateProductDto) {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    async findAll() {
        return this.productModel.find().exec();
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }
    
    async findByName(productName: string) {
        const product = await this.productModel.findOne({ name: productName }).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async updateProduct(id: string, updateProductDto: CreateProductDto) {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
        if (!updatedProduct) {
            throw new NotFoundException('Product not found');
        }
        return updatedProduct;
    }

    async removeProduct(id: string) {
        const deletedProduct = await this.productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
        return deletedProduct;
    }
}
