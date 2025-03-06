import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, UploadComponent]
})
export class AppComponent {
  title = 'Ecomply Anonymize Application';
}