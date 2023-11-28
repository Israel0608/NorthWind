import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import { ResourceNotFound } from "../3-models/error-models";
import ProductModel from "../3-models/product-model";
import appConfig from "../2-utils/app-config";
import { fileSaver } from "uploaded-file-saver";


// get All product:
class ProductsService {
    public async getAllProducts(): Promise<ProductModel[]> {

        const sql = `SELECT
         ProductId AS id, 
         ProductName AS name, 
         UnitPrice AS price,
         UnitsInStock AS stock,
         CONCAT('${appConfig.appHost}', '/api/products/', ImageName) AS imageUrl
         FROM products`;

        const products = await dal.execute(sql);

        return products;
    }

    //  get One product:
    public async getOneProducts(id: number): Promise<ProductModel[]> {

        const sql = `SELECT
         ProductId AS id, 
         ProductName AS name, 
         UnitPrice AS price,
         UnitsInStock AS stock
         CONACT('${appConfig.appHost}', '/api/products/', ImageName) AS imageUrl
         FROM products
         WHERE ProductID = ${id}`

        const products = await dal.execute(sql);

        const product = products[0];

        if (!product) throw new ResourceNotFound(id);

        return product;
    }



    // Add product:
    public async addproduct(product: ProductModel): Promise<ProductModel> {

        product.postValidate();

        const imageName = await fileSaver.add(product.image);

        const sql = `INSERT INTO products(ProductName, UnitPrice, UnitsInStock, ImageName)
        VALUES('${product.name}', ${product.price}, ${product.stock}, '${imageName}')`;

        const info: OkPacket = await dal.execute(sql);

        product.id = info.insertId;

        delete product.image;

        product.imageUrl = appConfig.appHost + "/api/products/" + imageName;

        return product;
    }

    // public async addproduct(product: ProductModel): Promise<ProductModel> {

    //     product.validate();

    //     const sql = `CALL AddProduct('${product.name}', ${product.price}, ${product.stock})`;

    //     const info: OkPacket = await dal.execute(sql);

    //     product.id = info.insertId;

    //     return product;
    // }


    public async updateproduct(product: ProductModel): Promise<ProductModel> {

        product.putValidate();

        // Get exisiting image name;
        const existingImageName = await this.getExistingImageName(product.id);

        // Get new or exisiting and get exisiting update image name:
        const imageName = product.image ? await fileSaver.update(existingImageName, product.image) : existingImageName

        const sql = `UPDATE products SET
        ProductName = '${product.name}',
        UnitPrice = '${product.price}',
        UnitsInStock = '${product.stock}',
        ImageName = '${imageName}'
        WHERE ProductID = ${product.id}`;

        const info: OkPacket = await dal.execute(sql);

        if (info.affectedRows === 0) throw new ResourceNotFound(product.id)

        delete product.image;

        product.imageUrl = appConfig.appHost + "/api/products/" + imageName;

        return product;
    }

    private async getExistingImageName(id: number): Promise<string> {
        const sql = `SELECT ImageName FROM products WHERE productId = ${id}`;
        const products = await dal.execute(sql);
        const product = products[0];
        if (!product) return "";
        return product.ImageName
    }

    // DELETE product:
    public async deleteproduct(id: number): Promise<void> {

        // Get existing image Name:
        const existingImageName = await this.getExistingImageName(id);

        // Create SQL delete query:
        const sql = `DELETE FROM products WHERE ProductID = ${id}`

        // Delete image From disk
        const info: OkPacket = await dal.execute(sql);

        // If id not pound
        await fileSaver.delete(existingImageName);

        if (info.affectedRows === 0) throw new ResourceNotFound(id)
    }


    // Get pproducts by price:
    public async getProductsByPrice(min: number, max: number): Promise<ProductModel[]> {

        // Create query 
        const sql = `SELECT
        ProductId AS id, 
         ProductName AS name, 
         UnitPrice AS price,
         UnitsInStock AS stock
        FROM Products WHERE UnitPrice BETWEEN ${min} AND ${max}`;

        const products = await dal.execute(sql);

        return products;
    }

    public async getProductsByCategory(categoryID: number): Promise<ProductModel[]> {

        const sql = `CALL GetProductsByCategory(${categoryID})`;
        const containerArr = await dal.execute(sql);
        const products = containerArr[0];
        return products;
    }
    
}







const productsService = new ProductsService();

export default productsService;