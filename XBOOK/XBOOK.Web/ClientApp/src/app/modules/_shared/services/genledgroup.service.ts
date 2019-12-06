import { BaseService } from '@shared/service/base.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URI } from 'environments/app.config';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable()
export class GenLedGroupService extends BaseService {
    searchGen(request: any) {
        const gen = this.post<any[]>(`${API_URI.getGengroup}`,request)
          .pipe(
          //  debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
            map(
              (data: any) => {
                return (
                  data.length !== 0 ? data as any[] : new Array<any>()
                );
              }
            ));
    
        return gen;
    }
    exportCSV(request: any){
     const data = this.postcsv<any[]>(`${API_URI.exportCSVgroup}`,request).subscribe(rs =>{
         this.downLoadFile(rs, "text/csv")
      })
      return data;
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    saveAs(blob, "GeneralLedger.csv");
    // let pwa = window.open(url);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //     alert( 'Please disable your Pop-up blocker and try again.');
    // }
}
}