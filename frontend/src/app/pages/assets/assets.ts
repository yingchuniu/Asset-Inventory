import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Asset, AssetModel, RiskModel } from '../../services/asset';
import { Risk } from '../../services/risk';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Edit } from './edit/edit';
import { Insert } from './insert/insert';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assets',
  imports: [CommonModule, FormsModule],
  templateUrl: './assets.html',
  styleUrl: './assets.scss',
})
export class Assets {
  private cdr = inject(ChangeDetectorRef);
  private assetService = inject(Asset);
  private riskService = inject(Risk);
  modalService = inject(NgbModal);
  assets: AssetModel[] = [];

  selectedAsset: AssetModel | null = null;
  loading = false;
  errorMessage = '';
  keyword = '';
  risks: RiskModel[] = [];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  activeTab = 'assessment';
  ngOnInit() {
    // this.activeTab = 'assessment';
    this.GetAssets()


  }

  GetAssets(): void {
    //  this.loading = true;
    this.errorMessage = '';
    this.assetService.GetAssets(this.keyword).subscribe({
      next: (data) => {
        this.assets = data;
        this.loading = false;
        console.log(this.assets);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = '載入資產失敗';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchAssets(): void {
    this.GetAssets();
  }

  resetSearch(): void {
    this.keyword = '';
    this.GetAssets();
  }


  DeleteAsset(id: number): void {
    if (!confirm('確定要刪除這筆資料嗎？')) return;

    this.assetService.deleteAsset(id).subscribe({
      next: () => {
        this.GetAssets();
      },
      error: (err) => {
        console.error('刪除失敗', err);
      }
    });
  }

  openCreateModal(): void {

    const modal = this.modalService.open(Insert, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    modal.closed.subscribe(data => {
      if (data) {
        this.GetAssets()
      }
    })
  }

  openEditModal(model: AssetEdit): void {
    const modal = this.modalService.open(Edit, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    modal.componentInstance.EditModel = model
    modal.closed.subscribe(data => {
      if (data) {
        console.log(data)
        this.GetAssets()
      }
    })
  }

  sortAssets(column: string): void {

  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.assets.sort((a: any, b: any) => {

    let valueA = a[column];
    let valueB = b[column];

    if (valueA == null) valueA = '';
    if (valueB == null) valueB = '';

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA > valueB) {
      return this.sortDirection === 'asc' ? 1 : -1;
    }

    if (valueA < valueB) {
      return this.sortDirection === 'asc' ? -1 : 1;
    }

    return 0;
  });

}

}
export interface AssetEdit {
  id: number;
  asset_code: string;
  category: string;
  asset_name: string;
  confidentiality: number;
  integrity: number;
  availability: number;
  asset_value: number;
  asset_level: number;
  owner: string;


}