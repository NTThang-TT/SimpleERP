import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">📦 Quản lý Vật tư</h1>
          <p class="page-subtitle">Theo dõi thiết bị, vật tư công ty theo phòng ban</p>
        </div>
      </div>
      <div class="coming-soon">
        <div class="coming-icon">🚧</div>
        <h2>Đang phát triển...</h2>
        <p>Module Vật tư sẽ được hoàn thiện trong Giai đoạn 4</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px; }
    .page-header { margin-bottom: 24px; }
    .page-title { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0; }
    .page-subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
    .coming-soon {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 400px; background: white; border-radius: 16px;
      border: 2px dashed #e2e8f0; text-align: center;
    }
    .coming-icon { font-size: 64px; margin-bottom: 16px; }
    .coming-soon h2 { font-size: 22px; color: #334155; margin: 0 0 8px; }
    .coming-soon p { font-size: 14px; color: #94a3b8; }
  `]
})
export class AssetListComponent {}
