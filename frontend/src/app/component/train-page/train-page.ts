import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SearchBar, SearchParams } from '../shared/search-bar/search-bar';

export interface TrainClassAvailability {
  classCode: string; // '1A', '2A', '3A', 'SL', 'CC'
  className: string;
  fare: number;
  status: 'AVL' | 'RAC' | 'WL';
  count: number;
  updatedAt: string;
}

export interface TrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Express';
  fromStation: { code: string; name: string };
  toStation: { code: string; name: string };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: { day: string; runs: boolean }[];
  pantryAvailable: boolean;
  classes: TrainClassAvailability[];
}

@Component({
  selector: 'app-train-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchBar],
  templateUrl: './train-page.html',
  styleUrls: ['./train-page.css']
})
export class TrainPage implements OnInit {
  fromStation: string = 'New Delhi (NDLS)';
  toStation: string = 'Jaipur Jn (JP)';
  travelDate: string = '';
  selectedClass: string = 'All Classes';
  selectedQuota: string = 'General';

  // Filters state
  filterTrainTypes: { [key: string]: boolean } = {
    'Vande Bharat': false,
    'Rajdhani': false,
    'Shatabdi': false,
    'Express': false
  };
  filterClasses: { [key: string]: boolean } = {
    '1A': false,
    '2A': false,
    '3A': false,
    'SL': false,
    'CC': false
  };
  filterPantryOnly: boolean = false;
  filterAvailableOnly: boolean = false;

  // Selected Booking Item
  selectedTrain: TrainItem | null = null;
  selectedClassTile: TrainClassAvailability | null = null;

  // Active Accordion Tab in train cards (trainId -> active tab index)
  activeCardTabs: { [trainId: string]: number } = {};

  // Mock / Loaded Trains
  trainsList: TrainItem[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date();
    this.travelDate = today.toISOString().split('T')[0];

    this.route.queryParams.subscribe(params => {
      if (params['from']) this.fromStation = params['from'];
      if (params['to']) this.toStation = params['to'];
      if (params['date']) this.travelDate = params['date'];
      if (params['class']) this.selectedClass = params['class'];
      if (params['quota']) this.selectedQuota = params['quota'];
      this.loadTrains();
    });
  }

  loadTrains(): void {
    // Standard realistic train catalogue across major corridors
    this.trainsList = [
      {
        id: 'tr-1',
        trainNumber: '20978',
        trainName: 'Chandigarh - Ajmer Vande Bharat',
        trainType: 'Vande Bharat',
        fromStation: { code: 'NDLS', name: 'New Delhi' },
        toStation: { code: 'JP', name: 'Jaipur Junction' },
        departureTime: '06:10',
        arrivalTime: '10:05',
        duration: '3h 55m',
        runningDays: [
          { day: 'M', runs: true }, { day: 'T', runs: true }, { day: 'W', runs: false },
          { day: 'T', runs: true }, { day: 'F', runs: true }, { day: 'S', runs: true }, { day: 'S', runs: true }
        ],
        pantryAvailable: true,
        classes: [
          { classCode: 'CC', className: 'AC Chair Car', fare: 890, status: 'AVL', count: 142, updatedAt: '10m ago' },
          { classCode: 'EC', className: 'Executive Class', fare: 1650, status: 'AVL', count: 28, updatedAt: '12m ago' }
        ]
      },
      {
        id: 'tr-2',
        trainNumber: '12015',
        trainName: 'New Delhi - Daurai Ajmer Shatabdi Express',
        trainType: 'Shatabdi',
        fromStation: { code: 'NDLS', name: 'New Delhi' },
        toStation: { code: 'JP', name: 'Jaipur Junction' },
        departureTime: '06:10',
        arrivalTime: '10:40',
        duration: '4h 30m',
        runningDays: [
          { day: 'M', runs: true }, { day: 'T', runs: true }, { day: 'W', runs: true },
          { day: 'T', runs: true }, { day: 'F', runs: true }, { day: 'S', runs: true }, { day: 'S', runs: true }
        ],
        pantryAvailable: true,
        classes: [
          { classCode: 'CC', className: 'Chair Car', fare: 650, status: 'AVL', count: 85, updatedAt: '5m ago' },
          { classCode: 'EC', className: 'Exec Chair Car', fare: 1390, status: 'RAC', count: 6, updatedAt: '8m ago' }
        ]
      },
      {
        id: 'tr-3',
        trainNumber: '12958',
        trainName: 'Swarna Jayanti Rajdhani Express',
        trainType: 'Rajdhani',
        fromStation: { code: 'NDLS', name: 'New Delhi' },
        toStation: { code: 'JP', name: 'Jaipur Junction' },
        departureTime: '19:55',
        arrivalTime: '00:05',
        duration: '4h 10m',
        runningDays: [
          { day: 'M', runs: true }, { day: 'T', runs: true }, { day: 'W', runs: true },
          { day: 'T', runs: true }, { day: 'F', runs: true }, { day: 'S', runs: true }, { day: 'S', runs: true }
        ],
        pantryAvailable: true,
        classes: [
          { classCode: '3A', className: '3 Tier AC', fare: 1040, status: 'AVL', count: 48, updatedAt: '15m ago' },
          { classCode: '2A', className: '2 Tier AC', fare: 1540, status: 'AVL', count: 12, updatedAt: '10m ago' },
          { classCode: '1A', className: 'First AC', fare: 2150, status: 'WL', count: 4, updatedAt: '1m ago' }
        ]
      },
      {
        id: 'tr-4',
        trainNumber: '14660',
        trainName: 'Mandore Superfast Express',
        trainType: 'Express',
        fromStation: { code: 'NDLS', name: 'New Delhi' },
        toStation: { code: 'JP', name: 'Jaipur Junction' },
        departureTime: '21:20',
        arrivalTime: '02:30',
        duration: '5h 10m',
        runningDays: [
          { day: 'M', runs: true }, { day: 'T', runs: true }, { day: 'W', runs: true },
          { day: 'T', runs: true }, { day: 'F', runs: true }, { day: 'S', runs: true }, { day: 'S', runs: true }
        ],
        pantryAvailable: false,
        classes: [
          { classCode: 'SL', className: 'Sleeper Class', fare: 245, status: 'AVL', count: 110, updatedAt: '4m ago' },
          { classCode: '3A', className: '3 Tier AC', fare: 680, status: 'AVL', count: 32, updatedAt: '14m ago' },
          { classCode: '2A', className: '2 Tier AC', fare: 990, status: 'RAC', count: 11, updatedAt: '2m ago' }
        ]
      }
    ];
  }

