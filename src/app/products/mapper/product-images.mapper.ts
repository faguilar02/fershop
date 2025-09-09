import {
  Product,
  ProductsResponse,
} from '@products/interfaces/products-response.interface';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

export class ProductMapper {
  static mapImgPathsToImgsUrls(images: string[]) {
    return images.map((img) => `${baseUrl}/files/product/${img}`);
  }
}
