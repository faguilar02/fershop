import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export default class ProductPageComponent {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productIdSlug = this.route.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug }),
    loader: ({ request }) => {
      return this.productsService.getProductByIdSlug(request.idSlug);
    },
  });
}