  handleSearch(params: SearchParams): void {
    this.fromStation = params.from;
    this.toStation = params.to;
    this.travelDate = params.date;
    if (params.trainClass) this.selectedClass = params.trainClass;
    if (params.quota) this.selectedQuota = params.quota;
    this.loadTrains();
  }

  get filteredTrains(): TrainItem[] {
    return this.trainsList.filter(train => {
      // Type filter
      const activeTypes = Object.keys(this.filterTrainTypes).filter(k => this.filterTrainTypes[k]);
      if (activeTypes.length > 0 && !activeTypes.includes(train.trainType)) {
        return false;
      }
      // Pantry filter
      if (this.filterPantryOnly && !train.pantryAvailable) {
        return false;
      }
      // Available only filter
      if (this.filterAvailableOnly) {
        const hasAvl = train.classes.some(c => c.status === 'AVL');
        if (!hasAvl) return false;
      }
      return true;
    });
  }

  toggleCardTab(trainId: string, tabIdx: number): void {
    if (this.activeCardTabs[trainId] === tabIdx) {
      delete this.activeCardTabs[trainId];
    } else {
      this.activeCardTabs[trainId] = tabIdx;
    }
  }

  selectClassTile(train: TrainItem, cls: TrainClassAvailability): void {
    this.selectedTrain = train;
    this.selectedClassTile = cls;
  }

  clearSelection(): void {
    this.selectedTrain = null;
    this.selectedClassTile = null;
  }

  proceedWithTrainBooking(): void {
    if (!this.selectedTrain || !this.selectedClassTile) return;

    const bookingPayload = {
      product: 'train',
      trainNumber: this.selectedTrain.trainNumber,
      trainName: this.selectedTrain.trainName,
      fromStation: this.selectedTrain.fromStation,
      toStation: this.selectedTrain.toStation,
      departureTime: this.selectedTrain.departureTime,
      arrivalTime: this.selectedTrain.arrivalTime,
      date: this.travelDate,
      classCode: this.selectedClassTile.classCode,
      quota: this.selectedQuota,
      fare: this.selectedClassTile.fare,
      totalFare: this.selectedClassTile.fare + 35 // Base + IRCTC convenience fee
    };

    sessionStorage.setItem('current_train_booking', JSON.stringify(bookingPayload));
    this.router.navigate(['/payment']);
  }
}
