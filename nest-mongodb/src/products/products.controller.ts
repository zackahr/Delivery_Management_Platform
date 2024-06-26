// src/products/products.controller.ts

import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.createProduct(createProductDto);
    }

    @Get()
    async findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateById(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
        return this.productsService.updateProduct(id, updateProductDto);
    }

    @Patch('name/:productName')
    @UsePipes(new ValidationPipe())
    async updateByName(@Param('productName') productName: string, @Body() updateProductDto: CreateProductDto) {
        return this.productsService.updateProductByName(productName, updateProductDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.removeProduct(id);
    }

    @Get('name/:productName')
    async findByName(@Param('productName') productName: string) {
        return this.productsService.findByName(productName);
    }
}
