import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})
export default class GenderPageComponent {
  route = inject(ActivatedRoute);

  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  productsService = inject(ProductsService)

  genderProductsResource = rxResource({
    request: () => ({gender: this.gender()}),
    loader: ({request}) => {
      return this.productsService.getProducts({gender: request.gender})
    }
  })

}
