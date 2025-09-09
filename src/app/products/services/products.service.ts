import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/products-response.interface';
import { ProductMapper } from '@products/mapper/product-images.mapper';
import { delay, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(options: Options): Observable<Product[]> {
    const { limit = 9, offset = 9, gender = '' } = options;
    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        map(({ products }) =>
          products.map((product) => ({
            ...product,
            images: ProductMapper.mapImgPathsToImgsUrls(product.images),
          }))
        )
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(

      map((product) => ({
        ...product,
        images: ProductMapper.mapImgPathsToImgsUrls(product.images),
      })),
      tap((product) => console.log(product))
    );
  }
}
