import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { debounceTime, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProductSearchModel } from '../models/product/product-search.model';
import { ProductView } from '../models/product/product-view.model';
import { Observable } from 'rxjs';
@Injectable()
export class ProductService extends BaseService {

  url = API_URI.product;
  searchProduct(term: string) {
    const products = this.get<ProductSearchModel[]>(`${this.url}/?q=${term}`)
      .pipe(
        debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as ProductSearchModel[] : new Array<ProductSearchModel>()
            );
          }
        ));

    return products;
  }
  getAll(term: string): Observable<ProductView[]> {
    return this.get<ProductView[]>(
      `${this.url}/?q=${term}`
    );
  }
  getProduct(id: number): Observable<ProductView> {
    return this.get<ProductView>(
      `${this.url}/${id}`
    );
  }
  createProduct(product: ProductView): Observable<ProductView> {
    return this.post<ProductView>(`${this.url}`, product);
  }
  updateProduct(product: ProductView) {
    return this.put<ProductView>(`${this.url}/${product.id}`, product);
  }
  deleteProduct(id: number) {
    return this.delete(`${this.url}/${id}`);
  }
}
