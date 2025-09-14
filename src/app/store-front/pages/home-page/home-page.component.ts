import { Component, computed, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = computed(() => this.paginationService.currentPage());
  authService = inject(AuthService);
  // route = inject(ActivatedRoute);
  // currentPage = toSignal(
  //   this.route.queryParamMap.pipe(
  //     map((params) => (params.get('page') ? +params.get('page')! : 1)),
  //     map((page) => (isNaN(page) ? 1 : page))
  //   ),
  //   {
  //     initialValue: 1,
  //   }
  // );
  productsResource = rxResource({
    request: () => ({ page: this.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({ offset: request.page * 9 });
    },
  });
}
