import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProductSearchModel } from '../models/product/product-search.model';
import { ProductView } from '../models/product/product-view.model';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { ProductCategoryView } from '../models/product/product-category-view.model';
import { BaseService } from '../../../shared/service/base.service';
import { API_URI } from '../../../../environments/app.config';
@Injectable()
export class ProductService extends BaseService {
  searchProduct(term: any) {
    const products = this.post<ProductSearchModel[]>(`${API_URI.productGetAll}`, term)
      .pipe(
      //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as ProductSearchModel[] : new Array<ProductSearchModel>()
            );
          },
        ));

    return products;
  }
  searchProductForSearch(term: any) {
    const products = this.post<ProductSearchModel[]>(`${API_URI.searchproductGetAll}`, term)
      .pipe(
      //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length !== 0 ? data as ProductSearchModel[] : new Array<ProductSearchModel>()
            );
          },
        ));

    return products;
  }
  getProduct(id: any): Observable<ProductView> {
    return this.post<ProductView>(
      `${API_URI.productById}`, id,
    );
  }
  createProduct(product: any): Observable<ProductView> {
    return this.post<ProductView>(`${API_URI.createProduct}`, product);
  }
  updateProduct(product: any) {
    return this.put<ProductView>(`${API_URI.updateProduct}`, product);
  }
  deleteProduct(id: any) {
    return this.post(`${API_URI.deleteProduct}`, id);
  }
  getCategory(categoryId: any): Observable<ProductCategoryView> {
    return this.post<ProductCategoryView>(`${API_URI.categoryById}`, categoryId);
  }
  getAllCategory(): Observable<ProductCategoryView> {
    return this.post<ProductCategoryView>(`${API_URI.categoryGetAll}`, null);
  }
  createImportProduct(request: any): Observable<any> {
    return this.post<any>(`${API_URI.createImportProduct}`, request);
  }
  ExportProduct(request: any) {
    const data = this.postcsv<any[]>(`${API_URI.ExportProduct}`, request).subscribe(rs => {
      this.downLoadFile(rs, 'text/csv');
    });
    return data;
  }
  downLoadFile(data: any, type: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const blob = new Blob(['\ufeff', data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    saveAs(blob, 'Product.csv');
  }
  GetFieldNameProduct(files: any): Observable<any> {
    return this.postUploadFile<any>(`${API_URI.GetFieldName}`, files);
  }
}
