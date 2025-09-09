import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productImage',
  standalone: true, // <-- ¡importante si lo agregas en imports del componente!
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (typeof value === 'string') {
      return value;
    }

    const image = value.at(0);

    if (!image) return 'assets/images/no-image.jpg';

    return image;
  }
}
