import Joi from "joi";
import { Validation } from "./error-models";
import { UploadedFile } from "express-fileupload";


class ProductModel {
    public id: number;
    public name: string;
    public price: number;
    public stock: number;
    public image: UploadedFile;
    public imageUrl: string;

    public constructor(product: ProductModel) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.stock = product.stock;
        this.image = product.image;
        this.imageUrl = product.imageUrl;
    }

    // POST Validation schema
    private static postValidationSchema = Joi.object({
        id: Joi.number().forbidden(),
        name: Joi.string().required().min(2).max(50),
        price: Joi.number().required().min(0).max(1000),
        stock: Joi.number().required().min(0).max(1000).integer(),
        image: Joi.object().required(),
        imageUrl: Joi.string().optional().min(50).max(200)
    });

    // PUT Validation 
    private static putValidationSchema = Joi.object({
        id: Joi.number().required().integer().positive(),
        name: Joi.string().required().min(2).max(50),
        price: Joi.number().required().min(0).max(1000),
        stock: Joi.number().required().min(0).max(1000).integer(),
        image: Joi.object().optional(),
        imageUrl: Joi.string().optional().min(50).max(200)
    });

    public postValidate(): void {
        const result = ProductModel.postValidationSchema.validate(this);
        if (result.error?.message) throw new Validation(result.error.message);
        // if(this.image.size > 100000) throw new Validation("Image To large");
    }

    public putValidate(): void {
        const result = ProductModel.putValidationSchema.validate(this);
        if (result.error?.message) throw new Validation(result.error.message);
        // if(this.image.size > 100000) throw new Validation("Image To large");
    }
}

export default ProductModel;