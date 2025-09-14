import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';
import { ProductsTableComponent } from '@products/components/products-table/products-table.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  router = inject(Router);
  paginationService = inject(PaginationService);
  currentPage = computed(() => this.paginationService.currentPage());
  productsPerPage = signal<number>(10);
  productsResource = rxResource({
    request: () => ({
      page: this.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
        limit: request.limit,
      });
    },
  });

  onPerPageChange(value: number) {
    this.productsPerPage.set(value);

    this.router.navigate([], {
      queryParams: { page: 1 },
      queryParamsHandling: 'merge'
    });
  }
}
