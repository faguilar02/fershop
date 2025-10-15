import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/products-response.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);
  product = input.required<Product>();
  router = inject(Router);
  wasSaved = signal<boolean>(false);

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [['']],
    tags: [''],

    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  onSelectedButton(size: string) {
    const currentValues = this.productForm.value.sizes ?? [];

    if (currentValues.includes(size)) {
      currentValues.splice(currentValues.indexOf(size), 1);
    } else {
      currentValues.push(size);
    }

    this.productForm.patchValue({ sizes: currentValues });
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim()),
    };

    console.log(productLike, this.product().id);

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike)
      );

      this.router.navigate(['/admin/product', product.id]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
