import express, { Request, Response, NextFunction } from "express";
import productsService from "../5-services/products-service";
import ProductModel from "../3-models/product-model";
import StatusCode from "../3-models/status-codes";
import { fileSaver } from "uploaded-file-saver";
import verifyToken from "../4-middleware/verify-token";
import verifyAdmin from "../4-middleware/verify-admin";


const router = express.Router();

// GET http://localhost:4000/api/products
router.get("/products", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const products = await productsService.getAllProducts();
        response.json(products);
    } catch (err: any) {
        next(err)
    }
})
router.get("/products/:id([0-9]+)", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const id = +reqest.params.id;
        const products = await productsService.getOneProducts(id);
        response.json(products);
    } catch (err: any) {
        next(err)
    }
})

router.post("/products", verifyToken, async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        reqest.body.image = reqest.files?.image; // Set uploaded iamge;
        const product = new ProductModel(reqest.body)
        const addedProduct = await productsService.addproduct(product)
        response.status(StatusCode.Created).json(addedProduct);
    } catch (err: any) {
        next(err)
    }
})

// update product
router.put("/products/:id([0-9]+)", verifyToken ,async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        reqest.body.id = +reqest.params.id;
        reqest.body.image = reqest.files?.image;
        const product = new ProductModel(reqest.body)
        const updatedProduct = await productsService.updateproduct(product)
        response.json(updatedProduct);
    } catch (err: any) {
        next(err)
    }
})

// delete product
router.delete("/products/:id([0-9]+)", verifyAdmin ,async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        await productsService.deleteproduct(id);
        response.sendStatus(StatusCode.NoContent);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/products-by-price/:min/:max", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const min = +reqest.params.min
        const max = +reqest.params.max
        const products = await productsService.getProductsByPrice(min, max);
        response.json(products);
    } catch (err: any) {
        next(err)
    }
})

router.get("/products-by-price2", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const min = +reqest.query.min
        const max = +reqest.query.max
        const products = await productsService.getProductsByPrice(min, max);
        response.json(products);
    } catch (err: any) {
        next(err)
    }
})

router.get("/products-by-category", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const categoryID = +reqest.query.categoryID
        const products = await productsService.getProductsByCategory(categoryID);
        response.json(products);
    } catch (err: any) {
        next(err)
    }
})

router.get("/products/:imageName", async (reqest: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = reqest.params.imageName;
        const absolutePath = fileSaver.getFilePath(imageName) 
        response.sendFile(absolutePath);
    } catch (err: any) {
        next(err)
    }
})

export default router;