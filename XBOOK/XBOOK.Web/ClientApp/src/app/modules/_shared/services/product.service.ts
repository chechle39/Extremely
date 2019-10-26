import { BaseService } from '@shared/service/base.service';
import { API_URI } from 'environments/app.config';
import { debounceTime, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProductSearchModel } from '../models/product/product-search.model';
import { ProductView } from '../models/product/product-view.model';
import { Observable } from 'rxjs';
import { ProductCategoryView } from '../models/product/product-category-view.model';
@Injectable()
export class ProductService extends BaseService {

  url = API_URI.product;
  // searchProduct(term: string) {
  //   const products = this.get<ProductSearchModel[]>(`${this.url}/?q=${term}`)
  //     .pipe(
  //       debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
  //       map(
  //         (data: any) => {
  //           return (
  //             data.length !== 0 ? data as ProductSearchModel[] : new Array<ProductSearchModel>()
  //           );
  //         }
  //       ));

  //   return products;
  // }

  searchProduct(term: any) {
    const products = this.post<ProductSearchModel[]>(`${API_URI.productGetAll}`, term)
      .pipe(
      //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
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
  getProduct(id: any): Observable<ProductView> {
    return this.post<ProductView>(
      `${API_URI.productById}`, id
    );
  }
  createProduct(product: any): Observable<ProductView> {
    return this.post<ProductView>(`${API_URI.createProduct}`, product);
  }
  updateProduct(product: any) {
    return this.put<ProductView>(`${API_URI.updateProduct}`, product);
  }
  deleteProduct(id: any) {
    return this.post(`${API_URI.deleteProduct}/${id}`, id);
  }
  getCategory(categoryId: any): Observable<ProductCategoryView> {
    return this.post<ProductCategoryView>(`${API_URI.categoryById}`, categoryId)
  }
  getAllCategory(): Observable<ProductCategoryView> {
    return this.post<ProductCategoryView>(`${API_URI.categoryGetAll}`, null);
  }
}
