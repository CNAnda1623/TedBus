import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: false,
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css']
})
export class DialogComponent {
  to:string = '';
  position:number = 0;
  from: string = '';
  nobus: number = 0;
  // dataSource=Element_data;
  displayedColumns: string[] = ['position','from', 'to', 'nobus'];
}

