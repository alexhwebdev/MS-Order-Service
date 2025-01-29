import axios from "axios";
import { AuthorizeError, NotFoundError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/User.Model";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:9001"; // env variable

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetProductDetails = async (
  productId: number
) => {
  console.log('BROKER/api : GetProductDetails 4 productId', productId)
  try {
    // This is calling 'catalog.routes.ts' endpoint 'router.get("/products/:id")'
    const response = await axios.get(
      `${CATALOG_BASE_URL}/products/${productId}`
    );
    // console.log('GetProductDetails response ', response)
    const product = response.data;
    console.log('GetProductDetails 5 product ', product)

    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {
      ids,
    });
    return response.data as Product[];
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("error on getting stock details");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    // Assign token into request header
    // axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
      // Assign token into request header
      headers: {
        Authorization: token,
      },
    });
    console.log("STEP 0.1 : api.ts ValidateUser : response", response.data);

    if (response.status !== 200) {
      throw new AuthorizeError("user not authorized");
    }
    return response.data as User;
  } catch (error) {
    throw new AuthorizeError("user not authorized");
  }
};


/*
+ L23 37mm
+ This api.ts file is for Synchronous communication calls
+ We cannot wait for async events to happen, like update data

*/