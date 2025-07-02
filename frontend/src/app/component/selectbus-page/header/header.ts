import { Component, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls : ['./header.css']
})
export class Header {
  @Output() customBusClicked = new EventEmitter<void>();

  onCustomBusClick(){
    this.customBusClicked.emit();
  }
  departure: string = '';
  arrival: string = '';
  date: string = '';

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void{
    this.route.queryParams.subscribe(params => {
      const departure = params['departure'];
      const arrival = params['arrival'];
      const date = params['date'];
      
      this.departure = departure
      this.arrival = arrival
      this.date = date
    });
  }
}
