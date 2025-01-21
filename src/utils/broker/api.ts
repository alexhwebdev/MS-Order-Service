import axios from "axios";
import { APIError, NotFoundError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/product.dto";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:9001"; // env variable

export const GetProductDetails = async (
  productId: number
) => {
  // return {
  //   stock: 10,
  //   price: 100
  // }
  console.log('BROKER/api : GetProductDetails 4 productId', productId)
  try {
    // This is calling 'catalog.routes.ts' endpoint 'router.get("/products/:id")'
    const response = await axios.get(
      `${CATALOG_BASE_URL}/products/${productId}`
    );
    // console.log('GetProductDetails response ', response)
    const product = response.data;
    console.log('GetProductDetails product ', product)

    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};
