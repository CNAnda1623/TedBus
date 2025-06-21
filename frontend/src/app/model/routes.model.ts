export interface RoutesModel {
    _id:string,
    departureLocation: {
      name: string;
      subLocations: string[];
    };
    arrivalLocation: {
      name: string;
      subLocations: string[];
    };
    duration: number;
  }