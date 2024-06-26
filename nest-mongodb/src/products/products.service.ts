import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async updateProduct(id: string, updateProductDto: CreateProductDto): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async updateProductByName(productName: string, updateProductDto: CreateProductDto): Promise<Product> {
        const updatedProduct = await this.productModel.findOneAndUpdate({ name: productName }, updateProductDto, { new: true }).exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with name ${productName} not found`);
        }
        return updatedProduct;
    }

    async removeProduct(id: string): Promise<void> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    async findByName(productName: string): Promise<Product> {
        const product = await this.productModel.findOne({ name: productName }).exec();
        if (!product) {
            throw new NotFoundException(`Product with name ${productName} not found`);
        }
        return product;
    }
}
