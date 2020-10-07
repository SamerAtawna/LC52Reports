import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Meal } from "../Models/Meal";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public $isLoggedIn = new BehaviorSubject(false);
  public $loggedResturant = new BehaviorSubject<any>(null);

  public isLogged = false;

  constructor(private http: HttpClient, private router: Router) {}

  getData(): Observable<Meal[]> {
    return this.http.get<Meal[]>("../../assets/data.json");
  }

  getResturants() {
    return this.http.get("../../assets/resturants.json");
  }

  login(resturant) {
    this.isLogged = true;
    this.$loggedResturant.next(resturant);
    this.$isLoggedIn.next(true);
    this.router.navigateByUrl("/reports");
  }

  logOut() {
    this.isLogged = false;
    this.$isLoggedIn.next(false);
    this.router.navigateByUrl("");
  }
}
