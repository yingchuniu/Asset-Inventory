import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskModel } from './asset';

@Injectable({
  providedIn: 'root',
})
export class Risk {
  http = inject(HttpClient)
  apiUrl = 'http://localhost:3000/api/risk'
  getRisksByAssetId(assetId: number) {
    return this.http.get(`${this.apiUrl}/assets/${assetId}/risks`) as Observable<RiskModel[]>;
  }

  updateRisk(id: number, risk: any) {
    return this.http.put(`${this.apiUrl}/risks/${id}`, risk) as Observable<string>;
  }
}
