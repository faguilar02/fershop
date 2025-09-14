import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
@Pipe({
  name: 'productImage',
  standalone: true, // <-- ¡importante si lo agregas en imports del componente!
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value.at(0);

    if (!image) return 'assets/images/no-image.jpg';

    return `${baseUrl}/files/product/${image}`;
  }
}
